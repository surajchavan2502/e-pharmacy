import { Router } from "express";
import {
  errorResponse,
  successResponse,
} from "../../../utils/serverResponse.js";
import medicineModel from "../../../models/medicineModel.js";
import cartModel from "../../../models/userCartModel.js";
import userModel from "../../../models/userModel.js";
import orderModel from "../../../models/userOrderModel.js";
import { Server } from "socket.io";
import Razorpay from "razorpay";
import Stripe from "stripe";

const adminMedicineRouter = Router();
const io = new Server();
const razorpay = new Razorpay({
  key_id: "your_key",
  key_secret: "your_secret",
});
const stripe = new Stripe("your_secret_key");

//Medicine CRUD Routes
adminMedicineRouter.get("/getall", adminGetAllMedicineController);
adminMedicineRouter.post("/create-medicine", adminCreateMedicineController);
adminMedicineRouter.put("/update-medicine", adminUpdateMedicineController);
adminMedicineRouter.delete("/delete-medicine", adminDeleteMedicineController);
adminMedicineRouter.get("/medicine/:id", adminGetMedicineByIdController);

//Prescription Approval Routes
adminMedicineRouter.put(
  "/approve-cart-item/:itemId",
  approveCartItemController
);

adminMedicineRouter.put(
  "/bulk-approve-cart-items",
  bulkApproveCartItemsController
);

adminMedicineRouter.get(
  "/get-prescription-cart/:id",
  userPrescriptionController
);

//Order Management Routes
adminMedicineRouter.get("/orders", adminGetAllOrdersController);
adminMedicineRouter.put("/update-order-status", updateOrderStatus);

//Dashboard Analytics Route
adminMedicineRouter.get("/dashboard", getAdminDashboardController);

//Payment Gateway Routes (Razorpay & Stripe)
adminMedicineRouter.post("/create-order", createRazorpayOrder);
adminMedicineRouter.post("/stripe-payment", createStripePayment);

//Real-time Updates (Socket.io)
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("updateOrder", (data) => {
    io.emit("orderUpdated", data);
  });

  socket.on("disconnect", () => console.log("User disconnected"));
});

export default adminMedicineRouter;
//Controllers
async function adminGetAllMedicineController(req, res) {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const totalMedicines = await medicineModel.countDocuments();
    const medicines = await medicineModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit);

    successResponse(res, "Success", {
      medicines,
      totalPages: Math.ceil(totalMedicines / limit),
      currentPage: page,
    });
  } catch (error) {
    return errorResponse(res, 500, "Internal server error");
  }
}

async function checkBatchNumberExists(batchNumber) {
  const existingMedicine = await medicineModel.findOne({ batchNumber });
  return existingMedicine;
}

async function adminCreateMedicineController(req, res) {
  try {
    const {
      name,
      description,
      category,
      price,
      discount,
      stock,
      expiryDate,
      manufacturer,
      batchNumber,
      isPrescriptionRequired,
      images,
      tags,
    } = req.body;

    // Check if the medicine already exists based on batch number
    const existingMedicine = await checkBatchNumberExists(batchNumber);
    if (existingMedicine) {
      return errorResponse(
        res,
        400,
        "Medicine with this batch number already exists"
      );
    }

    const newMedicine = new medicineModel({
      name,
      description,
      category,
      price,
      discount,
      stock,
      expiryDate,
      manufacturer,
      batchNumber,
      isPrescriptionRequired,
      images,
      tags,
    });

    await newMedicine.save();
    return successResponse(res, "Medicine created successfully", newMedicine);
  } catch (error) {
    return errorResponse(res, 500, "Internal server error");
  }
}

async function adminUpdateMedicineController(req, res) {
  try {
    const {
      medicineId,
      name,
      description,
      category,
      price,
      discount,
      stock,
      expiryDate,
      manufacturer,
      batchNumber,
      isPrescriptionRequired,
      images,
      tags,
    } = req.body;

    // Check if another medicine with the same batch number exists (but not the current medicine itself)
    const existingMedicine = await checkBatchNumberExists(batchNumber);
    if (existingMedicine && existingMedicine._id.toString() !== medicineId) {
      return errorResponse(
        res,
        400,
        "Medicine with this batch number already exists"
      );
    }

    // Find the medicine by ID and update it with new details
    const updatedMedicine = await medicineModel.findByIdAndUpdate(
      medicineId,
      {
        name,
        description,
        category,
        price,
        discount,
        stock,
        expiryDate,
        manufacturer,
        batchNumber,
        isPrescriptionRequired,
        images,
        tags,
      },
      { new: true }
    );

    if (!updatedMedicine) {
      return errorResponse(res, 404, "Medicine not found");
    }

    return successResponse(
      res,
      "Medicine updated successfully",
      updatedMedicine
    );
  } catch (error) {
    return errorResponse(res, 500, "Internal server error");
  }
}

