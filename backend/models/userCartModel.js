import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
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
        price: { type: Number, required: true }, // Store price at the time of adding to cart

        prescriptionFile: { type: String }, // URL or base64 string
        isPrescriptionRequired: { type: Boolean, required: true },
        isApproved: { type: Boolean, default: false },
      },
    ],

    totalPrice: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const cartModel = mongoose.model("carts", cartSchema);
export default cartModel;
