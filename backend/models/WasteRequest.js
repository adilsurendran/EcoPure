import mongoose from "mongoose";

const wasteRequestSchema = new mongoose.Schema(
  {
    dealerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dealer",
      required: true,
    },

    wastePostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WastePost",
      required: true,
    },

    requiredWeight: {
      type: Number,
      required: true, // kg
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected","cancelled","delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("WasteRequest", wasteRequestSchema);
