import express, { json, urlencoded } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Import all routes with correct paths
import roomRoutes from './routes/HotelOwner/Room.routes.js';
import specialPackageRoutes from './routes/HotelOwner/specialPackage.routes.js';
import roomAvailabilityRoutes from './routes/HotelOwner/roomAvailability.routes.js';
import userRoutes from './routes/HotelOwner/user.routes.js';
import vehicleRouter from './routes/vehicleRentAdmin/vehicleRouter.js';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import guideRoutes from './routes/guideRoutes.js';

// Activity Provider routes are mounted on this same exported Express app.
import activityRoutes from './routes/ActivityProvider/activity.routes.js';
import activityCalenderRoutes from './routes/ActivityProvider/activityCalender.routes.js';
import activityBookingRoutes from './routes/ActivityProvider/activityBooking.routes.js';
import availabilityRoutes from './routes/ActivityProvider/availability.routes.js';

// Restaurant route imports (from Integration-resturent/shakir branch)
import restaurantRoutes from './routes/restaurant.routes.js';
import menuItemRoutes from './routes/menuItem.routes.js';
import offerRoutes from './routes/offer.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import reservationRoutes from './routes/reservation.routes.js';
import reviewRoutes from './routes/review.routes.js';

config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// ==================== MIDDLEWARE ====================
// CORS - only once (removed duplicate)
app.use(cors());

// Body parsing middleware
app.use(json());
app.use(urlencoded({ extended: true }));

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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
      restaurants: 'GET /api/restaurants, POST /api/restaurants, PUT /api/restaurants/:id, DELETE /api/restaurants/:id',
      menu: 'GET /api/menu, POST /api/menu, PUT /api/menu/:id, DELETE /api/menu/:id',
      offers: 'GET /api/offers, POST /api/offers',
      reservations: 'GET /api/reservations, POST /api/reservations',
      reviews: 'GET /api/reviews, POST /api/reviews',
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

// Hotel Owner Routes - Room Management
app.use('/api/rooms', roomRoutes);
app.use('/api/packages', specialPackageRoutes);
app.use('/api/room-availability', roomAvailabilityRoutes);
app.use('/api/users', userRoutes);

// Vehicle Rental Routes
app.use('/api/vehicle', vehicleRouter);

// Restaurant Routes (from Integration-resturent/shakir branch)
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuItemRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/reviews', reviewRoutes);

// Guide marketplace and provider portal routes
app.use('/api/guides', guideRoutes);

// Activity Provider routes
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
