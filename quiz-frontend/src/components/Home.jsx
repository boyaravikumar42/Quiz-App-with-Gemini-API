import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-sky-100 to-sky-150 px-6">
      <div className="max-w-3xl text-center space-y-6">
        {/* App Name */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700">
          AI-Powered Quiz App
        </h1>

        {/* Description */}
        <p className="text-gray-700 text-lg leading-relaxed">
          Welcome to <span className="font-semibold">AI-Powered Quiz App</span> 🚀.  
          Create quizzes dynamically using AI and challenge yourself or others.  
          Whether you want to test your knowledge or generate custom quizzes on any topic,  
          our intelligent quiz engine has you covered.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => navigate("/quizzes")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-md transition"
          >
            🔍 Explore Quizzes
          </button>
          <button
            onClick={() => navigate("/generate-quiz")}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl shadow-md transition"
          >
            ⚡ Generate Quiz
          </button>
        </div>
      </div>
    </section>
  );
};

export default Home;
