const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./src/configs/database");

dotenv.config();

const authRoutes = require("./src/routes/authRoutes");
const budgetRoutes = require("./src/routes/budgetRoutes");
const touristRoutes = require("./src/routes/touristRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const bookingRoutes = require("./src/routes/bookingRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");
const itineraryRoutes = require("./src/routes/itineraryRoutes");

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
