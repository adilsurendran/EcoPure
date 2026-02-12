import pickupRequest from "../models/pickupRequest.js";
import User from "../models/User.js";
import Worker from "../models/Worker.js";

/* ---------------- CREATE REQUEST ---------------- */
export const createPickupRequest = async (req, res) => {
  try {
    const userLId = req.user.id; // from auth middleware
    const userId = await User.findOne({authId:userLId}).select("_id")

    const { wasteType, address, location } = req.body;

    const request = await pickupRequest.create({
      userId:userId._id,
      wasteType,
      address,
      location,
    });

    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({
      message: "Failed to create pickup request",
    });
  }
};

/* ---------------- GET USER REQUESTS ---------------- */
export const getUserPickupRequests = async (req, res) => {
  try {
    const userLoginId = req.user.id
    const userId = await User.findOne({authId:userLoginId}).select("_id")



    const requests = await pickupRequest.find({ userId:userId._id })
      .populate("workerId", "name phone")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (err) {
    console.log(err);
    
    res.status(500).json({
      message: "Failed to fetch pickup requests",
    });
  }
};

export const cancelPickupRequest = async (req, res) => {
  try {
    const userLoginId = req.user.id
    const userId = await User.findOne({authId:userLoginId}).select("_id")
    const { id } = req.params;

    const request = await pickupRequest.findOne({
      _id: id,
      userId:userId._id,
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (!["pending", "assigned"].includes(request.status)) {
      return res
        .status(400)
        .json({ message: "Cannot cancel this request" });
    }

    request.status = "cancelled";
    await request.save();

    res.status(200).json({ message: "Request cancelled" });
  } catch (err) {
    console.log(err);
    
    res.status(500).json({ message: "Cancel failed" });
  }
};
export const markPickupCollected = async (req, res) => {
  console.log(req.params,"hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
  
  try {
    const userLoginId = req.user.id;

    const user = await User.findOne({ authId: userLoginId }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { id } = req.params;

    const request = await pickupRequest.findOne({
      _id: id,
      userId: user._id,
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "assigned") {
      return res.status(400).json({
        message: "Only assigned requests can be marked as collected",
      });
    }

    request.status = "collected";
    await request.save();

    res.status(200).json({
      message: "Pickup marked as collected",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};


/* ---------------- GET ALL PICKUPS (FILTERABLE) ---------------- */
export const getAllPickups = async (req, res) => {
  console.log(req.query);
  
  try {
    const { status } = req.query;

    const filter = status && status !== "all" ? { status } : {};

    const pickups = await pickupRequest.find(filter)
      .populate("userId", "name phone")
      .populate("workerId", "name phone")
      .sort({ createdAt: -1 });

    res.status(200).json(pickups);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pickups" });
  }
};

/* ---------------- GET AVAILABLE WORKERS ---------------- */
export const getAvailableWorkers = async (req, res) => {
  try {
    const workers = await Worker.find({ isAvailable: true });
    res.status(200).json(workers);
  } catch {
    res.status(500).json({ message: "Failed to fetch workers" });
  }
};

/* ---------------- ASSIGN WORKER ---------------- */
export const assignWorker = async (req, res) => {
  try {
    const { pickupId, workerId } = req.body;

    const pickup = await pickupRequest.findById(pickupId);
    const worker = await Worker.findById(workerId);

    if (!pickup || !worker)
      return res.status(404).json({ message: "Not found" });

    pickup.workerId = workerId;
    pickup.status = "assigned";
    worker.isAvailable = false;

    await pickup.save();
    await worker.save();

    res.status(200).json({ message: "Worker assigned" });
  } catch(e) {
    console.log(e);
    
    res.status(500).json({ message: "Assignment failed" });
  }
};

/* ---------------- COMPLETE PICKUP ---------------- */
export const completePickup = async (req, res) => {
  try {
    const { id } = req.params;

    const pickup = await pickupRequest.findById(id).populate("workerId");
    if (!pickup) return res.status(404).json({ message: "Not found" });

    pickup.status = "completed";
    pickup.workerId.isAvailable = true;

    await pickup.workerId.save();
    await pickup.save();

    res.status(200).json({ message: "Pickup completed" });
  } catch {
    res.status(500).json({ message: "Completion failed" });
  }
};

export const getAssignedPickups = async (req, res) => {
  try {
    const workerLoginId = req.user.id;
    const workerId = await Worker.findOne({authId:workerLoginId}).select("_id")
    
    

    const pickups = await pickupRequest.find({
      workerId:workerId._id,
      status: "assigned",
    })
      .populate("userId", "name phone")
      .sort({ createdAt: -1 });

    res.status(200).json(pickups);
  } catch (err) {
    console.log(err);
    
    res.status(500).json({ message: "Failed to fetch assigned pickups" });
  }
};

/* ===============================
   GET PICKUP HISTORY
   (status = completed)
================================ */
export const getPickupHistory = async (req, res) => {
  try {
    const workerLoginId = req.user.id;
    const workerId = await Worker.findOne({authId:workerLoginId}).select("_id")
    
    const pickups = await pickupRequest.find({
      workerId,
      status: { $ne:"pending"},
    })
      .populate("userId", "name phone")
      .sort({ createdAt: -1 });

    res.status(200).json(pickups);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pickup history" });
  }
};