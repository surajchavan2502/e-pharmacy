import React, { useState } from "react";
import { FiMail } from "react-icons/fi";
import API from "../utils/API";
import { useNavigate } from "react-router";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      const res = await API.post("/api/public/auth/forgot-password", { email });

      if (res.data.error === false) {
        localStorage.setItem("resetEmail", email);
        navigate("/reset-password");
      } else {
        setError(res.data.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to send OTP. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Forgot Password
        </h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="relative mb-4">
          <FiMail className="absolute left-3 top-3 text-gray-400" />
          <input
            type="email"
            placeholder="Enter your email"
            className="pl-10 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          className={`w-full p-2 rounded-lg text-white transition-all duration-300 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          onClick={handleSendOtp}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg
                className="w-5 h-5 mr-2 text-white animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Sending...
            </div>
          ) : (
            "Send OTP"
          )}
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
