import jwt from "jsonwebtoken";
import Login from "../models/Login.js";

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // 1️⃣ Verify token
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    // 2️⃣ Fetch user from DB (CRITICAL)
    const authUser = await Login.findById(decoded.id).select(
      "-password"
    );

    if (!authUser) {
      return res.status(401).json({ message: "User not found" });
    }

    // 3️⃣ Check if blocked
    if (!authUser.isActive) {
      return res
        .status(403)
        .json({ message: "Account is blocked by admin" });
    }

    // 4️⃣ Attach clean user object
    req.user = {
      id: authUser._id,
      role: authUser.role,
    };

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or expired token" });
  }
};
