import express, { json, urlencoded } from "express";
import { config } from "dotenv";
import connectDB from "./configs/database.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Import routes
import roomRoutes from "./routes/HotelOwner/Room.routes.js";
import specialPackageRoutes from "./routes/HotelOwner/specialPackage.routes.js";
import roomAvailabilityRoutes from "./routes/HotelOwner/roomAvailability.routes.js";
import userRoutes from "./routes/HotelOwner/user.routes.js";
import vehicleRouter from "./routes/vehicleRentAdmin/vehicleRouter.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import governmentDashboardRoutes from "./routes/dashboard.js";
import errorHandler from "./middleware/HotelOwner/errorHandler.js";

config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// ============================================================================
// MIDDLEWARE
// ============================================================================

// CORS
app.use(cors());

// Body parsing
app.use(json());
app.use(urlencoded({ extended: true }));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ============================================================================
// DATABASE CONNECTION
// ============================================================================

connectDB();

// ============================================================================
// BASIC ROUTES
// ============================================================================

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Smart Virtual Tourist Guide API",
    version: "1.0.0",
    endpoints: {
      health: "GET /api/health",
      auth: "POST /api/auth/register, POST /api/auth/login",

      // Government Dashboard
      governmentDashboard: "GET /api/dashboard/government",

      // Existing dashboard
      dashboard: "GET /api/dashboard",

      rooms:
        "GET /api/rooms, POST /api/rooms, PUT /api/rooms/:id, DELETE /api/rooms/:id",

      packages:
        "GET /api/packages, POST /api/packages, PUT /api/packages/:id, DELETE /api/packages/:id",

      roomAvailability:
        "GET /api/room-availability, POST /api/room-availability, PUT /api/room-availability/:id, DELETE /api/room-availability/:id",

      users:
        "GET /api/users, POST /api/users, PUT /api/users/:id, DELETE /api/users/:id",

      vehicle:
        "GET /api/vehicle, POST /api/vehicle, PUT /api/vehicle/:id, DELETE /api/vehicle/:id",
    },
  });
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get("/api/health", (req, res) => {
  res.json({
    status: "Server is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: "Connected",
  });
});

// ============================================================================
// API ROUTES
// ============================================================================

// -----------------------------------------------------------------------------
// Authentication
// -----------------------------------------------------------------------------

app.use("/api/auth", authRoutes);

// -----------------------------------------------------------------------------
// Government Dashboard
// -----------------------------------------------------------------------------
//
// IMPORTANT:
// This route is registered BEFORE the existing dashboard routes.
//
// dashboard.js contains:
// router.get("/government", ...)
//
// Therefore the final endpoint is:
//
// GET /api/dashboard/government
//
// -----------------------------------------------------------------------------

app.use("/api/dashboard", governmentDashboardRoutes);

// -----------------------------------------------------------------------------
// Existing Dashboard Routes
// -----------------------------------------------------------------------------
//
// These are kept unchanged for your existing dashboard functionality.
//
// -----------------------------------------------------------------------------

app.use("/api/dashboard", dashboardRoutes);

// -----------------------------------------------------------------------------
// Hotel Owner Routes
// -----------------------------------------------------------------------------

app.use("/api/rooms", roomRoutes);

app.use("/api/packages", specialPackageRoutes);

app.use("/api/room-availability", roomAvailabilityRoutes);

app.use("/api/users", userRoutes);

// -----------------------------------------------------------------------------
// Vehicle Rental Routes
// -----------------------------------------------------------------------------

app.use("/api/vehicle", vehicleRouter);

// ============================================================================
// 404 HANDLER
// ============================================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ============================================================================
// GLOBAL ERROR HANDLER
// ============================================================================

app.use(errorHandler);

export default app;