require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const notificationHandler = require("./socket/notificationHandler");
const notificationRoutes = require("./src/routes/notificationRoutes.js");
const globalErrorHandler = require("./src/middleware/errorMiddleware");
require("./src/configs/firebaseConfig");
  
const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json()); // JSON data handle

/**
 * MongoDB Connection Logic
 * Connects to the database using the URI provided in the .env file.
 */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

/**
 * Initialize the Socket.io server to enable real-time communication.
 */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

/**
 * Global access for 'io' instance.
 * We set this AFTER 'io' is initialized so other services can use it.
 */
app.set("io", io);

/**
 * Connect the Socket instance to our Notification & Alerts Engine.
 */
notificationHandler(io);

// API Routes
app.use("/api/notifications", notificationRoutes);

app.use(globalErrorHandler);

// Server Port management
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
