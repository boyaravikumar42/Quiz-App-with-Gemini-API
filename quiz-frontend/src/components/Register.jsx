import React, { useState } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/api/auth/register`,
        form,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201 || response.status === 200) {
        setSuccess("Registration successful! You can now login.");
        toast.success("Registration successful! You can now login.");
        navigate("/login");
        setForm({ username: "", email: "", password: "" });
      } else {
        setError("Registration failed");
      }
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-sky-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-sky-600 mb-6">
          Register
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-sky-500" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2 border-b-2 border-sky-400 focus:outline-none focus:border-sky-600"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-sky-500" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2 border-b-2 border-sky-400 focus:outline-none focus:border-sky-600"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-sky-500" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2 border-b-2 border-sky-400 focus:outline-none focus:border-sky-600"
            />
          </div>

          {/* Submit */}
          <button
            disabled={loading}
            type="submit"
            className="w-full py-2 text-white font-semibold rounded-lg bg-sky-500 hover:bg-sky-600 transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        {success && <p className="mt-4 text-center text-green-600">{success}</p>}

        {/* Link to login */}
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-sky-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
