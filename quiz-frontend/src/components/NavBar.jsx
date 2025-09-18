import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLoginContext } from "../context/LoginContext";
import { FaUserCircle, FaBars, FaTimes, FaHome, FaInfoCircle, FaQuestionCircle, FaPlusCircle, FaPrescriptionBottleAlt, FaVideoSlash, FaViadeoSquare, FaMagic } from "react-icons/fa";

const NavBar = () => {
  const { isLoggedIn, user } = useLoginContext();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-sky-500 text-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Mobile Menu Button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-2xl focus:outline-none"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Center: Logo */}
          <div className="flex items-center justify-center flex-1 sm:justify-start">
            <Link to="/"><img src="/logo2.png" alt="Quiz Logo" className="h-10  mr-2" /></Link>
            {/* <span className="font-bold text-xl">Quiz App</span> */}
          </div>

          {/* Right: User/Login */}
		  <div className="flex items-center">
      	
            { user ? (
			<Link to="/profile">
              <div className="flex items-center space-x-2">
                <span className="bg-white text-sky-600 font-bold rounded-full w-8 h-8 flex items-center justify-center">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
		  </Link>
            ) : (
              <Link to="/login" className="text-lg flex items-center space-x-1">
                <FaUserCircle className="text-2xl" />
                <span className="hidden sm:inline">Login / Register</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="hidden sm:flex justify-center space-x-6 bg-sky-400 py-2">
        <Link to="/" className="flex items-center gap-2 hover:text-gray-200">
          <FaHome /> Home
        </Link>
        <Link to="/about" className="flex items-center gap-2 hover:text-gray-200">
          <FaInfoCircle /> About
        </Link>
        <Link to="/quizzes" className="flex items-center gap-2 hover:text-gray-200">
          <FaQuestionCircle /> Quizzes
        </Link>
        <Link to="/quiz-generator" className="flex items-center gap-2 hover:text-gray-200">
          <FaPlusCircle /> Generate Quiz
        </Link>
        <Link to="/practice-quiz" className="flex items-center gap-2 hover:text-gray-200">
          <FaMagic/> Practice
        </Link>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="sm:hidden bg-sky-400 px-4 py-3 space-y-3">
          <Link to="/" className="flex items-center gap-2 hover:text-gray-200" onClick={() => setMenuOpen(false)}>
            <FaHome /> Home
          </Link>
          <Link to="/about" className="flex items-center gap-2 hover:text-gray-200" onClick={() => setMenuOpen(false)}>
            <FaInfoCircle /> About
          </Link>
          <Link to="/quizzes" className="flex items-center gap-2 hover:text-gray-200" onClick={() => setMenuOpen(false)}>
            <FaQuestionCircle /> Quizzes
          </Link>
          <Link to="/quiz-generator" className="flex items-center gap-2 hover:text-gray-200" onClick={() => setMenuOpen(false)}>
            <FaPlusCircle /> Generate Quiz
          </Link>
          <Link to="/practice-quiz" className="flex items-center gap-2 hover:text-gray-200" onClick={() => setMenuOpen(false)}>
          <FaMagic/> Practice
        </Link>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
