import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";

const apiUrl = import.meta.env.VITE_API_URL;

const ResetPassword = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${apiUrl}/api/auth/reset-password`,
        {
          email: form.email,
          newPassword: form.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(response.data.message || "Password reset successful!");
      setForm({ email: "", password: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Password reset failed! / User not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="relative">
            <MdEmail className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-500 text-lg" />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full pl-8 pr-3 py-2 border-b-2 border-blue-300 focus:border-blue-600 outline-none text-gray-700"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <RiLockPasswordLine className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-500 text-lg" />
            <input
              type="password"
              name="password"
              placeholder="Enter new password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full pl-8 pr-3 py-2 border-b-2 border-blue-300 focus:border-blue-600 outline-none text-gray-700"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
