import User from "../models/User.js";
import Login from "../models/Login.js";
import Worker from "../models/Worker.js";
import Complaint from "../models/Complaint.js";
import WasteRequest from "../models/WasteRequest.js";
import DealerDirectRequest from "../models/DealerDirectRequest.js";
import PickupRequest from "../models/pickupRequest.js";

/**
 * GET /api/admin/users
 * Admin: View all users with auth status
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("authId", "username isActive role")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Failed to fetch users" });
  }
};

/**
 * PATCH /api/admin/users/:authId/toggle
 * Admin: Block / Unblock user
 */
export const toggleUserStatus = async (req, res) => {
  try {
    const { authId } = req.params;

    const authUser = await Login.findById(authId);

    if (!authUser || authUser.role !== "user") {
      return res.status(404).json({ message: "User not found" });
    }

    authUser.isActive = !authUser.isActive;
    await authUser.save();

    res.status(200).json({
      message: `User ${authUser.isActive ? "unblocked" : "blocked"} successfully`,
      isActive: authUser.isActive,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user status" });
  }
};


/**
 * GET all workers (with auth details)
 */
export const getAllWorkers = async (req, res) => {
  console.log("hioo");

  try {
    const workers = await Worker.find()
      .populate("authId", "username isActive role")
      .sort({ createdAt: -1 });
    console.log(workers);


    res.status(200).json(workers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch workers" });
  }
};

/**
 * APPROVE / BLOCK worker
 */
export const toggleWorkerStatus = async (req, res) => {
  try {
    const { authId } = req.params;

    const login = await Login.findById(authId);
    if (!login) {
      return res.status(404).json({ message: "Auth not found" });
    }

    login.isActive = !login.isActive;
    await login.save();

    res.status(200).json({
      message: `Worker ${login.isActive ? "approved" : "blocked"}`,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update status" });
  }
};

import bcrypt from "bcryptjs";
import Dealer from "../models/Dealer.js";
import UserFeedback from "../models/UserFeedback.js";

/**
 * ADD worker by admin
 */
export const addWorkerByAdmin = async (req, res) => {
  try {
    const {
      password,
      name,
      phone,
      email,
      age,
      gender,
    } = req.body;

    // check existing login
    const existing = await Login.findOne({ username: email });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Username already exists" });
    }

    // create login
    const hashedPassword = await bcrypt.hash(password, 10);

    const login = await Login.create({
      username: email,
      password: hashedPassword,
      role: "worker",
      isActive: true,
    });

    // create worker
    const worker = await Worker.create({
      authId: login._id,
      name,
      phone,
      email,
      age,
      gender,
    });

    res.status(201).json({
      message: "Worker added successfully",
      worker,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add worker" });
  }
};

export const getAllDealers = async (req, res) => {
  try {
    const dealers = await Dealer.find()
      .populate("authId", "username isActive")
      .sort({ createdAt: -1 });

    res.status(200).json(dealers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch dealers" });
  }
};

export const toggleDealerStatus = async (req, res) => {
  try {
    const { authId } = req.params;

    const login = await Login.findById(authId);
    if (!login) {
      return res.status(404).json({ message: "Auth not found" });
    }

    login.isActive = !login.isActive;
    await login.save();

    res.status(200).json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status" });
  }
};

export const getAllUserFeedbacks = async (req, res) => {
  try {
    const feedbacks = await UserFeedback.find()
      .populate("userId", "name phone email")
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch feedbacks" });
  }
};

/**
 * GET admin dashboard statistics in single call
 */
export const getAdminStats = async (req, res) => {
  try {
    // 1. Total Registered Users (Citizens)
    const totalUsers = await User.countDocuments();

    // 2. Total Registered Workers (Technical Team)
    const totalWorkers = await Worker.countDocuments();

    // 3. Total Registered Dealers (Portal Partners)
    const totalDealers = await Dealer.countDocuments();

    // 4. Pending Complaints (Awaiting reply from Admin)
    const pendingComplaints = await Complaint.countDocuments({
      reply: { $exists: false }
    });

    // 5. Pending Waste Market Requests (Requests for existing waste posts)
    const pendingWasteRequests = await WasteRequest.countDocuments({
      status: "pending"
    });

    // 6. Pending Custom Procurement Requests (Direct material requests)
    const pendingDirectRequests = await DealerDirectRequest.countDocuments({
      status: "pending"
    });

    // 7. Pending User Pickup Requests (Citizen requests for waste collection)
    const pendingUserPickups = await PickupRequest.countDocuments({
      status: "pending"
    });

    res.status(200).json({
      totalUsers,
      totalWorkers,
      totalDealers,
      pendingComplaints,
      pendingWasteRequests,
      pendingDirectRequests,
      pendingUserPickups
    });
  } catch (error) {
    console.error("Stats Fetch Error:", error);
    res.status(500).json({ message: "System failed to compute dashboard metrics" });
  }
};