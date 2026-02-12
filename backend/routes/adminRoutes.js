import express from "express";

import { requireAuth } from "../middlewares/authMiddleware.js";
import { addWorkerByAdmin, getAdminStats, getAllDealers, getAllUserFeedbacks, getAllUsers, getAllWorkers, toggleDealerStatus, toggleUserStatus, toggleWorkerStatus } from "../controllers/adminController.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const adminRouter = express.Router();

adminRouter.get(
  "/admin/stats",
  requireAuth,
  authorizeRoles("admin"),
  getAdminStats
);

adminRouter.get(
  "/admin/users",
  requireAuth,
  authorizeRoles("admin"),
  getAllUsers
);

adminRouter.patch(
  "/admin/users/:authId/toggle",
  requireAuth,
  authorizeRoles("admin"),
  toggleUserStatus
);

adminRouter.get("/admin/workers", requireAuth, authorizeRoles("admin"), getAllWorkers);
adminRouter.patch(
  "/admin/workers/toggle/:authId",
  requireAuth,
  authorizeRoles("admin"),
  toggleWorkerStatus
);
adminRouter.post(
  "/admin/workers/add",
  requireAuth,
  authorizeRoles("admin"),
  addWorkerByAdmin
);

adminRouter.get("/admin/dealers", requireAuth, authorizeRoles("admin"), getAllDealers);
adminRouter.patch(
  "/admin/dealers/toggle/:authId",
  requireAuth,
  authorizeRoles("admin"),
  toggleDealerStatus
);

/* ADMIN */
adminRouter.get(
  "/admin/feedback",
  requireAuth,
  authorizeRoles("admin"),
  getAllUserFeedbacks
);

export default adminRouter;
