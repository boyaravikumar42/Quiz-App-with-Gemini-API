import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLoginContext } from "../context/LoginContext";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaPlay,
  FaClock,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const QuizDetails = ({ quiz, onBack }) => {
  const { user } = useLoginContext();
  const [participant, setParticipant] = useState(null); // store participant details
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check participation
  useEffect(() => {
    const checkParticipation = async () => {
      if (!user || !quiz?.id) return;
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/participants/isJoined/${quiz.id}/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setParticipant(res.data); // user registered, may have participated
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setParticipant(null); // not registered
        } else {
          console.error("Failed to check participation", err);
        }
      }
    };
    checkParticipation();
  }, [quiz, user]);

  // Register
  const handleRegister = async () => {
    if (!user) {
      toast.error("You must be logged in to register!");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/participants/join`,
        { quizId: quiz.id, userId: user.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setParticipant(res.data);
      toast.success("Registered successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to register!");
    } finally {
      setLoading(false);
    }
  };

  const handleQuit = () => {
    setParticipant(null);
    toast.info("You have quit this quiz.");
  };

  const handleStart = () => {
    navigate(`/conduct-quiz/${quiz.id}`);
  };

  const handleResults = () => {
    navigate(`/leaderboard/${quiz.id}`);
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-2xl shadow-lg mt-8 md:mt-12">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center text-blue-600 hover:underline"
      >
        <FaArrowLeft className="mr-2" /> Back to Quizzes
      </button>

      {/* Title & Description */}
      <h3 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
        <FaCheckCircle className="text-blue-500" /> {quiz.title}
      </h3>
      <p className="text-gray-600">{quiz.description}</p>

      {/* Start Time */}
      <div className="flex items-center gap-2 text-gray-500">
        <FaCalendarAlt /> {new Date(quiz.startTime).toLocaleString()}
      </div>

      {/* Instructions */}
      <div>
        <h4 className="text-lg font-semibold mt-4 flex items-center gap-2 text-blue-600">
          <FaClock /> Instructions
        </h4>
        <ul className="list-disc list-outside text-gray-700 space-y-1 ml-5">
          <li>Read all questions carefully before answering. </li>
          <li>Once you start, the timer will begin immediately.</li>
          <li>Do not refresh the page during the quiz.</li>
          <li>Submit your answers before time runs out.</li>
          <li>There are {quiz.questionCount} MCQ questions.</li>
          <li>
            The time for the completion of quiz is {quiz.duration} minutes. Quiz
            will close automatically if time runs out.
          </li>
        </ul>
      </div>

      {/* Status Button */}
      <div>
        <button
          className={`px-3 py-1 rounded-lg text-xs font-bold cursor-default ${
            quiz.status === "LIVE"
              ? "text-red-700"
              : quiz.status === "SCHEDULED"
              ? "text-yellow-700"
              : "text-green-700"
          }`}
        >
          {quiz.status}
        </button>
      </div>

      {/* Action Button */}
      <div>
        {quiz.status === "COMPLETED" ? (
          <button
            onClick={handleResults}
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition flex justify-center items-center gap-2"
          >
            See Results
          </button>
        ) : !participant ? (
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex justify-center items-center gap-2"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        ) : quiz.status === "LIVE" && !participant.hasParticipated ? (
          <button
            onClick={handleStart}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition flex justify-center items-center gap-2"
          >
            <FaPlay /> Start Quiz
          </button>
        ) : quiz.status === "SCHEDULED" && participant ? (
          <button
            onClick={handleQuit}
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition flex justify-center items-center gap-2"
          >
             Quit
          </button>
        ) :(
          <button
            
            className="w-full text-red-500  py-2 rounded-lg hover:text-red-600 transition"
            disable={true}
          >
            You are already participated...!
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizDetails;
