import { Router } from "express";
import userModel from "../../../models/userModel.js";
import {
  errorResponse,
  successResponse,
} from "../../../utils/serverResponse.js";

const userProfile = Router();

// Routes
userProfile.get("/profile", getUserProfile);
userProfile.put("/update-profile", updateUserProfileController);
userProfile.post("/avatar", updateUserProfileAvatarController);

// Controllers
async function getUserProfile(req, res) {
  try {
    const user = await userModel
      .findById(res.locals.userId)
      .select("-password -refreshToken");

    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    successResponse(
      res,
      "User profile fetched successfully",
      formatUserProfile(user, req)
    );
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

async function updateUserProfileController(req, res) {
  try {
    const { fname, lname, phone, address, dateOfBirth, gender } = req.body;

    // Basic validation
    if (!fname || !lname) {
      return errorResponse(res, 400, "First name and last name are required");
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(
        res.locals.userId,
        { fname, lname, phone, address, dateOfBirth, gender },
        { new: true, runValidators: true }
      )
      .select("-password -refreshToken");

    successResponse(
      res,
      "Profile updated successfully",
      formatUserProfile(updatedUser, req)
    );
  } catch (error) {
    console.error("Error in updateUserProfileController:", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

async function updateUserProfileAvatarController(req, res) {
  try {
    const { avatarUrl } = req.body;

    // Basic validation
    if (!avatarUrl || typeof avatarUrl !== "string") {
      return errorResponse(res, 400, "Valid avatar URL is required");
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(
        res.locals.userId,
        { avatar: avatarUrl },
        { new: true }
      )
      .select("-password -refreshToken");

    successResponse(
      res,
      "Avatar updated successfully",
      formatUserProfile(updatedUser, req)
    );
  } catch (error) {
    console.error("Error in updateUserProfileAvatarController:", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

// Helper function
function formatUserProfile(user, req) {
  const userObj = user.toObject ? user.toObject() : user;
  let avatarUrl = null;

  if (userObj.avatar) {
    if (userObj.avatar.startsWith("http")) {
      avatarUrl = userObj.avatar;
    } else {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      avatarUrl = userObj.avatar.startsWith("/")
        ? `${baseUrl}${userObj.avatar}`
        : `${baseUrl}/${userObj.avatar}`;
    }
  }

  return {
    ...userObj,
    avatar: avatarUrl,
  };
}

export default userProfile;
