import { Router } from "express";
import {
  errorResponse,
  successResponse,
} from "../../../utils/serverResponse.js";
import userModel from "../../../models/userModel.js";
import cartModel from "../../../models/userCartModel.js";
import medicineModel from "../../../models/medicineModel.js";

const adminUserRouter = Router();

// API routes
adminUserRouter.get("/getall-user", getAllUserAdminController);
adminUserRouter.get("/get-user/:id", getUSerByIdController);
adminUserRouter.get("/getuser-cart", getUserCartAdminController);
adminUserRouter.put("/update-user/:id", updateUserController);
adminUserRouter.delete("/delete-user/:userId", deleteUserAdminController);

export default adminUserRouter;

// Controller for getting all users with pagination
async function getAllUserAdminController(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;

    const users = await userModel
      .find({}, "fname lname email phone address")
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const totalUsers = await userModel.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    successResponse(res, "All Users", {
      users,
      pagination: {
        totalUsers,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.log("_getAllUserAdminController_", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

//get user by id
async function getUSerByIdController(req, res) {
  try {
    const { id } = req.params;
    if (!id) return errorResponse(res, 400, "User ID is required");

    const user = await userModel.findById(id);
    if (!user) return errorResponse(res, 404, "User not found");

    successResponse(res, "User Details", user);
  } catch (error) {
    console.error("_getUserById_", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

// Controller for getting a user's cart with pagination
async function getUserCartAdminController(req, res) {
  try {
    const { role } = res.locals;
    const { id, page = 1, limit = 10 } = req.query;

    if (role !== "admin") return errorResponse(res, 403, "Access Denied");
    if (!id) return errorResponse(res, 400, "User ID is required");

    // Fetch cart data
    const cartData = await cartModel
      .findOne({ userId: id })
      .populate("medicines.medicineId");

    if (!cartData)
      return errorResponse(res, 404, "No cart found for this user");

    // Paginate medicines array
    const paginatedMedicines = cartData.medicines.slice(
      (page - 1) * limit,
      page * limit
    );
    const totalItems = cartData.medicines.length;
    const totalPages = Math.ceil(totalItems / limit);

    successResponse(res, "User Cart Data", {
      cart: {
        _id: cartData._id,
        userId: cartData.userId,
        medicines: paginatedMedicines.map((item) => ({
          medicineId: item.medicineId._id,
          medicineName: item.medicineId.name,
          quantity: item.quantity,
        })),
      },
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error("_getUserCartAdminController_", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

// Delete user controller
async function deleteUserAdminController(req, res) {
  try {
    const { userId } = req.params;
    if (!userId) {
      return errorResponse(res, 400, "User ID is required");
    }

    // Delete user from the database
    const deletedUser = await userModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      return errorResponse(res, 404, "User not found");
    }

    // Delete the user's cart if it exists
    await cartModel.deleteOne({ userId });

    return successResponse(res, "User and cart deleted successfully.");
  } catch (error) {
    console.error("deleteUserAdminController Error:", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}

//update user
async function updateUserController(req, res) {
  try {
    const { id } = req.params;
    const { fname, lname, phone, address } = req.body;

    if (!id) return errorResponse(res, 400, "User ID is required");

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { fname, lname, phone, address },
      { new: true }
    );

    if (!updatedUser) return errorResponse(res, 404, "User not found");

    successResponse(res, "User updated successfully", updatedUser);
  } catch (error) {
    console.error("_updateUserController_", error);
    return errorResponse(res, 500, "Internal server error");
  }
}
