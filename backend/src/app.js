import express from 'express';
import dotenv from 'dotenv';
import vehicleRouter from './routes/vehicleRentAdmin/vehicleRouter.js';
import cors from 'cors';
import authRouter from './routes/authRoutes.js';

import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import errorHandler from './middleware/errorHandler.js';

export const app = express();

// 2. Configure CORS Middleware
app.use(cors());

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

// basic routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Smart Virtual Tourist Guide API' });
});

// Vehicle routes
app.use('/api/vehicle', vehicleRouter);
app.use('/api/auth', authRouter);

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// error handler middleware
app.use(errorHandler);

export default app;
