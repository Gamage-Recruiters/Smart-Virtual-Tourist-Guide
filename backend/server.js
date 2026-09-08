import "dotenv/config";
import http from "http";
import { Server } from "socket.io";

import app from "./src/app.js";
import connectDB from "./src/configs/database.js";

// ===== IMPORTS FROM MAIN BRANCH =====
import { configureCloudinary } from "./src/configs/ActivityProvider/cloudinary.js";
import activityRoutes from "./src/routes/ActivityProvider/activity.routes.js";
import activityCalenderRoutes from "./src/routes/ActivityProvider/activityCalender.routes.js";
import activityBookingRoutes from "./src/routes/ActivityProvider/activityBooking.routes.js";
import availabilityRoutes from "./src/routes/ActivityProvider/availability.routes.js";
//import serviceRouter from "./src/routes/NavigationAndMapping/serviceRouter.js";
//import favoriteRouter from "./src/routes/NavigationAndMapping/favoriteRouter.js";
//import securityAlertRouter from "./src/routes/NavigationAndMapping/securityAlertRouter.js";
//import incidentRouter from "./src/routes/NavigationAndMapping/incidentRouter.js";
//import hotelRouter from "./src/routes/NavigationAndMapping/hotelRouter.js";
//import safetyRouter from "./src/routes/Safety/safetyRouter.js";

// ===== NOTIFICATION ENGINE IMPORTS (OURS) =====
import notificationHandler from "./socket/notificationHandler.js";
import "./src/configs/firebaseConfig.js";
import seedRegions from "./src/utils/dbSeeder.js";
import socketAuth from "./src/middleware/socketAuthMiddleware.js";

// Configure cloudinary
configureCloudinary();

// ==========================================
// NOTIFICATION ENGINE: SOCKET.IO SETUP
// ==========================================
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

/* Make io globally available */
app.set("io", io);

/* Secure socket connection with JWT */
io.use(socketAuth);

/* Initialize socket routing and geo-fencing */
notificationHandler(io);

// ==========================================
// ROUTES FROM MAIN BRANCH
// ==========================================
// Mount Activity Provider routes
app.use('/api/activities', activityRoutes);
app.use('/api/bookings', activityBookingRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/calendar/:activityId', activityCalenderRoutes);

// Mount NavigationAndMapping routes
//app.use('/api/recent-places', serviceRouter);
//app.use('/api/favorite-places', favoriteRouter);
//app.use('/api/security-alerts', securityAlertRouter);
//app.use('/api/incidents', incidentRouter);
//app.use('/api/hotels', hotelRouter);

// Mount Safety routes
//  app.use('/api/safety', safetyRouter);


// Port
const PORT = process.env.PORT || 5000;

// Start server after DB connection
connectDB().then(async () => {

  /* Auto-seed geographic regions on startup for Notification Engine */
  await seedRegions();

  // Changed from app.listen to server.listen to support Socket.io
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('DB connection failed:', err);
  process.exit(1);
});