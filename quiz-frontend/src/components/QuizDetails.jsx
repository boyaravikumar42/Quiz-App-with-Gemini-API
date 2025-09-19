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
  const [participant, setParticipant] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [accessCodeInput, setAccessCodeInput] = useState(""); // store input
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
        setParticipant(res.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setParticipant(null);
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

    if (!accessCodeInput.trim()) {
      toast.error("Please enter access code!");
      return;
    }

    if (accessCodeInput.trim() !== quiz.accessCode) {
      toast.error("Invalid access code!");
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
    if (!user) {
      toast.error("You must be logged in to quit!");
      return;
    }
    setLoading(true);
    axios
      .delete(
        `${import.meta.env.VITE_API_URL}/api/participants/quit/${quiz.id}/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        setParticipant(null);
        toast.success("You have quit the quiz.");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to quit!");
      })
      .finally(() => setLoading(false));
      
  };

  const handleStart = () => {
    navigate(`/conduct-quiz/${quiz.id}`);
  };

  const handleResults = () => {
    navigate(`/leaderboard/${quiz.id}`);
  };

  return (
    <div className="space-y-3 p-6 bg-white rounded-2xl shadow-md mt-8 md:mt-12  w-full md:w-3/4 lg:w-[60vw] mx-auto">
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
        <FaCalendarAlt /> Start time: {new Date(quiz.startTime).toLocaleString()}
      </div>
      <div className="flex items-center gap-2 text-gray-500">
        Note: The time shown above is quiz creator's intended start time, but the
        quiz may begin based on creator’s decision.
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

      {/* Status */}
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

      {/* Access Code & Action Button */}
      <div className="space-y-3">
        {!participant && (
          <input
            type="text"
            placeholder="Enter Access Code"
            value={accessCodeInput}
            onChange={(e) => setAccessCodeInput(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        )}

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
        ) : (
          <button
            className="w-full text-red-500  py-2 rounded-lg hover:text-red-600 transition"
            disabled
          >
            You have already participated!
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizDetails;
