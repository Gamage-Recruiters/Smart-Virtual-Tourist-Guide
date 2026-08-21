import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/configs/database.js";
import { configureCloudinary } from "./src/configs/ActivityProvider/cloudinary.js";
import activityRoutes from "./src/routes/ActivityProvider/activity.routes.js";
import activityCalenderRoutes from "./src/routes/ActivityProvider/activityCalender.routes.js";
import activityBookingRoutes from "./src/routes/ActivityProvider/activityBooking.routes.js";
import availabilityRoutes from "./src/routes/ActivityProvider/availability.routes.js";

// Configure cloudinary
configureCloudinary();

// Mount Activity Provider routes
app.use('/api/activities', activityRoutes);
app.use('/api/bookings', activityBookingRoutes);
app.use('/api/availability', availabilityRoutes);
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
