import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import userRoutes from "./routes/userRoutes.js";
import dealerRoutes from "./routes/dealerRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import PickupRequestRouter from "./routes/pickupRequestRoutes.js";
import wasteRoutes from "./routes/wasteRoutes.js";
import dealerDirectRequestRoutes from "./routes/dealerDirectRequestRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import forgotPasswordRoutes from "./routes/forgotPasswordRoutes.js";

const app = express();
// console.log(process.env.CLIENT_URL);

// CORS — THIS IS ENOUGH
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api", userRoutes);
app.use("/api", dealerRoutes);
app.use("/api", adminRouter);
app.use("/api/auth", authRoutes);
app.use("/api/auth", forgotPasswordRoutes);
app.use("/api/pickups", PickupRequestRouter);
app.use("/api", wasteRoutes);
app.use("/api", dealerDirectRequestRoutes);
app.use("/api", complaintRoutes);

/* ===========================
   STATIC FILES (IMPORTANT)
=========================== */
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

export default app;
