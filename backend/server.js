import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/configs/database.js";
import { configureCloudinary } from "./src/configs/ActivityProvider/cloudinary.js";
import activityRoutes from "./src/routes/ActivityProvider/activity.routes.js";
import activityCalenderRoutes from "./src/routes/ActivityProvider/activityCalender.routes.js";
import activityBookingRoutes from "./src/routes/ActivityProvider/activityBooking.routes.js";
import availabilityRoutes from "./src/routes/ActivityProvider/availability.routes.js";
import serviceRouter from "./src/routes/NavigationAndMapping/serviceRouter.js";
import favoriteRouter from "./src/routes/NavigationAndMapping/favoriteRouter.js";
import securityAlertRouter from "./src/routes/NavigationAndMapping/securityAlertRouter.js";
import incidentRouter from "./src/routes/NavigationAndMapping/incidentRouter.js";
import hotelRouter from "./src/routes/NavigationAndMapping/hotelRouter.js";
import safetyRouter from "./src/routes/Safety/safetyRouter.js"
import cron from "node-cron";
import { syncWeatherAlerts } from "./src/utils/alertSyncService.js";
import logger from "./src/utils/logger.js";

// Configure cloudinary
configureCloudinary();

// Mount Activity Provider routes
app.use('/api/activities', activityRoutes);
app.use('/api/bookings', activityBookingRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/calendar/:activityId', activityCalenderRoutes);

// Mount NavigationAndMapping routes
app.use('/api/recent-places', serviceRouter);
app.use('/api/favorite-places', favoriteRouter);
app.use('/api/security-alerts', securityAlertRouter);
app.use('/api/incidents', incidentRouter);
app.use('/api/hotels', hotelRouter);

// Mount Safety routes
app.use('/api/safety', safetyRouter);

// Port
const PORT = process.env.PORT || 5000;

// In-flight guard to prevent overlapping weather syncs
let isSyncing = false;

// Start server after DB connection
connectDB().then(() => {
  app.listen(PORT, () => {
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
