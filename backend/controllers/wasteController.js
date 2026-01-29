import Dealer from "../models/Dealer.js";
import WastePost from "../models/WastePost.js";
import WasteRequest from "../models/WasteRequest.js";

/* ==========================
   CREATE WASTE POST (ADMIN)
========================== */
export const createWastePost = async (req, res) => {
  try {
    const {
      wasteType,
      totalWeight,
      pricePerKg,
      description,
    } = req.body;

    const post = await WastePost.create({
      wasteType,
      totalWeight,
      availableWeight: totalWeight,
      pricePerKg,
      description,
      photo: req.file ? req.file.filename : null,
    });

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

/* ==========================
   GET ADMIN POSTS
========================== */
export const getAdminWastePosts = async (req, res) => {
  try {

    const posts = await WastePost.find().sort({
      createdAt: -1,
    });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

/* ==========================
   UPDATE POST
========================== */
export const updateWastePost = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = {
      ...req.body,
    };

    if (req.file) {
      updateData.photo = req.file.filename;
    }

    const post = await WastePost.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

/* ==========================
   DELETE POST
========================== */
export const deleteWastePost = async (req, res) => {
  try {
    const { id } = req.params;

    await WastePost.findByIdAndDelete(id);

    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};


export const getAllWastePosts = async (req, res) => {
  try {
    const posts = await WastePost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch waste posts" });
  }
};

/* ===========================
   CREATE DEALER REQUEST
=========================== */
export const createWasteRequest = async (req, res) => {
  try {
    const dealerAuthId = req.user.id;
    const { wastePostId, requiredWeight } = req.body;

    // find dealer
    const dealer = await Dealer.findOne({ authId: dealerAuthId });
    if (!dealer) {
      return res.status(404).json({ message: "Dealer not found" });
    }

    // find post
    const post = await WastePost.findById(wastePostId);
    if (!post) {
      return res.status(404).json({ message: "Waste post not found" });
    }

    if (requiredWeight > post.availableWeight) {
      return res
        .status(400)
        .json({ message: "Requested weight exceeds available weight" });
    }

    const request = await WasteRequest.create({
      dealerId: dealer._id,
      wastePostId,
      requiredWeight,
    });

    res.status(201).json({
      message: "Request sent successfully",
      request,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Request failed" });
  }
};

export const getDealerRequests = async (req, res) => {
  try {
    const dealerAuthId = req.user.id;

    const dealer = await Dealer.findOne({ authId: dealerAuthId });
    if (!dealer) {
      return res.status(404).json({ message: "Dealer not found" });
    }

    const requests = await WasteRequest.find({
      dealerId: dealer._id,
    })
      .populate("wastePostId", "wasteType pricePerKg")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch requests" });
  }
};

/* ============================
   CANCEL REQUEST (PENDING)
============================ */
export const cancelDealerRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await WasteRequest.findById(id);
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
    console.log(err);
    
    res.status(500).json({ message: "Cancel failed" });
  }
};

/* ============================
   MARK AS DELIVERED
============================ */
export const markRequestDelivered = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await WasteRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "approved") {
      return res
        .status(400)
        .json({ message: "Only approved requests can be delivered" });
    }

    request.status = "delivered";
    await request.save();

    res.json({ message: "Marked as delivered" });
  } catch (err) {
    console.log(err);
    
    res.status(500).json({ message: "Update failed" });
  }
};

export const getAllWasteRequests = async (req, res) => {
  try {
    const requests = await WasteRequest.find()
      .populate("dealerId", "name phone")
      .populate("wastePostId", "wasteType availableWeight pricePerKg")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch requests" });
  }
};

/* ============================
   APPROVE REQUEST
============================ */
export const approveWasteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await WasteRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending requests can be approved" });
    }

    const post = await WastePost.findById(request.wastePostId);
    if (!post) {
      return res.status(404).json({ message: "Waste post not found" });
    }

    if (post.availableWeight < request.requiredWeight) {
      return res.status(400).json({
        message: "Insufficient available quantity",
      });
    }

    // 🔒 Atomic update
    post.availableWeight -= request.requiredWeight;
    await post.save();

    request.status = "approved";
    await request.save();

    res.json({ message: "Request approved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Approval failed" });
  }
};

/* ============================
   REJECT REQUEST
============================ */
export const rejectWasteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await WasteRequest.findById(id);
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
    res.status(500).json({ message: "Rejection failed" });
  }
};