import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './configs/database.js';

// Feature Routes
import bookingRoutes from './routes/bookingRoutes.js';
import bidRouter from './routes/bidRouter.js';
import driverRouter from './routes/driverRouter.js';
import guideRouter from './routes/guideRouter.js';
import activityRouter from './routes/activityRouter.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

// Middleware
import errorHandler from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
connectDB();

// Basic routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Smart Virtual Tourist Guide API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

import restaurantRoutes from './routes/restaurantRoutes.js';

// Error handling middleware (must be last)
app.use('/api/bookings', bookingRoutes);
app.use('/api/bids', bidRouter);
app.use('/api/drivers', driverRouter);
app.use('/api/guides', guideRouter);
app.use('/api/activities', activityRouter);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/payments', paymentRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
