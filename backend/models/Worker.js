import mongoose from "mongoose";

const workerSchema = new mongoose.Schema(
  {
    authId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Login",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    isAvailable:{
      type:Boolean,
      default:true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Worker", workerSchema);
