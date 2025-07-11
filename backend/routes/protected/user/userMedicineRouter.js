import { Router } from "express";
import multer from "multer";
import {
  errorResponse,
  successResponse,
} from "../../../utils/serverResponse.js";
import medicineModel from "../../../models/medicineModel.js";
import userModel from "../../../models/userModel.js";
import cartModel from "../../../models/userCartModel.js";
import orderModel from "../../../models/userOrderModel.js";
import razorpay from "../../../utils/razorpayService.js";
import mongoose from "mongoose";
const userMedicineRouter = Router();

// Multer Setup for File Uploads (Avatars & Prescriptions)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isAvatar = file.fieldname === "avatar";
    cb(null, isAvatar ? "uploads/avatars/" : "uploads/prescriptions/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Medicine Routes
userMedicineRouter.get("/medicines", getAllUserMedicinesController);
userMedicineRouter.post("/add-cart", addToCartUserMedicineController);
userMedicineRouter.get("/cart", getUserCartController);
userMedicineRouter.put(
  "/cart/update/:medicineId",
  updateCartQuantityController
);

userMedicineRouter.post("/buy-medicine", buyUserMedicineController);

userMedicineRouter.delete("/delete/:id", deleteCartItemController);

userMedicineRouter.post(
  "/upload-prescription",
  upload.single("prescription"),
  uploadPrescriptionController
);

// Add these new routes
userMedicineRouter.post(
  "/cart/payment/razorpay/create-order",
  createRazorpayOrderController
);
userMedicineRouter.post(
  "/cart/payment/razorpay/verify",
  verifyRazorpayPaymentController
);

export default userMedicineRouter;

// Controller Functions (Medicine)
async function getAllUserMedicinesController(req, res) {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    if (page < 1 || limit < 1)
      return errorResponse(res, 400, "Invalid page or limit");

    const totalMedicines = await medicineModel.countDocuments();
    const medicines = await medicineModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit);

    successResponse(res, "All medicines", {
      totalMedicines,
      currentPage: page,
      totalPages: Math.ceil(totalMedicines / limit),
      medicines,
    });
  } catch (error) {
    console.error("_getAllUserMedicinesController_", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

//add to cart controller
async function addToCartUserMedicineController(req, res) {
  try {
    const { userId } = res.locals;
    const { medicineId, quantity } = req.body;

    if (!medicineId) return errorResponse(res, 400, "Medicine ID is required");
    if (!quantity || quantity < 1)
      return errorResponse(res, 400, "Invalid quantity");

    const user = await userModel.findById(userId);
    if (!user) return errorResponse(res, 404, "User not found");

    const medicine = await medicineModel.findById(medicineId);
    if (!medicine) return errorResponse(res, 404, "Medicine not found");

    const existingCart = await cartModel.findOne({ userId: user._id });

    if (existingCart) {
      const alreadyInCart = existingCart.medicines.some(
        (item) => item.medicineId.toString() === medicineId
      );
      if (alreadyInCart)
        return errorResponse(res, 400, "Medicine already in cart");

      existingCart.medicines.push({
        medicineId,
        quantity,
        price: medicine.price,
        isPrescriptionRequired: medicine.isPrescriptionRequired,
      });

      existingCart.totalPrice = existingCart.medicines.reduce(
        (total, item) => total + item.quantity * item.price,
        0
      );

      await existingCart.save();
      return successResponse(res, "Medicine added to cart", existingCart);
    }

    const newCart = new cartModel({
      userId: user._id,
      medicines: [
        {
          medicineId: medicine._id,
          quantity,
          price: medicine.price, // Ensure price is added
          isPrescriptionRequired: medicine.isPrescriptionRequired,
        },
      ],
      totalPrice: medicine.price * quantity,
    });

    await newCart.save();
    successResponse(res, "Medicine added to cart", newCart);
  } catch (error) {
    console.error("_addToCartUserMedicineController_", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

//buy medicine controller
// async function buyUserMedicineController(req, res) {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { userId, paymentMethod, totalAmount, paymentId, orderId } = req.body;

//     // Validate user
//     const user = await userModel.findById(userId).session(session);
//     if (!user) {
//       await session.abortTransaction();
//       return errorResponse(res, 404, "User not found");
//     }

//     // Get user cart with medicine details
//     const cart = await cartModel
//       .findOne({ userId })
//       .populate("medicines.medicineId")
//       .session(session);

//     if (!cart || cart.medicines.length === 0) {
//       await session.abortTransaction();
//       return errorResponse(res, 400, "Cart is empty");
//     }

//     let orderMedicines = [];
//     let hasPrescriptionPending = false;

//     // Check medicines and prescriptions
//     for (let cartItem of cart.medicines) {
//       const medicine = cartItem.medicineId;
//       if (!medicine) continue;

//       // Check stock
//       if (medicine.availableMedicines < cartItem.quantity) {
//         await session.abortTransaction();
//         return errorResponse(
//           res,
//           400,
//           `Insufficient stock for ${medicine.name}`
//         );
//       }

//       // Check prescription requirement
//       if (medicine.isPrescriptionRequired && !cartItem.isApproved) {
//         hasPrescriptionPending = true;
//         break;
//       }

//       // Deduct stock
//       medicine.availableMedicines -= cartItem.quantity;
//       await medicine.save({ session });

//       // Add to order
//       orderMedicines.push({
//         medicineId: medicine._id,
//         quantity: cartItem.quantity,
//         price: medicine.price,
//       });
//     }

//     if (hasPrescriptionPending) {
//       await session.abortTransaction();
//       return errorResponse(res, 403, "Prescription approval is pending");
//     }

//     // Verify Razorpay payment if applicable
//     if (paymentMethod === "Razorpay") {
//       try {
//         const payment = await razorpay.payments.fetch(paymentId);
//         if (payment.status !== "captured") {
//           await session.abortTransaction();
//           return errorResponse(res, 400, "Payment not captured");
//         }
//       } catch (error) {
//         await session.abortTransaction();
//         console.error("Razorpay verification failed:", error);
//         return errorResponse(res, 400, "Payment verification failed");
//       }
//     }

//     // Create order
//     const newOrder = await orderModel.create(
//       [
//         {
//           userId,
//           medicines: orderMedicines,
//           totalAmount,
//           paymentMethod,
//           prescriptionStatus: "approved",
//           orderStatus: "pending",
//           paymentStatus: paymentMethod === "COD" ? "pending" : "paid",
//           razorpayPaymentId:
//             paymentMethod === "Razorpay" ? paymentId : undefined,
//           razorpayOrderId: paymentMethod === "Razorpay" ? orderId : undefined,
//           estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
//         },
//       ],
//       { session }
//     );

//     // Update user's order history
//     user.orderHistory.push({
//       orderId: newOrder[0]._id,
//       orderDate: new Date(),
//       totalAmount,
//       status: "pending",
//     });
//     await user.save({ session });

//     // Clear cart
//     cart.medicines = [];
//     cart.totalPrice = 0;
//     await cart.save({ session });

//     await session.commitTransaction();

//     return successResponse(res, "Order placed successfully", {
//       orderId: newOrder[0]._id,
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     console.error("Error in buyUserMedicineController:", error);
//     return errorResponse(res, 500, "Something went wrong. Please try again.");
//   } finally {
//     session.endSession();
//   }
// }
async function buyUserMedicineController(req, res) {
  try {
    const { userId, paymentMethod, totalAmount, paymentId, orderId } = req.body;

    // Validate user
    const user = await userModel.findById(userId);
    if (!user) return errorResponse(res, 404, "User not found");

    // Get user cart with medicine details
    const cart = await cartModel
      .findOne({ userId })
      .populate("medicines.medicineId");
    if (!cart || cart.medicines.length === 0) {
      return errorResponse(res, 400, "Cart is empty");
    }

    let orderMedicines = [];
    let hasPrescriptionPending = false;

    // Check medicines and prescriptions
    for (let cartItem of cart.medicines) {
      const medicine = cartItem.medicineId;
      if (!medicine) continue;

      // Check stock
      if (medicine.availableMedicines < cartItem.quantity) {
        return errorResponse(
          res,
          400,
          `Insufficient stock for ${medicine.name}`
        );
      }

      // Check prescription requirement
      if (medicine.isPrescriptionRequired && !cartItem.isApproved) {
        hasPrescriptionPending = true;
        break;
      }

      // Deduct stock
      medicine.availableMedicines -= cartItem.quantity;
      await medicine.save();

      // Add to order
      orderMedicines.push({
        medicineId: medicine._id,
        quantity: cartItem.quantity,
        price: medicine.price,
      });
    }

    if (hasPrescriptionPending) {
      return errorResponse(res, 403, "Prescription approval is pending");
    }

    // Verify Razorpay payment if applicable
    if (paymentMethod === "Razorpay") {
      try {
        const payment = await razorpay.payments.fetch(paymentId);
        if (payment.status !== "captured") {
          return errorResponse(res, 400, "Payment not captured");
        }
      } catch (error) {
        console.error("Razorpay verification failed:", error);
        return errorResponse(res, 400, "Payment verification failed");
      }
    }

    // Create order
    const newOrder = await orderModel.create({
      userId,
      medicines: orderMedicines,
      totalAmount,
      paymentMethod,
      prescriptionStatus: "approved",
      orderStatus: "pending",
      paymentStatus: paymentMethod === "COD" ? "pending" : "paid",
      razorpayPaymentId: paymentMethod === "Razorpay" ? paymentId : undefined,
      razorpayOrderId: paymentMethod === "Razorpay" ? orderId : undefined,
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    });

    // Update user's order history
    user.orderHistory.push({
      orderId: newOrder._id,
      orderDate: new Date(),
      totalAmount,
      status: "pending",
    });
    await user.save();

    // Clear cart
    cart.medicines = [];
    cart.totalPrice = 0;
    await cart.save();

    return successResponse(res, "Order placed successfully", {
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Error in buyUserMedicineController:", error);
    return errorResponse(res, 500, "Something went wrong. Please try again.");
  }
}

//upload medicine controller
async function uploadPrescriptionController(req, res) {
  try {
    const { medicineId, userId } = req.body;
    const prescriptionPath = req.file ? req.file.path : null;

    const user = await userModel.findById(userId);
    if (!user) return errorResponse(res, 404, "User not found");

    await cartModel.updateOne(
      { userId: user._id, "medicines.medicineId": medicineId },
      {
        $set: {
          "medicines.$.isApproved": true,
          "medicines.$.prescription": prescriptionPath,
        },
      }
    );

    successResponse(res, "Prescription uploaded successfully");
  } catch (error) {
    console.error("_uploadPrescriptionController_", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

//update wuantity
async function updateCartQuantityController(req, res) {
  try {
    const { userId } = res.locals;
    const { medicineId } = req.params; // Fixed parameter extraction
    const { quantity } = req.body;

    console.log("Received update request:", { userId, medicineId, quantity });

    if (quantity < 1)
      return errorResponse(res, 400, "Quantity cannot be less than 1");

    const cart = await cartModel.findOne({ userId });
    if (!cart) return errorResponse(res, 404, "Cart not found");

    const medicineIndex = cart.medicines.findIndex(
      (med) => med.medicineId.toString() === medicineId
    );

    if (medicineIndex === -1)
      return errorResponse(res, 404, "Medicine not found in cart");

    // Correct quantity update
    cart.medicines[medicineIndex].quantity = quantity;

    cart.totalPrice = cart.medicines.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    await cart.save();
    return successResponse(res, "Cart updated successfully", cart);
  } catch (error) {
    console.error("_updateCartQuantityController_", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

//delete
async function deleteCartItemController(req, res) {
  try {
    const { userId } = res.locals;
    const { id } = req.params;

    const cart = await cartModel.findOne({ userId });
    if (!cart) return errorResponse(res, 404, "Cart not found");

    cart.medicines = cart.medicines.filter(
      (item) => item.medicineId.toString() !== id
    );
    cart.totalPrice = cart.medicines.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    await cart.save();
    successResponse(res, "Item removed from cart", cart);
  } catch (error) {
    console.error("_removeCartItemController_", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

//

async function getUserCartController(req, res) {
  try {
    const { userId } = res.locals;
    const cart = await cartModel
      .findOne({ userId })
      .populate("medicines.medicineId");

    if (!cart) return errorResponse(res, 404, "Cart not found");

    successResponse(res, "Cart fetched successfully", cart);
  } catch (error) {
    console.error("_getUserCartController_", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

//payment

async function createRazorpayOrderController(req, res) {
  try {
    const { amount } = req.body;
    const { userId } = res.locals;

    if (!amount || isNaN(amount)) {
      return errorResponse(res, 400, "Valid amount is required");
    }

    // Validate cart exists
    const cart = await cartModel
      .findOne({ userId })
      .populate("medicines.medicineId");

    if (!cart || cart.medicines.length === 0) {
      return errorResponse(res, 400, "Cart is empty");
    }

    // Check for prescription items
    const hasPendingPrescription = cart.medicines.some(
      (item) => item.medicineId.isPrescriptionRequired && !item.isApproved
    );

    if (hasPendingPrescription) {
      return errorResponse(
        res,
        403,
        "Prescription approval pending for some items"
      );
    }

    // Calculate actual cart total
    const cartTotal = cart.medicines.reduce(
      (total, item) => total + item.quantity * item.medicineId.price,
      0
    );

    if (Math.abs(amount - cartTotal) > 1) {
      return errorResponse(res, 400, "Amount doesn't match cart total");
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt: `order_${Date.now()}`,
      payment_capture: 1, // Auto-capture payment
      notes: {
        userId: userId.toString(),
        cartId: cart._id.toString(),
      },
    });

    return successResponse(res, "Razorpay order created", {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", {
      error: error.error,
      description: error.error?.description,
    });
    return errorResponse(
      res,
      500,
      error.error?.description || "Failed to create Razorpay order"
    );
  }
}

async function verifyRazorpayPaymentController(req, res) {
  try {
    const { paymentId, orderId } = req.body;
    const { userId } = res.locals;

    if (!paymentId || !orderId) {
      return errorResponse(res, 400, "Payment ID and Order ID are required");
    }

    // 1. First verify the payment with Razorpay
    const payment = await razorpay.payments.fetch(paymentId);
    if (payment.status !== "captured") {
      return errorResponse(res, 400, "Payment not captured");
    }

    // 2. Get user cart
    const cart = await cartModel
      .findOne({ userId })
      .populate("medicines.medicineId");
    if (!cart) {
      return errorResponse(res, 404, "Cart not found");
    }

    // 3. Process order creation
    const orderAmount = payment.amount / 100;
    let orderMedicines = [];
    let hasPrescriptionPending = false;

    // Check all medicines
    for (let cartItem of cart.medicines) {
      const medicine = cartItem.medicineId;

      if (!medicine) continue;

      // Check stock
      if (medicine.availableMedicines < cartItem.quantity) {
        return errorResponse(
          res,
          400,
          `Insufficient stock for ${medicine.name}`
        );
      }

      // Check prescription
      if (medicine.isPrescriptionRequired && !cartItem.isApproved) {
        hasPrescriptionPending = true;
        break;
      }

      // Deduct stock
      medicine.availableMedicines -= cartItem.quantity;
      await medicine.save();

      orderMedicines.push({
        medicineId: medicine._id,
        quantity: cartItem.quantity,
        price: medicine.price,
      });
    }

    if (hasPrescriptionPending) {
      return errorResponse(res, 403, "Prescription approval is pending");
    }

    // 4. Create the order
    const newOrder = await orderModel.create({
      userId,
      medicines: orderMedicines,
      totalAmount: orderAmount,
      paymentMethod: "Razorpay",
      prescriptionStatus: "approved",
      orderStatus: "pending",
      paymentStatus: "paid",
      razorpayPaymentId: paymentId,
      razorpayOrderId: orderId,
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    });

    // 5. Update user's order history
    const user = await userModel.findById(userId);
    user.orderHistory.push({
      orderId: newOrder._id,
      orderDate: new Date(),
      totalAmount: orderAmount,
      status: "pending",
    });
    await user.save();

    // 6. Clear cart
    cart.medicines = [];
    cart.totalPrice = 0;
    await cart.save();

    return successResponse(res, "Payment verified and order created", {
      orderId: newOrder._id,
      payment,
    });
  } catch (error) {
    console.error("Order creation failed after payment:", error);

    // CRITICAL: Send notification to admin about failed order
    await notifyAdminAboutFailedOrder(userId, paymentId, orderId, error);

    return errorResponse(res, 500, {
      message:
        "Payment succeeded but order failed. Our team has been notified.",
      supportContact: "support@yourpharmacy.com",
      paymentId, // Include for reference
      orderId, // Include for reference
    });
  }
}
