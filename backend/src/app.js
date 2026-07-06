import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from './configs/database.js';
import vehicleRouter from './routes/vehicleRentAdmin/vehicleRouter.js';
import cors from 'cors';
import authRouter from './routes/authRoutes.js';

// Load environment variables
dotenv.config();

export const app = express();

// 2. Configure CORS Middleware
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Vehicle routes
app.use('/api/vehicle', vehicleRouter);
app.use('/api/auth', authRouter);

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});