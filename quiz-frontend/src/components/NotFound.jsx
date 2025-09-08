import React from "react";
import { FaHome, FaQuestionCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-6">
      {/* App Logo/Icon */}
      <div className="flex items-center gap-3 mb-4">
        <FaQuestionCircle className="text-blue-600 text-5xl" />
        <h1 className="text-3xl font-bold text-gray-800">Quiz App</h1>
      </div>

      {/* 404 Title */}
      <h2 className="text-6xl font-extrabold text-gray-900">404</h2>
      <p className="mt-4 text-lg text-gray-600">
        Oops! The page you are looking for doesn’t exist.
      </p>

      {/* Navigation Button */}
      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition"
      >
        <FaHome className="inline center" /> Back to Home
      </button>
    </section>
  );
};

export default NotFound;
