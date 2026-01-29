import Dealer from "../models/Dealer.js";
import DealerDirectRequest from "../models/DealerDirectRequest.js";

/* ===========================
   CREATE DIRECT REQUEST
=========================== */
export const createDirectRequest = async (req, res) => {
  try {
    const dealerAuthId = req.user.id;

    const dealer = await Dealer.findOne({ authId: dealerAuthId });
    if (!dealer) {
      return res.status(404).json({ message: "Dealer not found" });
    }

    const {
      wasteType,
      quantityKg,
      amountPerKg,
      description,
    } = req.body;

    if (quantityKg <= 0 || amountPerKg <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid quantity or price" });
    }

    const request = await DealerDirectRequest.create({
      dealerId: dealer._id,
      wasteType,
      quantityKg,
      amountPerKg,
      description,
    });

    res.status(201).json({
      message: "Request sent to admin",
      request,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send request" });
  }
};

/* ===========================
   GET DEALER DIRECT REQUESTS
=========================== */
export const getDealerDirectRequests = async (req, res) => {
  try {
    const dealerAuthId = req.user.id;

    const dealer = await Dealer.findOne({ authId: dealerAuthId });
    if (!dealer) {
      return res.status(404).json({ message: "Dealer not found" });
    }

    const requests = await DealerDirectRequest.find({
      dealerId: dealer._id,
    }).sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch requests" });
  }
};

/* =========================
   CANCEL REQUEST (PENDING)
========================= */
export const cancelDirectRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await DealerDirectRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending requests can be cancelled" });
    }

    request.status = "cancelled";
    await request.save();

    res.json({ message: "Request cancelled" });
  } catch (err) {
    res.status(500).json({ message: "Cancel failed" });
  }
};

/* =========================
   MARK AS DELIVERED
========================= */
export const markDirectRequestDelivered = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await DealerDirectRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "accepted") {
      return res.status(400).json({
        message: "Only accepted requests can be delivered",
      });
    }

    request.status = "delivered";
    await request.save();

    res.json({ message: "Marked as delivered" });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

export const getAllDirectRequests = async (req, res) => {
  try {
    const requests = await DealerDirectRequest.find()
      .populate("dealerId", "name phone")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch requests" });
  }
};

/* ============================
   ACCEPT REQUEST
============================ */
export const acceptDirectRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await DealerDirectRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending requests can be accepted" });
    }

    request.status = "accepted";
    await request.save();

    res.json({ message: "Request accepted" });
  } catch (err) {
    res.status(500).json({ message: "Accept failed" });
  }
};

/* ============================
   REJECT REQUEST
============================ */
export const rejectDirectRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await DealerDirectRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending requests can be rejected" });
    }

    request.status = "rejected";
    await request.save();

    res.json({ message: "Request rejected" });
  } catch (err) {
    res.status(500).json({ message: "Reject failed" });
  }
};