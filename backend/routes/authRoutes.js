import express from "express";
import { getMe, login, logout, refreshToken } from "../controllers/authController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const authRoutes = express.Router();

authRoutes.post("/login", login);
authRoutes.get("/me", requireAuth, getMe);
authRoutes.post("/refresh", refreshToken);
authRoutes.post("/logout", logout);

export default authRoutes;
