import React from "react";
import {
  FaRobot,
  FaClipboardList,
  FaCheckCircle,
  FaBookOpen,
  FaUserTie,
  FaLinkedin,
} from "react-icons/fa";

export default function About() {
  return (
    <div className="max-w-5xl mx-auto p-6 text-blue-900 mt-20 md:mt-25">
      {/* Intro Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-700 mb-4 flex justify-center items-center gap-2">
          <FaRobot className="text-blue-600" /> AI-Powered Quiz Generator
        </h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Our platform leverages the power of AI to create personalized quizzes,
          evaluate your performance, and help you master topics interactively.
          Whether you're preparing for interviews, competitive exams, or just
          want to test your skills, this app is designed to make learning
          engaging and efficient.
        </p>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-6 mb-12">
        {/* Quiz Generator */}
        <div className="bg-blue-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-blue-700 mb-3">
            <FaClipboardList /> Quiz Generator
          </h2>
          <p className="text-gray-700">
            Generate quizzes based on topic, difficulty level, and number of
            questions. AI ensures diverse, high-quality questions to help you
            cover all important concepts.
          </p>
        </div>

        {/* Quiz Assessment */}
        <div className="bg-blue-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-blue-700 mb-3">
            <FaCheckCircle /> Quiz Assessment
          </h2>
          <p className="text-gray-700">
            Get instant feedback, detailed solutions, and performance analytics
            with a real-time leaderboard. Identify your strengths and areas for
            improvement easily.
          </p>
        </div>

        {/* Practice Topics */}
        <div className="bg-blue-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-blue-700 mb-3">
            <FaBookOpen /> Practice Topics
          </h2>
          <p className="text-gray-700">
            Practice topic-wise quizzes to enhance your problem-solving skills
            step by step. Play individual quizzes, track progress, and build
            confidence over time.
          </p>
        </div>
      </section>

      {/* Mentor & Developers */}
      <section className="bg-blue-100 p-6 rounded-2xl shadow">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Meet the Team
        </h2>

        {/* Mentor */}
        <div className="mb-6 text-center">
          <h3 className="flex justify-center items-center gap-2 text-xl font-semibold text-blue-800">
            <FaUserTie /> Mentor
          </h3>
          <p className="text-gray-800 text-lg">G. Rajasekhar Reddy <sub>M. Tech, (Ph.D.)</sub></p>
        </div>

        {/* Developers */}
        <div className="grid md:grid-cols-2 gap-6 text-center">
          <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              B. Ravi Kumar
            </h3>
            <a
              href="https://www.linkedin.com/in/boyaravikumar42"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex justify-center items-center gap-2"
            >
              <FaLinkedin /> LinkedIn
            </a>
          </div>

          <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              M. Mahesh
            </h3>
            <a
              href="https://www.linkedin.com/in/madam-mahesh-7aba71320"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex justify-center items-center gap-2"
            >
              <FaLinkedin /> LinkedIn
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
