import mongoose from "mongoose";

const dealerDirectRequestSchema = new mongoose.Schema(
  {
    dealerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dealer",
      required: true,
    },

    wasteType: {
      type: String,
      required: true,
    },

    quantityKg: {
      type: Number,
      required: true,
    },

    amountPerKg: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "DealerDirectRequest",
  dealerDirectRequestSchema
);
