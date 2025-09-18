import React, { useState } from "react";
import axios from "axios";
import { useLoginContext } from "../context/LoginContext";
import {
  FaHeading,
  FaRegFileAlt,
  FaBook,
  FaClock,
  FaQuestionCircle,
  FaCalendarAlt,
  FaSave,
  FaLayerGroup,
} from "react-icons/fa";
import { toast } from "react-toastify";
import {useNavigate} from "react-router-dom"

const QuizGeneratorForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    topic: "",
    difficulty: "EASY",
    startTime: "",
    duration: "",
    questionCount: "",
  });

  const { user } = useLoginContext();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setQuiz(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/quizzes/generate`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if(response.status==500)
      {
        toast.error(response.data);
        return;
      }
      setQuiz(response.data);
      setMessage("Quiz generated successfully! You can edit it below.");
    } catch (error) {
      console.error("Error generating quiz:", error);
      setMessage("Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuizEdit = (index, field, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index][field] = value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/quizzes/${quiz.id}`,
        quiz,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Quiz saved successfully!");
      navigate("/quizzes")
      
    } catch (error) {
      console.error("Error saving quiz:", error);
      setMessage("Failed to save quiz.");
    }
  };

  if (!user) {
    return (
      <section className="flex justify-center items-center min-h-screen bg-sky-50">
        <div className="p-6 rounded-2xl w-full max-w-3xl text-center bg-white shadow-lg">
          <h2 className="text-2xl font-bold text-blue-600">Please Login</h2>
          <p className="text-gray-600">You need to be logged in to generate a quiz.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex justify-center items-center min-h-screen  bg-sky-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-5xl space-y-6">
        <h2 className="text-3xl font-bold text-center text-blue-600">
          Generate a Quiz
        </h2>

        {!quiz ? (
          <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="flex items-center border-b-2 border-blue-300 py-2 col-span-1">
              <FaHeading className="text-blue-500 mr-3" />
              <input
                type="text"
                name="title"
                placeholder="Quiz Title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full outline-none"
              />
            </div>

            <div className="flex items-center border-b-2 border-blue-300 py-2 col-span-1">
              <FaBook className="text-blue-500 mr-3" />
              <input
                type="text"
                name="topic"
                placeholder="Topic (e.g., Java, DSA)"
                value={formData.topic}
                onChange={handleChange}
                required
                className="w-full outline-none"
              />
            </div>

            <div className="flex items-center border-b-2 border-blue-300 py-2 col-span-1">
              <FaLayerGroup className="text-blue-500 mr-3" />
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full outline-none bg-transparent"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <div className="flex items-center border-b-2 border-blue-300 py-2 col-span-1">
              <FaCalendarAlt className="text-blue-500 mr-3" />
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full outline-none"
              />
            </div>

            <div className="flex items-center border-b-2 border-blue-300 py-2 col-span-1">
              <FaClock className="text-blue-500 mr-3" />
              <input
                type="number"
                name="duration"
                placeholder="Duration (minutes)"
                value={formData.duration}
                onChange={handleChange}
                required
                className="w-full outline-none"
              />
            </div>

            <div className="flex items-center border-b-2 border-blue-300 py-2 col-span-1">
              <FaQuestionCircle className="text-blue-500 mr-3" />
              <input
                type="number"
                name="questionCount"
                placeholder="Number of Questions"
                value={formData.questionCount}
                onChange={handleChange}
                required
                className="w-full outline-none"
              />
            </div>

            {/* Full-width Description */}
            <div className="flex items-start border-b-2 border-blue-300 py-2 col-span-1 md:col-span-2">
              <FaRegFileAlt className="text-blue-500 mr-3 mt-2" />
              <textarea
                name="description"
                placeholder="Quiz Description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full outline-none resize-none"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition flex justify-center items-center"
              >
                {loading ? "Generating..." : "Generate Quiz"}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-blue-600">{quiz.title}</h3>
            <p className="text-gray-600">{quiz.description}</p>

            <div className="space-y-4">
              {quiz.questions?.map((q, index) => (
                <div key={index} className="p-4 border rounded-lg bg-sky-50">
                  <p className="font-semibold text-blue-700 mb-2">
                    {index + 1}. {q.question}
                  </p>
                  {q.options?.map((opt, i) => (
                    <input
                      key={i}
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const updatedOptions = [...q.options];
                        updatedOptions[i] = e.target.value;
                        handleQuizEdit(index, "options", updatedOptions);
                      }}
                      className="w-full border-b border-blue-300 py-1 outline-none mb-2"
                    />
                  ))}
                  <input
                    type="text"
                    value={q.answer}
                    onChange={(e) =>
                      handleQuizEdit(index, "answer", e.target.value)
                    }
                    className="w-full border-b border-green-400 py-1 outline-none bg-green-50"
                    placeholder="Correct Answer"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition flex justify-center items-center"
            >
              <FaSave className="mr-2" /> Save Quiz
            </button>
          </div>
        )}

        {message && <p className="text-center text-blue-600 mt-4">{message}</p>}
      </div>
    </section>
  );
};

export default QuizGeneratorForm;