async function adminDeleteMedicineController(req, res) {
  try {
    const { medicineId } = req.body;
    const medicine = await medicineModel.findById(medicineId);
    if (!medicine) {
      return errorResponse(res, 404, "Medicine not found");
    }

    await medicineModel.findByIdAndDelete(medicineId);
    return successResponse(res, "Medicine deleted successfully");
  } catch (error) {
    return errorResponse(res, 500, "Internal server error");
  }
}

async function adminGetMedicineByIdController(req, res) {
  try {
    const { id } = req.params;
    const medicine = await medicineModel.findById(id);
    if (!medicine) {
      return errorResponse(res, 404, "Medicine not found");
    }

    return successResponse(res, "Medicine found", medicine);
  } catch (error) {
    return errorResponse(res, 500, "Internal server error");
  }
}

async function approveCartItemController(req, res) {
  try {
    const { itemId } = req.params;
    const { isApproved } = req.body;

    // Validate input
    if (typeof isApproved !== "boolean") {
      return errorResponse(res, 400, "Invalid approval status");
    }

    // Find the cart containing the item and update it
    const updatedCart = await cartModel
      .findOneAndUpdate(
        { "medicines._id": itemId },
        {
          $set: {
            "medicines.$.isApproved": isApproved,
            updatedAt: new Date(),
          },
        },
        { new: true }
      )
      .populate({
        path: "medicines.medicineId",
        select: "name price images isPrescriptionRequired",
      });

    if (!updatedCart) {
      return errorResponse(res, 404, "Cart item not found");
    }

    // Find the updated item
    const updatedItem = updatedCart.medicines.find(
      (item) => item._id.toString() === itemId
    );

    if (!updatedItem) {
      return errorResponse(res, 404, "Item not found after update");
    }

    // Format response
    const response = {
      _id: updatedItem._id,
      medicineId: updatedItem.medicineId._id,
      medicineName: updatedItem.medicineId.name,
      medicinePrice: updatedItem.medicineId.price,
      medicineImage: updatedItem.medicineId.images?.[0] || null,
      quantity: updatedItem.quantity,
      isPrescriptionRequired: updatedItem.medicineId.isPrescriptionRequired,
      isApproved: updatedItem.isApproved,
    };

    return successResponse(
      res,
      `Item ${isApproved ? "approved" : "rejected"}`,
      response
    );
  } catch (error) {
    console.error("Error approving cart item:", error);
    return errorResponse(res, 500, error.message || "Internal server error");
  }
}

async function bulkApproveCartItemsController(req, res) {
  try {
    const { userId, approve } = req.body;

    // Validate input
    if (typeof approve !== "boolean") {
      return errorResponse(res, 400, "Invalid approval status");
    }

    // Update all prescription items for this user
    const result = await cartModel
      .findOneAndUpdate(
        { userId },
        {
          $set: {
            "medicines.$[elem].isApproved": approve,
            updatedAt: new Date(),
          },
        },
        {
          arrayFilters: [{ "elem.isPrescriptionRequired": true }],
          new: true,
        }
      )
      .populate({
        path: "medicines.medicineId",
        select: "name price images isPrescriptionRequired",
      });

    if (!result) {
      return errorResponse(res, 404, "Cart not found for this user");
    }

    // Filter only the updated prescription items
    const updatedItems = result.medicines
      .filter((item) => item.isPrescriptionRequired)
      .map((item) => ({
        _id: item._id,
        medicineId: item.medicineId._id,
        medicineName: item.medicineId.name,
        medicinePrice: item.medicineId.price,
        medicineImage: item.medicineId.images?.[0] || null,
        quantity: item.quantity,
        isPrescriptionRequired: true,
        isApproved: item.isApproved,
      }));

    return successResponse(
      res,
      `${updatedItems.length} items ${approve ? "approved" : "rejected"}`,
      { updatedItems }
    );
  } catch (error) {
    console.error("Error bulk approving items:", error);
    return errorResponse(res, 500, error.message || "Internal server error");
  }
}

