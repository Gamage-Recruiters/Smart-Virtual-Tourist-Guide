import dotenv from 'dotenv';
import 'dotenv/config';
import app from './src/app.js';
import connectDB from './src/configs/database.js';
import { configureCloudinary } from './src/configs/ActivityProvider/cloudinary.js';

// Import Activity Provider routes
import activityRoutes from './src/routes/ActivityProvider/activity.routes.js';
import activityCalenderRoutes from './src/routes/ActivityProvider/activityCalender.routes.js';
import activityBookingRoutes from './src/routes/ActivityProvider/activityBooking.routes.js';
import availabilityRoutes from './src/routes/ActivityProvider/availability.routes.js';

// Load environment variables
dotenv.config();

// Configure Cloudinary
configureCloudinary();

// Mount Activity Provider routes
app.use('/api/activities', activityRoutes);
app.use('/api/bookings', activityBookingRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/calendar/:activityId', activityCalenderRoutes);

const PORT = process.env.PORT || 5000;

// Start server after DB connection
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB connection failed:', err);
    process.exit(1);
  });