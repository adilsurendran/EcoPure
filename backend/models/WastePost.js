import mongoose from "mongoose";

const wastePostSchema = new mongoose.Schema(
  {
    wasteType: {
      type: String,
      required: true, // paper, ewaste, plastic
    },

    totalWeight: {
      type: Number,
      required: true, // kg
    },

    availableWeight: {
      type: Number,
      required: true, // kg
    },

    pricePerKg: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
    },

    photo: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("WastePost", wastePostSchema);
