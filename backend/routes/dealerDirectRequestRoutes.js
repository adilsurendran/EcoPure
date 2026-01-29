import express from "express";
import {
  acceptDirectRequest,
    cancelDirectRequest,
  createDirectRequest,
  getAllDirectRequests,
  getDealerDirectRequests,
  markDirectRequestDelivered,
  rejectDirectRequest,
} from "../controllers/dealerDirectRequestController.js";

import { requireAuth } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const dealerDirectRequestRoutes = express.Router();

dealerDirectRequestRoutes.post(
  "/dealer/direct-request",
  requireAuth,
  authorizeRoles("dealer"),
  createDirectRequest
);

dealerDirectRequestRoutes.get(
  "/dealer/direct-requests",
  requireAuth,
  authorizeRoles("dealer"),
  getDealerDirectRequests
);

// 🔴 NEW
dealerDirectRequestRoutes.put(
  "/dealer/direct-requests/:id/cancel",
  requireAuth,
  authorizeRoles("dealer"),
  cancelDirectRequest
);

// 🔴 NEW
dealerDirectRequestRoutes.put(
  "/dealer/direct-requests/:id/delivered",
  requireAuth,
  authorizeRoles("dealer"),
  markDirectRequestDelivered
);

dealerDirectRequestRoutes.get(
  "/admin/direct-requests",
  requireAuth,
  authorizeRoles("admin"),
  getAllDirectRequests
);

dealerDirectRequestRoutes.put(
  "/admin/direct-requests/:id/accept",
  requireAuth,
  authorizeRoles("admin"),
  acceptDirectRequest
);

dealerDirectRequestRoutes.put(
  "/admin/direct-requests/:id/reject",
  requireAuth,
  authorizeRoles("admin"),
  rejectDirectRequest
);
export default dealerDirectRequestRoutes;
