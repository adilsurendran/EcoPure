import express from "express";
import {
  sendForgotOTP,
  verifyForgotOTP,
  resetPassword,
} from "../controllers/forgotPasswordController.js";

const forgotPasswordRoutes = express.Router();

forgotPasswordRoutes.post("/forgot-password", sendForgotOTP);
forgotPasswordRoutes.post("/verify-otp", verifyForgotOTP);
forgotPasswordRoutes.post("/reset-password", resetPassword);

export default forgotPasswordRoutes;
