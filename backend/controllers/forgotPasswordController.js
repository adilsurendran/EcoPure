import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import Login from "../models/Login.js";
import redis from "../config/redisClient.js";
import { sendOTPEmail } from "../utils/mailer.js";

/**
 * STEP 1: Send OTP
 */
export const sendForgotOTP = async (req, res) => {
  const { email } = req.body;

  const user = await Login.findOne({ username: email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);

  await redis.setEx(`otp:forgot:${email}`, 60, hashedOtp);

  await sendOTPEmail(email, otp);

  res.json({ message: "OTP sent to email" });
};

/**
 * STEP 2: Verify OTP
 */
export const verifyForgotOTP = async (req, res) => {
  const { email, otp } = req.body;

  const storedHash = await redis.get(`otp:forgot:${email}`);
  if (!storedHash) {
    return res.status(400).json({ message: "OTP expired" });
  }

  const isMatch = await bcrypt.compare(otp, storedHash);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  await redis.del(`otp:forgot:${email}`);

  const resetToken = jwt.sign(
    { email },
    process.env.RESET_TOKEN_SECRET,
    { expiresIn: "5m" }
  );

  res.json({ resetToken });
};

/**
 * STEP 3: Reset Password
 */
export const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  const decoded = jwt.verify(
    resetToken,
    process.env.RESET_TOKEN_SECRET
  );

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await Login.findOneAndUpdate(
    { username: decoded.email },
    { password: hashedPassword }
  );

  res.json({ message: "Password updated successfully" });
};
