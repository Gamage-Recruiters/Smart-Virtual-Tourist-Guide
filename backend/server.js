import "dotenv/config";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import cors from "cors";
import morgan from "morgan";

import notificationHandler from "./socket/notificationHandler.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";
import globalErrorHandler from "./src/middleware/errorMiddleware.js";
import "./src/configs/firebaseConfig.js";
import seedRegions from "./src/utils/dbSeeder.js";
import socketAuth from "./src/middleware/socketAuthMiddleware.js";
import userRoutes from "./src/routes/userRoutes.js";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(morgan("dev"));

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173", // Frontend URL එක
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  }),
);

// --- NOTIFICATION ENGINE SETUP START ---

/*
 * Make the Socket.io instance globally available in the Express app.
 * This allows our external controllers (e.g., exampleController) to access 'io'
 * and send real-time notifications via req.app.get('io').
 */
app.set("io", io);

/*
 * Secure the notification socket connection.
 * This middleware ensures that only authenticated users with a valid JWT can receive live alerts.
 */
io.use(socketAuth);

/*
 * Initialize the core real-time notification engine.
 * This handles user room joining, FCM topic subscriptions, and live GPS tracking/throttling.
 */
notificationHandler(io);

/*
 * Register the HTTP routes for the notification system.
 * This handles fetching message history, marking messages as read, and unread counts.
 */
app.use("/api/notifications", notificationRoutes);
app.use("/api/user", userRoutes);

// --- NOTIFICATION ENGINE SETUP END ---

app.use(globalErrorHandler);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("DB connection successful!");

    /*
     * Auto-seed geographic regions on startup.
     * This is required for the Notification Engine's local geo-fencing (location-based alerts) to work properly.
     */
    await seedRegions();

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
  });