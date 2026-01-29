import express from "express";
import {
  createWastePost,
  getAdminWastePosts,
  updateWastePost,
  deleteWastePost,
  getAllWastePosts,
  createWasteRequest,
  getDealerRequests,
  cancelDealerRequest,
  markRequestDelivered,
  getAllWasteRequests,
  approveWasteRequest,
  rejectWasteRequest,
} from "../controllers/wasteController.js";

import { requireAuth } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const wasteRoutes = express.Router();

wasteRoutes.post(
  "/admin/waste",
  requireAuth,
  upload.single("photo"),
  authorizeRoles("admin"),
  createWastePost
);

wasteRoutes.get("/admin/waste", requireAuth,authorizeRoles("admin"), getAdminWastePosts);

wasteRoutes.put(
  "/admin/waste/:id",
  requireAuth,
  upload.single("photo"),
  authorizeRoles("admin"),
  updateWastePost
);

wasteRoutes.delete("/admin/waste/:id", requireAuth,authorizeRoles("admin"), deleteWastePost);

wasteRoutes.get("/dealer/waste-posts", requireAuth,authorizeRoles("dealer"), getAllWastePosts);

// Dealer sends request
wasteRoutes.post("/dealer/waste-request", requireAuth,authorizeRoles("dealer"), createWasteRequest);

wasteRoutes.get("/dealer/requests", requireAuth,authorizeRoles("dealer"), getDealerRequests);
wasteRoutes.put("/dealer/requests/:id/cancel", requireAuth,authorizeRoles("dealer"), cancelDealerRequest);
wasteRoutes.put("/dealer/requests/:id/delivered", requireAuth,authorizeRoles("dealer"), markRequestDelivered);

wasteRoutes.get("/admin/waste-requests", requireAuth,authorizeRoles("admin"), getAllWasteRequests);
wasteRoutes.put("/admin/waste-requests/:id/approve", requireAuth,authorizeRoles("admin"), approveWasteRequest);
wasteRoutes.put("/admin/waste-requests/:id/reject", requireAuth,authorizeRoles("admin"), rejectWasteRequest);

export default wasteRoutes;
