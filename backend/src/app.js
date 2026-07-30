import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './configs/database.js';

// Feature Routes
import bookingRoutes from './routes/bookingRoutes.js';
import bidRouter from './routes/bidRouter.js';
import driverRouter from './routes/driverRouter.js';
import activityRouter from './routes/activityRouter.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

// Middleware
import errorHandler from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Basic routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Smart Virtual Tourist Guide API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// API routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/bids', bidRouter);
app.use('/api/drivers', driverRouter);
app.use('/api/activities', activityRouter);
app.use('/api/dashboard', dashboardRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
