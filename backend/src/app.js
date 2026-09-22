import express, { json, urlencoded } from "express";
import { config } from "dotenv";
import connectDB from "./configs/database.js";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { configureCloudinary } from './configs/ActivityProvider/cloudinary.js';

// Import all routes
import roomRoutes from './routes/HotelOwner/Room.routes.js';
import specialPackageRoutes from './routes/HotelOwner/specialPackage.routes.js';
import roomAvailabilityRoutes from './routes/HotelOwner/roomAvailability.routes.js';
import userRoutes from './routes/HotelOwner/user.routes.js';
import vehicleRouter from './routes/vehicleRentAdmin/vehicleRouter.js';
import earningsRouter from './routes/vehicleRentAdmin/earningsRouter.js';
import vehicleBookingRouter from './routes/vehicleRentAdmin/rentalRequestsRouter.js';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import destinationRoutes from './routes/destinationRoutes.js';
import governmentDashboardRoutes from "./routes/dashboard.js";
import errorHandler from './middleware/errorHandler.js';
import adminAuthRoutes from './routes/Admin/adminAuthRoutes.js';
import adminRoutes from './routes/Admin/adminRoutes.js';
import tempHotBookRoutes from './routes/HotelOwner/tempHotBook.routes.js';                            
import hotelRevenueSummaryRoutes from './routes/HotelOwner/hotelRevenueSummary.routes.js';             
import startBookingSyncScheduler from './jobs/HotelOwner/bookingSyncScheduler.js'; 

// Restaurant route imports
import menuItemRoutes from './routes/Restuarant/menuItem.routes.js';
import offerRoutes from './routes/Restuarant/offer.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import reservationRoutes from './routes/Restuarant/reservation.routes.js';
import restaurantRoutes from './routes/Restuarant/restaurant.routes.js';

// Review Routes (Prashan's module)
import reviewRoutes from './routes/review.routes.js'; 

import budgetRoutes from './routes/TouristDashboard/budgetRoutes.js';
import bookingRoutes from './routes/TouristDashboard/bookingRoutes.js';
import itineraryRoutes from './routes/TouristDashboard/itineraryRoutes.js';
import notificationRoutes from './routes/TouristDashboard/notificationRoutes.js';
import touristRoutes from './routes/TouristDashboard/touristRoutes.js';
import bidRoutes from './routes/bidRoutes.js';

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
import rentVehicleBookingRouter from './routes/TouristDashboard/rentVehicleBookingRoutes.js';
import touristHotelViewRoutes from './routes/touristHotelViewRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import guideRoutes from './routes/guideRoutes.js';

import paymentRoutes from './routes/paymentRoutes.js';
import serviceBookingRoutes from './routes/bookingRoutes.js';

// Travel Package Routes
import packageRoutes from './routes/travelPackage/packageRoutes.js';
import advertisementRoutes from './routes/travelPackage/advertisementRoutes.js';

config();
configureCloudinary();
startBookingSyncScheduler(); 

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB();

// ============================================================================
// API ROUTES
// ============================================================================

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/safety', safetyRouter);

// Tourist Dashboard Routes
app.use('/api/budget', budgetRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/tourists', touristRoutes);
app.use('/api/bids', bidRoutes);

// Admin Routes
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin', adminRoutes);

// Navigation and Mapping Routes
app.use('/api/recent-places', serviceRouter);
app.use('/api/favorite-places', favoriteRouter);
app.use('/api/security-alerts', securityAlertRouter);
app.use('/api/incidents', incidentRouter);
app.use('/api/hotels', hotelRouter);

// Hotel Owner Routes
app.use('/api/rooms', roomRoutes);
app.use('/api/special-packages', specialPackageRoutes);
app.use('/api/room-availability', roomAvailabilityRoutes);
app.use('/api/users', userRoutes);
app.use('/api/temp-bookings', tempHotBookRoutes); 
app.use('/api/revenue-summary', hotelRevenueSummaryRoutes); 

app.use('/api/tourist/hotels', touristHotelViewRoutes);
app.use("/api/gov/dashboard", governmentDashboardRoutes);

app.use('/api/drivers', driverRoutes);
app.use('/api/guides', guideRoutes);

// Vehicle Rental Routes
app.use('/api/vehicle', vehicleRouter);
app.use('/api/vehicles', vehicleRouter);
app.use('/api/renter/earnings', earningsRouter);
app.use('/api/renter/bookings', vehicleBookingRouter);
app.use('/api/tourist/rent-vehicle-booking', rentVehicleBookingRouter);

// Activity Provider Routes
app.use('/api/activities', activityRoutes);
app.use('/api/activity-bookings', activityBookingRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/calendar/:activityId', activityCalenderRoutes);

// Payment & Booking Engine
app.use('/api/payment', paymentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/service-bookings', serviceBookingRoutes);
app.use('/api/bookings', serviceBookingRoutes);

// Travel Package Routes
app.use('/api/packages', packageRoutes);
app.use('/api/advertisements', advertisementRoutes);

// Restaurant Routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuItemRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/reservations', reservationRoutes);

// REVIEW ROUTES (YOUR MODULE)
app.use('/api/reviews', reviewRoutes);

// Image upload
app.use('/api/upload', uploadRoutes);

// 404 & Global Error Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

export default app;