import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    medicines: [
      {
        medicineId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "medicines",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true }, // Store price at the time of order
      },
    ],

    totalAmount: { type: Number, required: true },
    prescription: { type: String }, // URL or base64 for uploaded prescription

    prescriptionStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: [
        "COD",
        "Credit Card",
        "Debit Card",
        "UPI",
        "Net Banking",
        "Razorpay",
      ],
      required: true,
    },
    estimatedDelivery: { type: Date },

    deliveryDetails: {
      agentId: { type: mongoose.Schema.Types.ObjectId, ref: "users" }, // Delivery person
      trackingId: { type: String },
    },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const orderModel = mongoose.model("orders", orderSchema);
export default orderModel;
