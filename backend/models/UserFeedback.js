import mongoose from "mongoose";

const userFeedbackSchema = new mongoose.Schema(
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
  },
  { timestamps: true } // createdAt
);

export default mongoose.model("UserFeedback", userFeedbackSchema);
