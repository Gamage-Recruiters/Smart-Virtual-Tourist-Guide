import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./src/configs/database.js";

dotenv.config();

import authRoutes from "./src/routes/authRoutes.js";
import budgetRoutes from "./src/routes/budgetRoutes.js";
import touristRoutes from "./src/routes/touristRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import bookingRoutes from "./src/routes/bookingRoutes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";
import itineraryRoutes from "./src/routes/itineraryRoutes.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "Backend is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/tourist", touristRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/itinerary", itineraryRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

app.use((err, _req, res, _next) => {
  console.error("[backend] Unhandled error:", err);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

if (process.env.MONGODB_URI) {
  connectDB();
} else {
  console.warn("[backend] MONGODB_URI is not set; skipping MongoDB connection.");
}

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
