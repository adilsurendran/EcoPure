import bcrypt from "bcryptjs";
import Login from "../models/Login.js";
import User from "../models/User.js";
import UserFeedback from "../models/UserFeedback.js";

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      pin,
      lat,
      lng,
      username,
      password,
    } = req.body;
    console.log(req.body);
    

    // 1️⃣ Check username already exists
    const existing = await Login.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // 2️⃣ Create login (auth)
    const hashedPassword = await bcrypt.hash(password, 10);

    const auth = await Login.create({
      username:email,
      password: hashedPassword,
      role: "user",
    });

    // 3️⃣ Create user profile
    const user = await User.create({
      authId: auth._id,
      name,
      email,
      phone,
      address,
      pin,
      location: {
        lat,
        lng,
      },
      photo: req.file ? req.file.filename : null,
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
    });
  } catch (error) {
    console.error("User register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getUserProfile = async (req, res) => {
  try {
    const loginId = req.user.id;

    const user = await User.findOne({ authId: loginId }).select("-__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/* =========================
   UPDATE USER PROFILE
========================= */
export const updateUserProfile = async (req, res) => {
  try {
    const loginId = req.user.id;

    const {
      name,
      phone,
      address,
      pin,
      lat,
      lng,
    } = req.body;

    const updateData = {
      name,
      phone,
      address,
      pin,
      location: {
        lat,
        lng,
      },
    };

    if (req.file) {
      updateData.photo = req.file.filename;
    }

    const user = await User.findOneAndUpdate(
      { authId: loginId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};

export const sendUserFeedback = async (req, res) => {
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

    const feedback = await UserFeedback.create({
      userId: user._id,
      message,
    });

    res.status(201).json({
      message: "Feedback sent successfully",
      feedback,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send feedback" });
  }
};