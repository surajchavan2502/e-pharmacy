import React, { useState } from "react";
import { FaUser, FaLock, FaGoogle, FaGithub } from "react-icons/fa";
import API from "../utils/API";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID; // Google OAuth Client ID

  // Handle Email/Password Login
  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await API.post("/api/public/auth/signin", {
        email,
        password,
      });

      console.log("API Response:", res.data);
      if (res.data.status === 200 && res.data.data?.accessToken) {
        toast.success("Sign In Successful! 🎉");
      } else {
        setError("Sign In Failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-center text-2xl font-semibold text-gray-900">
            Sign in to Your Account
          </h2>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Email Input */}
          <div className="relative mt-4">
            <FaUser className="absolute left-3 top-3 text-gray-500" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Password Input */}
          <div className="relative mt-4">
            <FaLock className="absolute left-3 top-3 text-gray-500" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Sign-in Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition mt-6"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-white px-4 text-sm text-gray-500">
              OR
            </span>
            <hr className="border-t border-gray-300" />
          </div>

          {/* Google OAuth Login */}
          <div className="flex flex-col gap-3">
            <GoogleLogin
              onSuccess={(response) =>
                console.log("Google Login Success:", response)
              }
              onError={() => console.log("Google Login Failed")}
            />
            <button className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 transition hover:bg-gray-100">
              <FaGithub className="text-black" size={20} />
              Sign in with GitHub
            </button>
          </div>

          {/* Signup Link */}
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </p>
          <p className="text-gray-600 text-sm text-center mt-4">
            <a
              href="/forgot-password"
              className="text-blue-500 hover:underline"
            >
              Forgot Password?
            </a>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Signin;
