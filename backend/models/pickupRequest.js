import mongoose from "mongoose";

const pickupRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      default: null,
    },
    wasteType: {
      type: String,
      required: true,
      enum: ["plastic", "organic", "e-waste", "metal", "mixed"],
    },
    address: {
      type: String,
    //   required: true,
    default:null,
    },
    location: {
      lat: { type: Number, required: true, default:null },
      lng: { type: Number, required: true, default:null },
    },
    status: {
      type: String,
      enum: ["pending", "assigned", "completed", "cancelled", "collected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "PickupRequest",
  pickupRequestSchema
);
