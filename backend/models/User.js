import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    authId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Login",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    address: {
      type: String,
    },
    pin: {
      type: String,
    },
    photo: {
      type: String, // image URL or filename
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
