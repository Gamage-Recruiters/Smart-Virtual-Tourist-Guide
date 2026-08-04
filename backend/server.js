import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./src/configs/database.js";
import { configureCloudinary } from "./src/configs/cloudinary.js";
import activityRoutes from "./src/routes/activity.routes.js";
import activityCalenderRoutes from "./src/routes/activityCalender.routes.js";
import activityBookingRoutes from "./src/routes/activityBooking.routes.js";
import availabilityRoutes from "./src/routes/availability.routes.js";
import authRoutes from "./src/routes/auth-route/authRoutes.js";
import dashboardRoutes from "./src/routes/auth-route/dashboardRoutes.js";

// Configure cloudinary
configureCloudinary();

// create express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/bookings', activityBookingRoutes);
app.use('/api/availability', availabilityRoutes);
// Mount calendar routes so `:activityId` is a parent param
app.use('/api/calendar/:activityId', activityCalenderRoutes);

// Port
const PORT = process.env.PORT || 5000;

// Start server after DB connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('DB connection failed:', err);
  process.exit(1);
});
