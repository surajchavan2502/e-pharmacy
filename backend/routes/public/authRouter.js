import { Router } from "express";
import userModel from "../../models/userModel.js";
import { errorResponse, successResponse } from "../../utils/serverResponse.js";
import { comparePassword, hashPassword } from "../../utils/encryptPassword.js";
import { generateToken, verifyToken } from "../../utils/jwtTokens.js";
import { sendEmail } from "../../utils/emailer.js";

const authRouter = Router();

// API Routes
authRouter.post("/signin", signinController);
authRouter.post("/signup", signupController);
authRouter.post("/forgot-password", forgotpassController);
authRouter.post("/reset-password", resetpassController);
authRouter.post("/refresh-token", refreshTokenController);

export default authRouter;

// Sign In Controller
async function signinController(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return errorResponse(res, 400, "Email and password are required");
    }

    const user = await userModel.findOne({ email });
    if (!user) return errorResponse(res, 404, "User not found");

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) return errorResponse(res, 401, "Invalid Password");

    const { accessToken, refreshToken } = generateToken({
      userId: user._id,
      role: user.role,
    });

    return successResponse(res, "Signin successful", {
      accessToken,
      refreshToken,
      redirectPath: `/${user.role}`,
    });
  } catch (error) {
    console.error("_signinController_", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

//Sign Up Controller
async function signupController(req, res) {
  try {
    console.log("Received data:", req.body);

    const {
      fname,
      lname,
      email,
      password,
      role,
      phone,
      address,
      dateOfBirth,
      gender,
    } = req.body;

    if (
      !fname ||
      !lname ||
      !email ||
      !password ||
      !phone ||
      !address?.street ||
      !address?.city ||
      !address?.state ||
      !address?.zip
    ) {
      return errorResponse(
        res,
        400,
        "All required fields must be provided, including complete address"
      );
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) return errorResponse(res, 400, "User already exists");

    const hashedPassword = await hashPassword(password);

    const newUser = await userModel.create({
      fname,
      lname,
      email,
      password: hashedPassword,
      role: role || "user",
      phone,
      address,
      dateOfBirth,
      gender,
      isVerified: false,
      walletBalance: 0,
    });

    return successResponse(res, "Signup successful", newUser);
  } catch (error) {
    console.error("_signupController_", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

//  Forgot Password (email sending)
async function forgotpassController(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return errorResponse(res, 400, "Email is required");
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return errorResponse(res, 400, "User not found");
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Save OTP to the database
    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      { forgototp: otp }, // Store OTP
      { new: true } // Ensure it returns the updated user
    );

    if (!updatedUser || !updatedUser.forgototp) {
      return errorResponse(res, 500, "Failed to store OTP in database");
    }

    console.log("Saved OTP in DB:", updatedUser.forgototp); // Debugging log

    // Send OTP via email
    const emailResponse = await sendEmail(email, "Your OTP Code", otp);
    if (!emailResponse.success) {
      return errorResponse(res, 500, "Failed to send OTP");
    }

    return successResponse(res, "OTP sent successfully!", { otp });
  } catch (error) {
    console.error("Error during forgot password:", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

// 🔹 Reset Password
async function resetpassController(req, res) {
  try {
    const { email, otp, password } = req.body;
    if (!email || !otp || !password) {
      return errorResponse(
        res,
        400,
        "Email, OTP, and new password are required"
      );
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return errorResponse(res, 400, "User not found");
    }

    console.log("Stored OTP:", user.forgototp, "Received OTP:", otp);
    console.log(
      "Stored OTP Type:",
      typeof user.forgototp,
      "Received OTP Type:",
      typeof otp
    );

    // Convert both OTP values to strings before comparing
    if (String(user.forgototp) !== String(otp)) {
      return errorResponse(res, 400, "Invalid OTP");
    }

    // Optional: Check OTP expiration
    if (user.otpExpiry && Date.now() > user.otpExpiry) {
      return errorResponse(res, 400, "OTP has expired");
    }

    // Hash the new password
    const hashedPassword = await hashPassword(password);

    // Update user password and remove OTP
    await usermodel.findOneAndUpdate(
      { email },
      { password: hashedPassword, forgototp: null, otpExpiry: null }
    );

    return successResponse(res, "Password reset successful");
  } catch (error) {
    console.error("Error during password reset:", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

//Refresh Token Controller
async function refreshTokenController(req, res) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return errorResponse(res, 400, "Refresh token required");

    let payload;
    try {
      payload = verifyToken(refreshToken);
    } catch (error) {
      return errorResponse(res, 400, "Invalid refresh token");
    }

    const tokens = generateToken({
      userId: payload.userId,
      role: payload.role,
    });

    return successResponse(res, "Token refreshed successfully", tokens);
  } catch (error) {
    console.error("_refreshTokenController_", error);
    return errorResponse(res, 500, "Internal server error");
  }
}
