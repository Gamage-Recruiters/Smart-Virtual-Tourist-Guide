import "dotenv/config";

import app from "./src/app.js";
import { connectDB } from "./src/db.js";

import { configureCloudinary } from "./src/configs/ActivityProvider/cloudinary.js";

// Activity Provider routes
import activityRoutes from "./src/routes/ActivityProvider/activity.routes.js";
import activityCalenderRoutes from "./src/routes/ActivityProvider/activityCalender.routes.js";
import activityBookingRoutes from "./src/routes/ActivityProvider/activityBooking.routes.js";
import availabilityRoutes from "./src/routes/ActivityProvider/availability.routes.js";

// -----------------------------------------------------------------------------
// Configure Cloudinary
// -----------------------------------------------------------------------------

configureCloudinary();

// -----------------------------------------------------------------------------
// Activity Provider Routes
// -----------------------------------------------------------------------------

app.use("/api/activities", activityRoutes);

app.use("/api/bookings", activityBookingRoutes);

app.use("/api/availability", availabilityRoutes);

app.use("/api/calendar/:activityId", activityCalenderRoutes);

// -----------------------------------------------------------------------------
// Port
// -----------------------------------------------------------------------------

const PORT = process.env.PORT || 5000;

// -----------------------------------------------------------------------------
// Start Server After Database Connection
// -----------------------------------------------------------------------------

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ DB connection failed:", error);
    process.exit(1);
  });