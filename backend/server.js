import "dotenv/config";
import http from "http";
import { Server } from "socket.io";

import app from "./src/app.js";
import connectDB from "./src/configs/database.js";

// ===== NOTIFICATION ENGINE & WEATHER CRON IMPORTS (HEAD) =====
import cron from "node-cron";
import logger from "./src/utils/logger.js";
import { syncWeatherAlerts } from "./src/utils/alertSyncService.js";
import notificationHandler from "./socket/notificationHandler.js";
import "./src/configs/firebaseConfig.js";
import seedRegions from "./src/utils/dbSeeder.js";
import socketAuth from "./src/middleware/socketAuthMiddleware.js";

// ===== ACTIVITY PROVIDER IMPORTS (DEV) =====
import { configureCloudinary } from "./src/configs/ActivityProvider/cloudinary.js";
import activityRoutes from "./src/routes/ActivityProvider/activity.routes.js";
import activityCalenderRoutes from "./src/routes/ActivityProvider/activityCalender.routes.js";
import activityBookingRoutes from "./src/routes/ActivityProvider/activityBooking.routes.js";
import availabilityRoutes from "./src/routes/ActivityProvider/availability.routes.js";

// Configure cloudinary (From Dev)
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
// MOUNT ROUTES
// ==========================================
// Activity Provider routes (From Dev)
app.use('/api/activities', activityRoutes);
app.use('/api/bookings', activityBookingRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/calendar/:activityId', activityCalenderRoutes);

// Port
const PORT = process.env.PORT || 5000;

// In-flight guard to prevent overlapping weather syncs
let isSyncing = false;

// Start server after DB connection
connectDB().then(async () => {

  /* Auto-seed geographic regions on startup for Notification Engine */
  await seedRegions();

  // Changed from app.listen to server.listen to support Socket.io
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    //Initial startup sync ---
    (async () => {
      try {
        logger.info('[Cron] Running initial weather sync on startup...');
        isSyncing = true;
        await syncWeatherAlerts();
        logger.info('[Cron] Initial weather sync completed at', new Date().toISOString());
      } catch (error) {
        logger.error('[Cron] Initial weather sync failed:', error);
      } finally {
        isSyncing = false;
      }
    })();

    // Schedule 2-hour recurring sync ---
    cron.schedule('0 */2 * * *', async () => {
      if (isSyncing) {
        logger.warn('[Cron] Sync skipped: previous run still in progress');
        return;
      }
      isSyncing = true;
      try {
        logger.info('[Cron] Running scheduled 2-hour weather sync...');
        await syncWeatherAlerts();
        logger.info('[Cron] Weather sync completed at', new Date().toISOString());
      } catch (error) {
        logger.error('[Cron] Scheduled weather sync failed:', error);
      } finally {
        isSyncing = false;
      }
    }, { timezone: 'Asia/Colombo' });

    logger.info('[Cron] Weather sync scheduled every 2 hours (Asia/Colombo timezone)');
  });
}).catch((err) => {
  console.error('DB connection failed:', err);
  process.exit(1);
});