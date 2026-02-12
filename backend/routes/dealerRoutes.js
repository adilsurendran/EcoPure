import express from "express";
import { getDealerProfile, getDealerStats, registerDealer, updateDealerProfile } from "../controllers/dealerController.js";
import { upload } from "../middlewares/upload.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const dealerRoutes = express.Router();

dealerRoutes.post(
  "/register/dealer",
  upload.single("photo"),
  registerDealer
);

dealerRoutes.get("/dealer/profile", requireAuth, authorizeRoles("dealer"), getDealerProfile);

dealerRoutes.put(
  "/dealer/profile",
  requireAuth,
  authorizeRoles("dealer"),
  upload.single("photo"), // optional photo update
  updateDealerProfile
);

dealerRoutes.get("/dealer/stats", requireAuth, authorizeRoles("dealer"), getDealerStats);


export default dealerRoutes;
