import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./src/configs/db.js";
import { configureCloudinary } from "./src/configs/cloudinary.js";

// Configure cloudinary
configureCloudinary();

// create express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Port
const PORT = process.env.PORT || 5000;

// Start server after DB connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('DB connection failed:', err);
  process.exit(1);
});
