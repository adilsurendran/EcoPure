import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    reply: {
      type: String,
    },

    repliedAt: {
      type: Date,
    },
  },
  { timestamps: true } // createdAt
);

export default mongoose.model("Complaint", complaintSchema);
