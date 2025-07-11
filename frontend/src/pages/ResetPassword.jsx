/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router";
import API from "../utils/API";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Handle form submission
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email || !otp || !password || !confirmPassword) {
      setMessage("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await API.post("/api/public/auth/reset-password", {
        email,
        otp,
        password,
      });

      if (response.data.error === false) {
        setMessage("Password reset successful. Redirecting...");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage("Error resetting password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Reset Password
        </h2>
        {message && <p className="text-red-500 text-center mt-2">{message}</p>}

        <form onSubmit={handleResetPassword} className="mt-4">
          <div>
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mt-3">
            <label className="block text-gray-700">OTP Code:</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          <div className="mt-3">
            <label className="block text-gray-700">New Password:</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mt-3">
            <label className="block text-gray-700">Confirm Password:</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {/* Back to Sign In Button */}
        <button
          onClick={() => navigate("/")}
          className="w-full bg-gray-400 text-white p-2 rounded mt-2 hover:bg-gray-500"
        >
          Back to Sign In
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
