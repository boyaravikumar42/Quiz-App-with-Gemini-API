import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import SockJS from "sockjs-client/dist/sockjs";
import * as StompJs from "@stomp/stompjs";
import { FaCrown, FaMedal, FaUserAlt, FaClock, FaTrophy, FaInfoCircle } from "react-icons/fa";

const Leaderboard = () => {
  const { quizId } = useParams();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizStatus, setQuizStatus] = useState(null);
  const [quizDetails, setQuizDetails] = useState({}); // ✅ new state for quiz name & createdBy
  const stompClientRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchQuizAndParticipants = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/participants/leaderboard/${quizId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setParticipants(res.data || []);
      } catch (err) {
        toast.error("Failed to fetch quiz dashboard data!");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizAndParticipants();
  }, [quizId, token]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/quizzes/${quizId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setQuizStatus(res.data.status);
        setQuizDetails({
          name: res.data.title,
          createdBy: res.data.createdBy || "Unknown", // fallback
        });
      } catch (err) {
        toast.error("Failed to fetch quiz data!");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, token]);

  useEffect(() => {
    if (quizStatus === "LIVE" || quizStatus === "COMPLETED") {
      const stompClient = new StompJs.Client({
        webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_URL}/ws`),
        connectHeaders: { Authorization: `Bearer ${token}` },
        reconnectDelay: 5000,
        debug: (str) => console.log(str),
        onConnect: () => {
          console.log("✅ WebSocket connected");
          stompClient.subscribe(`/topic/leaderboard/${quizId}`, (message) => {
            try {
              setParticipants(JSON.parse(message.body));
            } catch (e) {
              console.error("Invalid leaderboard data", e);
            }
          });
        },
        onStompError: (frame) => {
          console.error("❌ STOMP error:", frame);
          toast.error("WebSocket connection error. Please refresh!");
        },
      });

      stompClient.activate();
      stompClientRef.current = stompClient;

      return () => {
        if (stompClientRef.current) {
          stompClientRef.current.deactivate();
          console.log("🛑 WebSocket disconnected");
        }
      };
    }
  }, [quizStatus, quizId, token]);

  const formatTime = (ms) => {
    if (!ms) return "-";
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loading)
    return <div className="text-center text-blue-600 font-semibold text-lg animate-pulse">Loading...</div>;

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-2xl mt-22 md:mt-22">
      {/* ✅ Quiz Name and Created By Section */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-blue-800">{quizDetails.name || "Quiz"}</h1>
        <p className="text-gray-600 text-lg">Created by: <span className="font-semibold">{quizDetails.createdBy}</span></p>
      </div>

      {quizStatus === "SCHEDULED" ? (
        <>
          <h2 className="text-3xl font-extrabold text-center text-blue-700 flex items-center justify-center gap-3 mb-6">
            👥 Quiz Participants
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-200 text-blue-900 text-lg">
                  <th className="p-3 text-left">Username</th>
                  <th className="p-3 text-left">Joined At</th>
                </tr>
              </thead>
              <tbody>
                {participants.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="text-center text-gray-500 p-4">
                      No participants joined yet.
                    </td>
                  </tr>
                ) : (
                  participants.map((p, index) => (
                    <tr key={p._id?.$oid || index} className="border-b hover:bg-blue-50 transition duration-200">
                      <td className="p-3 font-medium flex items-center gap-2"><FaUserAlt /> {p.username}</td>
                      <td className="p-3">{p.joinedAt ? new Date(p.joinedAt).toLocaleString() : "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-extrabold text-center text-blue-700 flex items-center justify-center gap-3 mb-6">
            <FaTrophy className="text-yellow-500 animate-bounce" /> Quiz Leaderboard
          </h2>

          {quizStatus === "LIVE" && (
            <p className="text-yellow-600 text-center flex items-center justify-center gap-2 mb-4">
              <FaInfoCircle /> Results are updating in real-time. Final rankings may change.
            </p>
          )}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-200 text-blue-900 text-lg">
                  <th className="p-3 text-left">Rank</th>
                  <th className="p-3 text-left">Username</th>
                  <th className="p-3 text-left">Score</th>
                  <th className="p-3 text-left">Time Taken</th>
                  <th className="p-3 text-left">Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {participants.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-500 p-4">
                      No participants found.
                    </td>
                  </tr>
                ) : (
                  participants.map((p, index) => {
                    let rowStyle = "";
                    let icon = <FaUserAlt className="text-gray-600" />;

                    if (index === 0) {
                      rowStyle = "bg-yellow-100 font-bold text-yellow-800";
                      icon = <FaCrown className="text-yellow-500 text-xl" />;
                    } else if (index === 1) {
                      rowStyle = "bg-gray-100 font-semibold text-gray-700";
                      icon = <FaMedal className="text-gray-500 text-lg" />;
                    } else if (index === 2) {
                      rowStyle = "bg-orange-100 font-medium text-orange-700";
                      icon = <FaMedal className="text-orange-500 text-lg" />;
                    }

                    return (
                      <tr key={p._id?.$oid || index} className={`border-b hover:bg-blue-50 transition duration-200 ${rowStyle}`}>
                        <td className="p-3 flex items-center gap-2">{icon} {index + 1}</td>
                        <td className="p-3 font-medium">{p.username}</td>
                        <td className="p-3 text-center font-semibold">{p.score}</td>
                        <td className="p-3 flex items-center gap-2"><FaClock /> {formatTime(p.timeTaken?.$numberLong || p.timeTaken)}</td>
                        <td className="p-3">{p.submittedAt ? new Date(p.submittedAt).toLocaleString() : "-"}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Leaderboard;
