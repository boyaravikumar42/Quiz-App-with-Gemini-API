import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Leaderboard = () => {
  const { quizId } = useParams();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/participants/leaderboard/${quizId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setParticipants(res.data);
      } catch (err) {
        toast.error("Failed to fetch leaderboard!");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [quizId]);

  const formatTime = (ms) => {
    if (!ms) return "-";
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loading) {
    return <div className="text-center text-blue-600">Loading leaderboard...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg mt-8 md:mt-12">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">🏆 Quiz Results</h2>

      {participants.length === 0 ? (
        <p className="text-gray-500">No participants found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-100 text-blue-700">
                <th className="p-2 text-left">Rank</th>
                <th className="p-2 text-left">Username</th>
                <th className="p-2 text-left">Score</th>
                <th className="p-2 text-left">Time Taken</th>
                <th className="p-2 text-left">Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p, index) => {
                let rowStyle = "";
                if (index === 0) rowStyle = "bg-yellow-200 font-bold"; // 1st place
                else if (index === 1) rowStyle = "bg-gray-200 font-semibold"; // 2nd place
                else if (index === 2) rowStyle = "bg-orange-200 font-medium"; // 3rd place

                return (
                  <tr key={p._id?.$oid || index} className={`border-b ${rowStyle}`}>
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{p.username}</td>
                    <td className="p-2">{p.score}</td>
                    <td className="p-2">{formatTime(p.timeTaken?.$numberLong || p.timeTaken)}</td>
                    <td className="p-2">
                      {p.submittedAt?.$date
                        ? new Date(p.submittedAt.$date).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
