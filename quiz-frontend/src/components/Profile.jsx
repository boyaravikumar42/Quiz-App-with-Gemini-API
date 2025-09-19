import React, { useEffect, useState } from "react";
import { useLoginContext } from "../context/LoginContext";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaSignOutAlt,
  FaEdit,
  FaLock,
  FaTrash,
  FaUsers,
} from "react-icons/fa";

const Profile = () => {
  const { user, logout } = useLoginContext();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Profile
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [editingProfile, setEditingProfile] = useState(false);

  // Password reset
  const [passwords, setPasswords] = useState({ password: "", confirm: "" });
  const [changingPassword, setChangingPassword] = useState(false);

  // Quiz edit
  const [expandedQuiz, setExpandedQuiz] = useState(null);
  const [quizEditData, setQuizEditData] = useState({
    startTime: "",
    status: "SCHEDULED",
  });
  const [deleteAccessCode, setDeleteAccessCode] = useState("");

  const handleLogout = () => {
    logout();
    toast.info("You have been logged out.");
  };

  useEffect(() => {
    if (user?.email) {
      const fetchQuizzes = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/quizzes/by-user-id/${user.email}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
          setQuizzes(response.data);
        } catch (err) {
          setError("Failed to load quizzes. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
      fetchQuizzes();
    }
  }, [user]);

  const updateProfile = async () => {
    if (newUsername.trim() === "") {
      return toast.error("Username should not be empty!");
    }
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/update-profile`,
        { username: newUsername },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success("Profile updated successfully!");
      setEditingProfile(false);
    } catch (err) {
      toast.error("Failed to update profile.");
    }
  };

  const resetPassword = async () => {
    if (passwords.password === "")
      return toast.error("Password should not be empty!");
    if (passwords.password !== passwords.confirm)
      return toast.error("Passwords do not match!");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
        { email: user.email, newPassword: passwords.password },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success("Password reset successfully!");
      setChangingPassword(false);
    } catch (err) {
      toast.error("Failed to reset password.");
    }
  };

  const updateQuiz = async (quizId) => {
    if (!quizEditData.startTime) {
      return toast.error("Start time is required!");
    }
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/quizzes/update-status/${quizId}`,
        quizEditData,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success("Quiz updated successfully!");
      setExpandedQuiz(null);
    } catch (err) {
      toast.error("Failed to update quiz.");
    }
  };

  const deleteQuiz = async (quizId) => {
    if (!deleteAccessCode) {
      return toast.error("Please provide an access code to delete!");
    }
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/quizzes/${quizId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          data: { accessCode: deleteAccessCode },
        }
      );
      toast.success("Quiz deleted successfully!");
      setQuizzes(quizzes.filter((q) => q.id !== quizId));
      setExpandedQuiz(null);
    } catch (err) {
      toast.error("Failed to delete quiz.");
    }
  };

  if (!user) {
    return <p className="text-center mt-10">Please log in to view your profile.</p>;
  }

  return (
    <section className="flex flex-col items-center min-h-screen p-6 mt-12 space-y-6 bg-sky-50">
      {/* User Info */}
      <div className="bg-white p-6 rounded-2xl shadow-md text-center w-full max-w-md">
        <h1 className="text-2xl font-bold flex justify-center items-center gap-2 text-indigo-600">
          <FaUser /> {user.username}
        </h1>
        <p className="text-gray-500 flex justify-center items-center gap-2">
          <FaEnvelope /> {user.email}
        </p>

        <div className="flex justify-center gap-4 mt-6">
          <button
            className="p-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={() => setEditingProfile(true)}
            title="Update Profile"
          >
            <FaEdit />
          </button>

          <button
            className="p-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={() => setChangingPassword(true)}
            title="Change Password"
          >
            <FaLock />
          </button>

          <button
            className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600"
            onClick={handleLogout}
            title="Logout"
          >
            <FaSignOutAlt />
          </button>
        </div>

        {editingProfile && (
          <div className="mt-4 space-y-2">
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="border rounded-lg p-2 w-full"
              required
            />
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-lg w-full"
              onClick={updateProfile}
            >
              Save Changes
            </button>
          </div>
        )}

        {changingPassword && (
          <div className="mt-4 space-y-2">
            <input
              type="password"
              placeholder="New Password"
              className="border rounded-lg p-2 w-full"
              value={passwords.password}
              onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="border rounded-lg p-2 w-full"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              required
            />
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-lg w-full"
              onClick={resetPassword}
            >
              Reset Password
            </button>
          </div>
        )}
      </div>

      {/* Quizzes Count */}
      <div className="bg-white p-6 rounded-2xl shadow-md text-center w-full max-w-md">
        <h2 className="text-xl font-semibold">Quizzes Created</h2>
        <p className="text-3xl font-bold text-indigo-600">
          {loading ? "..." : quizzes.length}
        </p>
      </div>

      {/* Quizzes List */}
      <div className="w-full max-w-4xl">
        <h2 className="text-xl font-semibold mb-4">Your Quizzes</h2>
        {loading && <p className="text-gray-500">Loading quizzes...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && quizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white relative rounded-2xl shadow-md p-5 hover:shadow-lg transition"
              >
                {/* Status Badge */}
                <span
                  className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full font-bold ${
                    quiz.status === "LIVE"
                      ? "bg-green-100 text-green-700"
                      : quiz.status === "SCHEDULED"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {quiz.status}
                </span>

                <h3
                  className="text-lg font-bold text-indigo-600 cursor-pointer"
                  onClick={() =>
                    setExpandedQuiz(expandedQuiz?.id === quiz.id ? null : quiz)
                  }
                >
                  {quiz.title}
                </h3>
                <p className="text-gray-600 text-sm">{quiz.description}</p>

                {/* Access Code Display */}
                <p className="text-sm text-gray-500 mt-2">
                  <strong>Access Code:</strong> {quiz.accessCode}
                </p>

                {/* Results / Participants Link */}
                <Link
                  to={`/leaderboard/${quiz.id}`}
                  className="mt-2 inline-flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition"
                >
                  <FaUsers />
                  {quiz.status === "SCHEDULED" ? "Participants" : "Results"}
                </Link>

                {/* Expanded Edit Options */}
                {expandedQuiz?.id === quiz.id && (
                  <div className="mt-4 space-y-2 border-t pt-3">
                    <p>
                      <strong>Start Time:</strong> {quiz.startTime}
                    </p>
                    <p>
                      <strong>Duration:</strong> {quiz.duration} mins
                    </p>

                    <div className="space-y-2">
                      <input
                        type="datetime-local"
                        className="border rounded-lg p-2 w-full"
                        value={quizEditData.startTime || quiz.startTime}
                        required
                        onChange={(e) =>
                          setQuizEditData({ ...quizEditData, startTime: e.target.value })
                        }
                      />
                      <select
                        className="border rounded-lg p-2 w-full"
                        value={quizEditData.status || quiz.status}
                        onChange={(e) =>
                          setQuizEditData({ ...quizEditData, status: e.target.value })
                        }
                      >
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="LIVE">Live</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </div>

                    <div className="flex gap-3 mt-3">
                      <button
                        className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuizEditData({
                            startTime: quiz.startTime,
                            status: quiz.status,
                          });
                          updateQuiz(quiz.id);
                        }}
                      >
                        <FaEdit className="inline mr-2" /> Update
                      </button>
                      <button
                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          const code = prompt("Enter Access Code");
                          if (code) {
                            setDeleteAccessCode(code);
                            deleteQuiz(quiz.id);
                          }
                        }}
                      >
                        <FaTrash className="inline mr-2" /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          !loading && !error && (
            <p className="text-gray-500">You haven’t created any quizzes yet.</p>
          )
        )}
      </div>
    </section>
  );
};

export default Profile;
