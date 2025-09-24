import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaPlay,
  FaCheck,
} from "react-icons/fa";
import { useLoginContext } from "../context/LoginContext";

const ConductQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(99999);
  const [submitted, setSubmitted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const { user } = useLoginContext();

  // Fetch quiz by ID
  useEffect(() => {
    if (!user) navigate("/login");

    const fetchQuiz = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/quizzes/${quizId}`
        );
        setQuiz(response.data);
        setTimeLeft(response.data.duration * 60); // minutes → seconds
        setStartTime(Date.now());
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };
    fetchQuiz();
  }, [quizId]);

  // Timer
  useEffect(() => {
    if (started && timeLeft > 0 && !submitted) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !submitted) {
      handleSubmit();
    }
  }, [started, timeLeft, submitted]);
  //update for each question
  const handleOptionSelect = async (qIndex, selectedOption) => {
  if (submitted) return;

  const question = quiz.questions[qIndex];
  const previousAnswer = answers[qIndex];
  const previousCorrect =
    previousAnswer &&
    (previousAnswer === question.answer ||
      (question.answer.length === 1 && question.answer === previousAnswer[0]));

  const newCorrect =
    selectedOption === question.answer ||
    (question.answer.length === 1 && question.answer === selectedOption[0]);

  // Update answers
  setAnswers((prev) => ({ ...prev, [qIndex]: selectedOption }));

  let updatedScore = score;

  // If previous answer was correct, subtract points
  if (previousCorrect) updatedScore -= 10;

  // If new selection is correct, add points
  if (newCorrect) updatedScore += 10;

  setScore(updatedScore);

  // Update score in backend
  await axios.post(
    `${import.meta.env.VITE_API_URL}/api/participants/update-score/${quizId}/${user.id}/${updatedScore}`
  );
};


  const handleSubmit = async () => {
    if (!user) return;
    const timeTaken = Date.now() - startTime;
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/participants/submit`, {
        quizId,
        userId: user.id,
        score,
        timeTaken,
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  if (!quiz) return <p className="text-center text-blue-600">⏳ Loading quiz...</p>;

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <h2 className="text-3xl font-bold text-blue-700">{quiz.title}</h2>
        <p className="text-gray-600 mt-2">{quiz.description}</p>
        <p className="mt-2 flex items-center gap-2 text-gray-700">
          <FaClock className="text-blue-500" /> Duration: {quiz.duration} minutes
        </p>
        <button
          onClick={() => {
            setStarted(true);
            setStartTime(Date.now());
          }}
          className="mt-6 px-6 py-3 flex items-center gap-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          <FaPlay /> Start Quiz
        </button>
      </div>
    );
  }

  if (submitted) {
    // console.log("Final Answers:", answers); 
    const correct = Object.entries(answers).filter(
      ([idx, ans]) => quiz.questions[idx].answer === ans || (quiz.questions[idx].answer.length===1 && quiz.questions[idx].answer === ans[0])
    ).length;
    const wrong = quiz.questions.length - correct;

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <h2 className="text-3xl font-bold text-blue-700 mb-4 flex items-center gap-2">
          <FaCheck /> Quiz Completed!
        </h2>
        <p className="text-lg text-gray-700">
          Your Score: <span className="font-bold text-blue-600">{score}</span>
        </p>
        <p className="mt-2 flex items-center gap-2 text-green-600">
          <FaCheckCircle /> Correct: {correct}
        </p>
        <p className="flex items-center gap-2 text-red-600">
          <FaTimesCircle /> Wrong: {wrong}
        </p>
        <Link
          to={`/leaderboard/${quizId}`}
          className="mt-4 text-blue-600 underline hover:text-blue-800"
        >
          See Results
        </Link>

        <button
          onClick={() => navigate("/quizzes")}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  const question = quiz.questions[currentQ];
  const progress = ((currentQ + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 mt-20 md:mt-24">
      {/* Header with progress and timer */}
      <div className="flex justify-between items-center w-full max-w-3xl mb-4">
        <h2 className="text-xl font-semibold text-blue-600">{quiz.title}</h2>
      </div>

      <div className="flex justify-between items-center w-full max-w-3xl mb-6">
        <div className="w-3/4 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="flex items-center gap-2 text-gray-700 text-sm ml-4">
          <FaClock className="text-blue-500" />
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
        </p>
      </div>

      {/* Question Card */}
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-3xl">
        <h3 className="text-lg font-semibold mb-4 text-blue-600">
          Q{currentQ + 1}. {question.question}
        </h3>
        <div className="space-y-3">
          {question.options.map((opt, idx) => (
            <label
              key={idx}
              className={`flex items-center gap-3 px-4 py-2 border rounded-lg cursor-pointer transition ${
                answers[currentQ] === opt
                  ? "border-blue-500 bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQ}`}
                value={opt}
                checked={answers[currentQ] === opt}
                onChange={() => handleOptionSelect(currentQ, opt)}
                className="text-blue-600 focus:ring-blue-500"
              />
              {opt}
            </label>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            disabled={currentQ === 0}
            onClick={() => setCurrentQ((prev) => prev - 1)}
            className="px-4 py-2 flex items-center gap-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            <FaArrowLeft /> Previous
          </button>

          {currentQ < quiz.questions.length - 1 ? (
            <button
              onClick={() => setCurrentQ((prev) => prev + 1)}
              className="px-4 py-2 flex items-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next <FaArrowRight />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 flex items-center gap-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <FaCheck /> Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConductQuiz;
