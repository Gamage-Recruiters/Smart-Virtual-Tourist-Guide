const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Smart Virtual Tourist Guide API" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// Feature Routes
const bidRouter = require("./src/routes/bidRouter");
const driverRouter = require("./src/routes/driverRouter");
const activityRouter = require("./src/routes/activityRouter");

app.use("/api/bids", bidRouter);
app.use("/api/drivers", driverRouter);
app.use("/api/activities", activityRouter);

// Error Handler (must be after routes)
const errorHandler = require("./src/middleware/errorHandler");
app.use(errorHandler);

// DB connection
const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  console.error("MONGO_URL is missing in .env file");
  process.exit(1);
}

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("MongoDB connected successfully");

    // Start server after DB connected
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });