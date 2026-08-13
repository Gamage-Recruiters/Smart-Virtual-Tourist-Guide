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

// Triggering restart to load .env
