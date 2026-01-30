import express from "express";
import {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  replyToComplaint,
} from "../controllers/complaintController.js";

import { requireAuth } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const complaintRoutes = express.Router();

/* USER */
complaintRoutes.post(
  "/complaints",
  requireAuth,
  authorizeRoles("user"),
  createComplaint
);

complaintRoutes.get(
  "/complaints/my",
  requireAuth,
  authorizeRoles("user"),
  getMyComplaints
);

/* ADMIN */
complaintRoutes.get(
  "/admin/complaints",
  requireAuth,
  authorizeRoles("admin"),
  getAllComplaints
);

complaintRoutes.put(
  "/admin/complaints/:id/reply",
  requireAuth,
  authorizeRoles("admin"),
  replyToComplaint
);

export default complaintRoutes;
