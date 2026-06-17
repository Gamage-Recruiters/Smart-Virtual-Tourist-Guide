import express, { json, urlencoded } from 'express';
import { config } from 'dotenv';
import connectDB from "./configs/database.js";

// Load environment variables
config();

const app = express();

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

export default app;