// Update the controller function
async function userPrescriptionController(req, res) {
  try {
    const { id: userId } = req.params; // Get from params instead of query
    console.log("userId ", userId);

    if (!userId) {
      return errorResponse(res, 400, "User ID is required");
    }

    // Optimized query to only get prescription-required, unapproved items
    const cart = await cartModel
      .findOne({ userId })
      .populate({
        path: "medicines.medicineId",
        match: { isPrescriptionRequired: true },
        select: "name price isPrescriptionRequired images",
      })
      .lean();

    if (!cart) {
      return successResponse(res, "No cart found", { cart: null });
    }

    // Filter only unapproved prescription items
    const prescriptionMedicines = cart.medicines.filter(
      (item) => item.medicineId && !item.isApproved
    );

    // Consistent response structure
    const response = {
      _id: cart._id,
      userId: cart.userId,
      medicines: prescriptionMedicines.map((item) => ({
        _id: item._id,
        medicineId: item.medicineId._id,
        medicineName: item.medicineId.name,
        medicinePrice: item.medicineId.price,
        medicineImage: item.medicineId.images?.[0] || null,
        quantity: item.quantity,
        isPrescriptionRequired: true, // We already filtered for this
        isApproved: item.isApproved,
      })),
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };

    return successResponse(res, "Prescription cart fetched", {
      cart: response.medicines.length ? response : null,
    });
  } catch (error) {
    console.error("Error fetching prescription cart:", error);
    return errorResponse(res, 500, error.message || "Internal server error");
  }
}

async function adminGetAllOrdersController(req, res) {
  try {
    let { page = 1, limit = 10, status } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filter = status ? { orderStatus: status } : {};
    const totalOrders = await orderModel.countDocuments(filter);
    const orders = await orderModel
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    successResponse(res, "Fetched orders", {
      orders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
    });
  } catch (error) {
    return errorResponse(res, 500, "Internal server error");
  }
}

async function updateOrderStatus(req, res) {
  try {
    const { orderId, status } = req.body;
    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { new: true }
    );

    io.emit("orderUpdated", order);
    successResponse(res, "Order updated", order);
  } catch (error) {
    return errorResponse(res, 500, "Failed to update order");
  }
}

async function getAdminDashboardController(req, res) {
  try {
    // Total Sales
    const totalSales = await orderModel.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    // Orders Breakdown
    const ordersData = await orderModel.aggregate([
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]);
    const ordersBreakdown = ordersData.reduce((acc, order) => {
      acc[order._id] = order.count;
      return acc;
    }, {});

    // Top-Selling Medicines
    const topSellingMedicines = await orderModel.aggregate([
      { $unwind: "$medicines" },
      {
        $group: {
          _id: "$medicines.medicineId",
          totalSold: { $sum: "$medicines.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "medicines",
          localField: "_id",
          foreignField: "_id",
          as: "medicineDetails",
        },
      },
      { $unwind: "$medicineDetails" },
      {
        $project: {
          name: "$medicineDetails.name",
          totalSold: 1,
        },
      },
    ]);

    // Low Stock Medicines
    const lowStockMedicines = await medicineModel.find({ stock: { $lt: 10 } });

    // Total Users
    const totalUsers = await userModel.countDocuments({ role: "user" });

    successResponse(res, "Dashboard stats", {
      totalSales: totalSales[0]?.total || 0,
      ordersBreakdown,
      topSellingMedicines,
      lowStockMedicines,
      totalUsers,
    });
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch dashboard stats");
  }
}

async function createRazorpayOrder(req, res) {
  try {
    const { amount, currency } = req.body;
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency,
      payment_capture: 1,
    });
    successResponse(res, "Order created", order);
  } catch (error) {
    return errorResponse(res, 500, "Failed to create Razorpay order");
  }
}

async function createStripePayment(req, res) {
  try {
    const { amount, currency } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      payment_method_types: ["card"],
    });
    successResponse(res, "Payment intent created", paymentIntent.client_secret);
  } catch (error) {
    return errorResponse(res, 500, "Failed to create Stripe payment");
  }
}
