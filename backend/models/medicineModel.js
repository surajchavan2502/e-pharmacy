import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    category: { type: String, required: true },

    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0 }, // % discount

    stock: { type: Number, required: true, min: 0 },
    expiryDate: { type: Date, required: true },
    manufacturer: { type: String, required: true },
    batchNumber: { type: String, required: true, unique: true },

    isPrescriptionRequired: { type: Boolean, default: false },

    images: [{ type: String }], // Array of image URLs

    tags: [{ type: String }], // For easy searching (e.g., ["Painkiller", "Fever", "Headache"])

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const medicineModel = mongoose.model("medicines", medicineSchema);
export default medicineModel;
