import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLoginContext } from "../context/LoginContext";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_API_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, user } = useLoginContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    if (user) {
      navigate("/"); // Redirect to home if already logged in
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        `${apiUrl}/api/auth/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      login(response.data.token);
      setEmail("");
      setPassword("");
      toast.success("Login successful...!");
      setLoading(false);
      navigate("/");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Login failed");
      } else {
        setError("Server error");
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-sky-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-center text-sky-600 mb-6">
          Login to Quiz App
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-sky-500" />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 pr-4 py-2 border-b-2 border-sky-300 focus:border-sky-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-sky-500" />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-2 border-b-2 border-sky-300 focus:border-sky-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
           <div>
            <Link
            to="/password-reset"
            className="text-sky-500 hover:underline"
          >
            forgot password?
          </Link>
           </div>
          <br />

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* Login Button */}
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-sky-500 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
