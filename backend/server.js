import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/configs/database.js";
import cron from "node-cron";
import logger from "./src/utils/logger.js";
import { syncWeatherAlerts } from "./src/utils/alertSyncService.js";
import migrateGuideProfiles from "./src/migrations/migrateGuideProfiles.js";

// Port
const PORT = process.env.PORT || 5000;

// In-flight guard to prevent overlapping weather syncs
let isSyncing = false;

// Start server after DB connection
connectDB().then(async () => {
  await migrateGuideProfiles();
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
