import React, { useEffect, useState } from "react";
import axios from "axios";
import QuizDetails from "./QuizDetails";
import { FaClock, FaPlayCircle, FaCalendarAlt, FaListUl, FaUserAlt, FaQrcode, FaEvernote, FaAccessibleIcon, FaAirbnb, FaAnchor, FaBell, FaCoins, FaDiceTwo, FaGenderless, FaGem, FaEmpire } from "react-icons/fa";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/quizzes/all`);
        // ✅ Sort quizzes: LIVE → SCHEDULED → COMPLETED
        const sortedQuizzes = response.data.sort((a, b) => {
          const order = { LIVE: 0, SCHEDULED: 1, COMPLETED: 2 };
          return order[a.status] - order[b.status];
        });
        setQuizzes(sortedQuizzes);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        setMessage("❌ Failed to load quizzes.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  // ✅ Status Badge Colors
  const getStatusStyles = (status) => {
    switch (status) {
      case "LIVE":
        return "text-green-400 font-bold bg-green-200";
      case "SCHEDULED":
        return "text-yellow-600 bg-yellow-200 text-black";
      case "COMPLETED":
        return "bg-gray-300 text-white";
      default:
        return "bg-gray-300 text-black";
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-50 pt-6">
      <div className="p-6 rounded-2xl w-full max-w-5xl space-y-6">
        {loading && <p className="text-center text-blue-600">⏳ Loading quizzes...</p>}
        {message && <p className="text-center text-red-500">{message}</p>}

        {!selectedQuiz ? (
          // ---------------- QUIZ LIST ----------------
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-blue-700 flex items-center justify-center gap-2">
              <FaListUl className="text-blue-500" /> Available Quizzes
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  onClick={() => setSelectedQuiz(quiz)}
                  className="relative p-5  rounded-xl cursor-pointer bg-white shadow-md hover:shadow-xl border-blue-500 hover:border-blue-400 transition transform hover:-translate-y-1"
                >
                  {/* ✅ Status Badge */}
                  <span
                    className={`absolute top-1 right-2 px-3 py-1 text-xs  rounded-lg  ${getStatusStyles(
                      quiz.status
                    )}`}
                  >
                    {quiz.status}
                  </span>

                  {/* ✅ Title + Icon */}
                  <h3 className="text-xl font-semibold text-blue-600 flex items-center gap-2">
                    <FaEmpire className="text-blue-500" /> {quiz.title}
                  </h3>

                  {/* ✅ Creator */}
                  <p className="flex items-center gap-2 text-sm text-gray-700 mt-1">
                    <FaUserAlt className="text-blue-400" />
                    Created by: <span className="font-semibold">{quiz.createdBy || "Unknown"}</span>
                  </p>

                  {/* ✅ Description */}
                  <p className="text-gray-600 mt-1">{quiz.description}</p>

                  {/* ✅ Additional Info */}
                  <div className="mt-3 space-y-1 text-sm text-gray-700">
                    <p className="flex items-center gap-2">
                      <FaClock className="text-blue-500" />
                      <span className="font-semibold">Start Time:</span>{" "}
                      {new Date(quiz.startTime).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // ---------------- QUIZ DETAILS ----------------
          <QuizDetails quiz={selectedQuiz} onBack={() => setSelectedQuiz(null)} />
        )}
      </div>
    </section>
  );
};

export default QuizList;
