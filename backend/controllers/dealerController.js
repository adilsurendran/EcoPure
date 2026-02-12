import bcrypt from "bcryptjs";
import Login from "../models/Login.js";
import Dealer from "../models/Dealer.js";
import WastePost from "../models/WastePost.js";
import WasteRequest from "../models/WasteRequest.js";
import DealerDirectRequest from "../models/DealerDirectRequest.js";

export const registerDealer = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      lat,
      lng,
      password,
    } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // 🔐 Create auth (Login)
    const hashedPassword = await bcrypt.hash(password, 10);

    const auth = await Login.create({
      username: email, // or email if you prefer
      password: hashedPassword,
      role: "dealer",
      isActive: false, // 👈 admin approval
    });

    // 🏪 Create dealer profile
    const dealer = await Dealer.create({
      authId: auth._id,
      name,
      email,
      phone,
      address,
      location: {
        lat,
        lng,
      },
      photo: req.file ? req.file.filename : null,
    });

    res.status(201).json({
      message: "Dealer registered successfully. Await admin approval.",
      dealerId: dealer._id,
    });
  } catch (error) {
    console.error("Dealer register error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * GET Dealer Profile (Logged-in dealer)
 */
export const getDealerProfile = async (req, res) => {
  try {
    const workerLoginId = req.user.id;

    const dealer = await Dealer.findOne({ authId: workerLoginId }).select("-__v");

    if (!dealer) {
      return res.status(404).json({ message: "Dealer profile not found" });
    }

    res.status(200).json(dealer);
  } catch (error) {
    console.error("Get dealer profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/**
 * UPDATE Dealer Profile
 */
export const updateDealerProfile = async (req, res) => {
  try {
    const workerLoginId = req.user.id;

    const {
      name,
      phone,
      address,
      lat,
      lng,
    } = req.body;

    const updateData = {
      name,
      phone,
      address,
      location: {
        lat,
        lng,
      },
    };

    if (req.file) {
      updateData.photo = req.file.filename;
    }

    const updatedDealer = await Dealer.findOneAndUpdate(
      { authId: workerLoginId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedDealer) {
      return res.status(404).json({ message: "Dealer profile not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      data: updatedDealer,
    });
  } catch (error) {
    console.error("Update dealer profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

/* =========================
   GET DEALER DASHBOARD STATS
========================= */
export const getDealerStats = async (req, res) => {
  try {
    const loginId = req.user.id;
    const dealer = await Dealer.findOne({ authId: loginId }).select("_id");
    if (!dealer) {
      return res.status(404).json({ message: "Dealer not found" });
    }

    // 1. Total Active Waste Posts (Market Opportunities)
    const activePosts = await WastePost.countDocuments({ availableWeight: { $gt: 0 } });

    // 2. Pending Indirect Requests (My Bids)
    const pendingIndirect = await WasteRequest.countDocuments({
      dealerId: dealer._id,
      status: "pending"
    });

    // 3. Pending Direct Requests (My Direct Orders)
    const pendingDirect = await DealerDirectRequest.countDocuments({
      dealerId: dealer._id,
      status: "pending"
    });

    res.status(200).json({
      activePosts,
      pendingIndirect,
      pendingDirect
    });
  } catch (err) {
    console.error("Dealer Stats Error:", err);
    res.status(500).json({ message: "Failed to fetch dealer stats" });
  }
};
