import express, { json, urlencoded } from 'express';
import { config } from 'dotenv';
import connectDB from "./configs/database.js";
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
import adminAuthRoutes from './routes/adminAuthRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import errorHandler from './middleware/HotelOwner/errorHandler.js';

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
      vehicle: 'GET /api/vehicle, POST /api/vehicle, PUT /api/vehicle/:id, DELETE /api/vehicle/:id'
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

// Separate administrator authentication and API routes
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin', adminRoutes);

// Dashboard Routes
app.use('/api/dashboard', dashboardRoutes);

// Hotel Owner Routes - Room Management
app.use('/api/rooms', roomRoutes);
app.use('/api/packages', specialPackageRoutes);
app.use('/api/room-availability', roomAvailabilityRoutes);
app.use('/api/users', userRoutes);

// Vehicle Rental Routes
app.use('/api/vehicle', vehicleRouter);

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