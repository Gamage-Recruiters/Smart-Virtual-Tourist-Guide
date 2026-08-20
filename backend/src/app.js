import express from 'express';
import dotenv from 'dotenv';
import vehicleRouter from './routes/vehicleRentAdmin/vehicleRouter.js';
import cors from 'cors';
import authRouter from './routes/authRoutes.js';

import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import errorHandler from './middleware/errorHandler.js';

import budgetRoutes from './routes/TouristDashboard/budgetRoutes.js';
import bookingRoutes from './routes/TouristDashboard/bookingRoutes.js';

import itineraryRoutes from './routes/TouristDashboard/itineraryRoutes.js';
import notificationRoutes from './routes/TouristDashboard/notificationRoutes.js';
import touristRoutes from './routes/TouristDashboard/touristRoutes.js';

import safetyRouter from './routes/Safety/safetyRouter.js';

export const app = express();

// 2. Configure CORS Middleware
app.use(cors());

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/safety', safetyRouter);


// basic routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Smart Virtual Tourist Guide API' });
});

// Vehicle routes
app.use('/api/vehicle', vehicleRouter);
app.use('/api/auth', authRouter);

// Tourist Dashboard routes
app.use("/api/budget", budgetRoutes);
app.use("/api/tourist", touristRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/itinerary", itineraryRoutes);

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
