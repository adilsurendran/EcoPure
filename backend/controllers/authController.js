import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.js";
import Login from "../models/Login.js";

export const login = async (req, res) => {
  try {
    console.log(req.body);
    
    const { username, password } = req.body;

    // 1️⃣ Check user exists in Login table
    const authUser = await Login.findOne({ username });
    if (!authUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2️⃣ Check account active
    if (!authUser.isActive) {
      return res.status(403).json({
        message: "Account is deactivated. Contact admin.",
      });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, authUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 4️⃣ Token payload
    const payload = {
      id: authUser._id,
      role: authUser.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // 5️⃣ Set secure HttpOnly cookies
    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({
        message: "Login successful",
        user: {
          id: authUser._id,
          username: authUser.username,
          role: authUser.role,
        },
      });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};



export const getMe = async (req, res) => {
  try {
    const authUser = await Login.findById(req.user.id).select(
      "_id username role"
    );

    if (!authUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        id: authUser._id,
        username: authUser.username,
        role: authUser.role,
      },
    });
  } catch (error) {
    console.error("GET /auth/me error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};



export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // Check user still exists
    const authUser = await Login.findById(decoded.id);
    if (!authUser || !authUser.isActive) {
      return res.status(401).json({ message: "Invalid session" });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken({
      id: authUser._id,
      role: authUser.role,
    });

    // Set new access token cookie
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return res.status(200).json({ message: "Token refreshed" });
  } catch (error) {
    console.error("Refresh token error:", error.message);
    return res.status(401).json({ message: "Refresh token expired" });
  }
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })
    .status(200)
    .json({ message: "Logged out successfully" });
};
