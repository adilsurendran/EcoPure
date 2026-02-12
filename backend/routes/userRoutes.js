import express from "express";
import { getUserProfile, getUserStats, registerUser, sendUserFeedback, updateUserProfile } from "../controllers/userController.js";
import { upload } from "../middlewares/upload.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const userRoutes = express.Router();

userRoutes.post("/register/user", upload.single("photo"), registerUser);

userRoutes.get(
  "/user/profile",
  requireAuth,
  authorizeRoles("user"),
  getUserProfile
);

userRoutes.put(
  "/user/profile",
  requireAuth,
  authorizeRoles("user"),
  upload.single("photo"),
  updateUserProfile
);

userRoutes.post(
  "/feedback",
  requireAuth,
  authorizeRoles("user"),
  sendUserFeedback
);

userRoutes.get(
  "/user/stats",
  requireAuth,
  authorizeRoles("user"),
  getUserStats
);

export default userRoutes;
