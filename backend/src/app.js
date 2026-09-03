import express, { json, urlencoded } from 'express';
import { config } from 'dotenv';
import connectDB from "./configs/database.js";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { configureCloudinary } from './configs/ActivityProvider/cloudinary.js';

// Import all routes with correct paths
import roomRoutes from './routes/HotelOwner/Room.routes.js';
import specialPackageRoutes from './routes/HotelOwner/specialPackage.routes.js';
import roomAvailabilityRoutes from './routes/HotelOwner/roomAvailability.routes.js';
import userRoutes from './routes/HotelOwner/user.routes.js';
import vehicleRouter from './routes/vehicleRentAdmin/vehicleRouter.js';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import destinationRoutes from './routes/destinationRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import adminAuthRoutes from './routes/Admin/adminAuthRoutes.js';
import adminRoutes from './routes/Admin/adminRoutes.js';

// Restaurant route imports (from Integration-resturent/shakir branch)

import menuItemRoutes from './routes/menuItem.routes.js';
import offerRoutes from './routes/offer.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import reservationRoutes from './routes/reservation.routes.js';
import reviewRoutes from './routes/review.routes.js';

import budgetRoutes from './routes/TouristDashboard/budgetRoutes.js';
import bookingRoutes from './routes/TouristDashboard/bookingRoutes.js';

import itineraryRoutes from './routes/TouristDashboard/itineraryRoutes.js';
import notificationRoutes from './routes/TouristDashboard/notificationRoutes.js';
import touristRoutes from './routes/TouristDashboard/touristRoutes.js';

import safetyRouter from './routes/Safety/safetyRouter.js';
import serviceRouter from './routes/NavigationAndMapping/serviceRouter.js';
import favoriteRouter from './routes/NavigationAndMapping/favoriteRouter.js';
import securityAlertRouter from './routes/NavigationAndMapping/securityAlertRouter.js';
import incidentRouter from './routes/NavigationAndMapping/incidentRouter.js';
import hotelRouter from './routes/NavigationAndMapping/hotelRouter.js';
import activityRoutes from './routes/ActivityProvider/activity.routes.js';
import activityBookingRoutes from './routes/ActivityProvider/activityBooking.routes.js';
import availabilityRoutes from './routes/ActivityProvider/availability.routes.js';
import activityCalenderRoutes from './routes/ActivityProvider/activityCalender.routes.js';
import errorHandler from './middleware/HotelOwner/errorHandler.js';

config();
configureCloudinary();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// ==================== MIDDLEWARE ====================

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ==================== DATABASE CONNECTION ====================
connectDB();

// ==================== BASIC ROUTES ====================
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Smart Virtual Tourist Guide API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      auth: 'POST /api/auth/register, POST /api/auth/login',
      dashboard: 'GET /api/dashboard',
      rooms: 'GET /api/rooms, POST /api/rooms, PUT /api/rooms/:id, DELETE /api/rooms/:id',
      packages: 'GET /api/packages, POST /api/packages, PUT /api/packages/:id, DELETE /api/packages/:id',
      roomAvailability: 'GET /api/room-availability, POST /api/room-availability, PUT /api/room-availability/:id, DELETE /api/room-availability/:id',
      users: 'GET /api/users, POST /api/users, PUT /api/users/:id, DELETE /api/users/:id',
      vehicle: 'GET /api/vehicle, POST /api/vehicle, PUT /api/vehicle/:id, DELETE /api/vehicle/:id',
      activities: 'GET /api/activities, POST /api/activities, PUT /api/activities/:id, DELETE /api/activities/:id, PATCH /api/activities/:id/publish',
      bookings: 'GET /api/bookings, PATCH /api/bookings/:id/status',
      availability: 'GET /api/availability, GET /api/availability/date/:date',
      calendar: 'GET /api/calendar/:activityId/month, GET /api/calendar/:activityId/summary, GET /api/calendar/:activityId/date/:date, POST /api/calendar/:activityId/date/:date, PATCH /api/calendar/:activityId/date/:date/unavailable'
    }
  });
});

// Health check - single endpoint (removed duplicate)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'Connected'
  });
});

// ==================== API ROUTES ====================
// Authentication Routes
app.use('/api/auth', authRoutes);

// Dashboard Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/safety', safetyRouter);

// Admin Routes
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin', adminRoutes);

// Navigation and Mapping Routes
app.use('/api/recent-places', serviceRouter);
app.use('/api/favorite-places', favoriteRouter);
app.use('/api/security-alerts', securityAlertRouter);
app.use('/api/incidents', incidentRouter);
app.use('/api/hotels', hotelRouter);

// Hotel Owner Routes - Room Management
app.use('/api/rooms', roomRoutes);
app.use('/api/packages', specialPackageRoutes);
app.use('/api/room-availability', roomAvailabilityRoutes);
app.use('/api/users', userRoutes);

// Vehicle Rental Routes
app.use('/api/vehicle', vehicleRouter);

// Activity Provider Routes
app.use('/api/activities', activityRoutes);
app.use('/api/bookings', activityBookingRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/calendar/:activityId', activityCalenderRoutes);

// ==================== ERROR HANDLING ====================
// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler middleware (must be last)
app.use(errorHandler);

export default app;
