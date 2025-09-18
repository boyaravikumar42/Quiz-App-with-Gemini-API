import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaPlusCircle, FaMagic } from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col justify-center items-center mt-12 min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-6">
      <div className="max-w-3xl text-center space-y-6">
        {/* App Name */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700">
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
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12 px-8">
          <button
            onClick={() => navigate("/quizzes")}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md transition-transform transform hover:scale-102 w-full sm:w-auto"
          >
            <FaSearch /> Explore Quizzes
          </button>
          <button
            onClick={() => navigate("/generate-quiz")}
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl shadow-md transition-transform transform hover:scale-102 w-full sm:w-auto"
          >
            <FaMagic/> Generate Quiz
          </button>
        </div>
      </div>
    </section>
  );
};

export default Home;
