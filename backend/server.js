require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const notificationHandler = require("./socket/notificationHandler");
const notificationRoutes = require("./src/routes/notificationRoutes.js");
const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const serviceRoutes = require("./src/routes/serviceRouter");
const globalErrorHandler = require("./src/middleware/errorMiddleware");
const socketAuth = require("./src/middleware/socketAuthMiddleware");
const seedRegions = require("./src/utils/dbSeeder");
require("./src/configs/firebaseConfig");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  }),
);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);
io.use(socketAuth);
notificationHandler(io);

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/user", userRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(globalErrorHandler);

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/tourdb")
  .then(async () => {
    console.log("DB connection successful!");
    await seedRegions();

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
  });
