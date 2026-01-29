import express from "express";

import { requireAuth } from "../middlewares/authMiddleware.js";
import { assignWorker, cancelPickupRequest, completePickup, createPickupRequest, getAllPickups, getAssignedPickups, getAvailableWorkers, getPickupHistory, getUserPickupRequests, markPickupCollected } from "../controllers/pickupRequestController.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const PickupRequestRouter = express.Router();

PickupRequestRouter.post("/", requireAuth,authorizeRoles("user"), createPickupRequest);
PickupRequestRouter.get("/my", requireAuth,authorizeRoles("user"), getUserPickupRequests);
PickupRequestRouter.patch("/:id/cancel", requireAuth,authorizeRoles("user"), cancelPickupRequest);
PickupRequestRouter.put(
  "/:id/collect",
  requireAuth,
  authorizeRoles("user"),
  markPickupCollected
);

PickupRequestRouter.get("/admin/pickups", requireAuth, authorizeRoles("admin"), getAllPickups);
PickupRequestRouter.get("/admin/pickups/workers", requireAuth, authorizeRoles("admin"), getAvailableWorkers);
PickupRequestRouter.post("/admin/pickups/assign", requireAuth, authorizeRoles("admin"), assignWorker);
PickupRequestRouter.patch("/admin/pickups/:id/complete", requireAuth, authorizeRoles("admin"), completePickup);

PickupRequestRouter.get("/worker/pickups/assigned", requireAuth, authorizeRoles("worker"), getAssignedPickups);
PickupRequestRouter.get("/worker/pickups/history", requireAuth, authorizeRoles("worker"), getPickupHistory);

export default PickupRequestRouter;
