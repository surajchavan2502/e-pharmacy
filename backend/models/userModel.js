import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fname: { type: String, required: true, trim: true },
    lname: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    phone: { type: String, required: true, unique: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
    },

    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },

    medicalHistory: [
      {
        condition: String,
        medications: String,
        allergies: String,
      },
    ],

    prescriptions: [
      {
        prescriptionUrl: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
        reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" }, // Admin/pharmacist who reviewed
      },
    ],

    orderHistory: [
      {
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "orders" },
        orderDate: { type: Date, default: Date.now },
        totalAmount: { type: Number },
        status: {
          type: String,
          enum: ["pending", "shipped", "delivered", "cancelled"],
          default: "pending",
        },
      },
    ],

    walletBalance: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    forgototp: { type: Number },

    notifications: [
      {
        message: { type: String, required: true },
        type: { type: String, enum: ["order", "prescription"], required: true },
        createdAt: { type: Date, default: Date.now },
        read: { type: Boolean, default: false },
      },
    ],
    avatar: { type: String },
  },

  { timestamps: true }
);

const userModel = mongoose.model("users", userSchema);
export default userModel;
