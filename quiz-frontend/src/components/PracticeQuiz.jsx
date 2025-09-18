import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaPlay,
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaRedo,
  FaClock,
  FaBook,
  FaListOl,
  FaLayerGroup,
  FaStopwatch,
} from "react-icons/fa";

export default function PracticeQuiz() {
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  // quiz request fields
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState(null);
  const [difficulty, setDifficulty] = useState("easy");
  const [timeLimit, setTimeLimit] = useState(null); // minutes
  const [timeLeft, setTimeLeft] = useState(0);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const token = localStorage.getItem("token");

  // Fetch quiz
  const fetchQuiz = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/practice-quiz/generate-quiz`,
        { topic, questionCount, difficulty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setQuiz(response.data);
      setAnswers({});
      setSubmitted(false);
      setQuizStarted(false);
      setCurrentQuestion(0);
      setTimeLeft(timeLimit * 60);
    } catch (err) {
      console.error("Error creating quiz:", err);
      if (err.response?.status === 401) {
        alert("Unauthorized! Please log in again.");
      }
    }
    setLoading(false);
  };

  // Timer countdown
  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !submitted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && quizStarted && !submitted) {
      setSubmitted(true); // auto-submit
    }
  }, [quizStarted, timeLeft, submitted]);

  const handleAnswer = (questionIndex, option) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: option }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const isCorrect = (userAns, correctAns, options) => {
    if (!userAns) return false;
    const optMatch = options.find((opt) => opt.startsWith(correctAns + "."));
    if (optMatch) {
      return userAns === optMatch;
    }
    return userAns === correctAns;
  };

  const score = quiz.filter((q, index) =>
    isCorrect(answers[index], q.answer, q.options)
  ).length;

  return (
    <div className="max-w-3xl mx-auto p-6 text-blue-900">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Practice Quiz
      </h1>

      {/* Input Form */}
      {quiz.length === 0 && !loading && !submitted && (
        <div className="mb-6 space-y-4 bg-blue-50 p-6 rounded-xl shadow mt-15">
          <div className="flex items-center border-b pb-2">
            <FaBook className="text-blue-600 mr-2" />
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-2 py-1 outline-none bg-transparent"
              placeholder="Enter topic (e.g. Java, SQL)"
            />
          </div>

          <div className="flex items-center border-b pb-2">
            <FaListOl className="text-blue-600 mr-2" />
            <input
              type="number"
              value={questionCount || ""}
              min="1"
              max="20"
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full px-2 py-1 outline-none bg-transparent"
              placeholder="Number of Questions"
            />
          </div>

          <div className="flex items-center border-b pb-2">
            <FaLayerGroup className="text-blue-600 mr-2" />
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-2 py-1 outline-none bg-transparent"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="flex items-center border-b pb-2">
            <FaStopwatch className="text-blue-600 mr-2" />
            <input
              type="number"
              value={timeLimit || ""}
              min="1"
              max="60"
              placeholder="Time Limit (minutes)"
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              className="w-full px-2 py-1 outline-none bg-transparent"
            />
          </div>

          <button
            onClick={fetchQuiz}
            disabled={!topic || !questionCount || !timeLimit}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 mt-4 disabled:opacity-50"
          >
            <FaPlay /> Generate Quiz
          </button>
        </div>
      )}

      {loading && <p className="mt-15 text-center">Loading quiz...</p>}

      {/* Start Screen */}
      {quiz.length > 0 && !quizStarted && !submitted && (
        <div className="p-6 bg-blue-100 rounded-xl shadow text-center mt-15">
          <h2 className="text-xl font-bold mb-4">Quiz Ready!</h2>
          <p className="mb-2">
            <strong>Topic:</strong> {topic}
          </p>
          <p className="mb-4 flex items-center justify-center gap-2">
            <FaClock /> <strong>Time:</strong> {timeLimit} minutes
          </p>
          <button
            onClick={() => setQuizStarted(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
          >
            Start Quiz
          </button>
        </div>
      )}

      {/* Quiz Questions */}
      {quizStarted && !submitted && quiz.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4 mt-15">
            <p className="font-semibold text-blue-700">
              Question {currentQuestion + 1} of {quiz.length}
            </p>
            <p className="font-bold text-red-600">
              <FaClock className="inline-block" /> {formatTime(timeLeft)}
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow mb-6">
            <h2 className="font-semibold mb-4">
              {quiz[currentQuestion].question}
            </h2>
            <div className="space-y-2">
              {quiz[currentQuestion].options.map((option, i) => (
                <label
                  key={i}
                  className={`flex items-center space-x-2 cursor-pointer ${
                    answers[currentQuestion] === option
                      ? "bg-blue-100 p-2 rounded-lg"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={option}
                    checked={answers[currentQuestion] === option}
                    onChange={() => handleAnswer(currentQuestion, option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion((prev) => prev - 1)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl shadow hover:bg-blue-600 disabled:opacity-50"
            >
              <FaArrowLeft /> Previous
            </button>

            {currentQuestion < quiz.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion((prev) => prev + 1)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl shadow hover:bg-blue-600"
              >
                Next <FaArrowRight />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700"
              >
                <FaCheckCircle /> Submit Quiz
              </button>
            )}
          </div>
        </div>
      )}

      {/* Results */}
      {submitted && (
        <div className="mt-15 space-y-6">
          <h2 className="text-xl font-bold mb-2 text-blue-700">Results</h2>
          <p className="text-lg font-semibold mb-6">
            Score:{" "}
            <span className="text-green-600">
              {score} / {quiz.length}
            </span>
          </p>
          {quiz.map((q, index) => {
            const correct = isCorrect(answers[index], q.answer, q.options);
            return (
              <div
                key={index}
                className={`p-4 border rounded-xl shadow-sm ${
                  correct ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"
                }`}
              >
                <h3 className="font-semibold mb-2">
                  {index + 1}. {q.question}
                </h3>
                <p>
                  <span className="font-semibold">Your Answer:</span>{" "}
                  <span className={correct ? "text-green-600" : "text-red-600"}>
                    {answers[index] || "Not Answered"}
                  </span>
                </p>
                <p>
                  <span className="font-semibold">Correct Answer:</span>{" "}
                  <span className="text-green-600">{q.answer}</span>
                </p>
              </div>
            );
          })}
          <button
            onClick={() => {
              setQuiz([]);
              setAnswers({});
              setSubmitted(false);
              setQuizStarted(false);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
          >
            <FaRedo /> Try Again
          </button>
        </div>
      )}
    </div>
  );
}
