import User from "../models/User.js";
import Complaint from "../models/Complaint.js";

/* =========================
   USER SEND COMPLAINT
========================= */
export const createComplaint = async (req, res) => {
  try {
    const loginId = req.user.id;

    const user = await User.findOne({ authId: loginId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message required" });
    }

    const complaint = await Complaint.create({
      userId: user._id,
      message,
    });

    res.status(201).json(complaint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit complaint" });
  }
};

/* =========================
   USER VIEW HIS COMPLAINTS
========================= */
export const getMyComplaints = async (req, res) => {
  try {
    const loginId = req.user.id;

    const user = await User.findOne({ authId: loginId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const complaints = await Complaint.find({
      userId: user._id,
    }).sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
};

/* =========================
   ADMIN VIEW ALL COMPLAINTS
========================= */
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("userId", "name phone email")
      .sort({
        repliedAt: 1, // unanswered first
        createdAt: -1,
      });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
};

/* =========================
   ADMIN REPLY TO COMPLAINT
========================= */
export const replyToComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    if (!reply || !reply.trim()) {
      return res.status(400).json({ message: "Reply required" });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      {
        reply,
        repliedAt: new Date(),
      },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: "Reply failed" });
  }
};
