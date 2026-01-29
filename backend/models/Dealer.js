import mongoose from "mongoose";

const dealerSchema = new mongoose.Schema(
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
    email: {
      type: String,
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
    photo: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Dealer", dealerSchema);
