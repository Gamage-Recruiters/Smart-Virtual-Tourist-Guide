import User from "../src/models/User.js";
import Admin from "../src/models/Admin/Admin.js"; // Import the Admin model

import { getRegionFromCoords } from "../src/utils/locationHelper.js";
import { manageRegionalRooms } from "../src/services/delivery/socketService.js";
import { manageRegionalTopics } from "../src/services/delivery/fcmService.js";
import calculateDistance from "../src/utils/geoUtils.js";
import AppError from "../src/errors/appError.js";
import logger from "../src/utils/logger.js";
import { RECIPIENT_ROLES } from "../src/constants/notificationConstants.js";

export default (io) => {
  io.on("connection", async (socket) => {
    // Get user details attached by the Socket Auth Middleware
    const userId = socket.userId;
    const role = socket.userRole;

    logger.info(
      `🔒 Secure Socket Connected: User=${userId}, Role=${role}, SocketID=${socket.id}`,
    );

    // Join the basic private room and role-specific room
    socket.join(`user_${userId}`);
    socket.join(`role_${role}`);

    // Helper function to handle and emit socket errors to the frontend
    const handleSocketError = (err, eventName) => {
      const statusCode = err.statusCode || 500;
      const message = err.message || "Internal Socket Error";

      logger.error(`❌ [Socket ${eventName}] User=${userId}: ${message}`);

      socket.emit("error", {
        status: err.status || "error",
        statusCode,
        message,
        event: eventName,
      });
    };

    // --- INITIAL SYNC ---
    // Runs once when the user or admin connects
    try {
      // 1. Try to find a standard User
      let account = await User.findById(userId).select("currentLocation fcmToken");

      // 2. If it's not a User, try to find an Admin
      if (!account) {
        account = await Admin.findById(userId).select("currentLocation fcmToken");
      }

      // 3. If nobody is found, throw an error
      if (!account) {
        throw new AppError("User or Admin not found during initial sync", 404);
      }

      // Save FCM token in socket session
      socket.fcmToken = account.fcmToken;

      // Variable to hold region data (null by default for Admins without GPS)
      let regionData = null; 

      // 4. Check if the user has a live GPS location
      if (account.currentLocation?.coordinates) {
        const [lng, lat] = account.currentLocation.coordinates;
        console.log("📍 Live Location Updated (Backend) :", lat, lng);
        
        regionData = await getRegionFromCoords(lat, lng);
        console.log("📍 Live Location Updated  (Backend - Region) :", regionData);

        if (regionData && typeof regionData === "object") {
          // Join socket rooms based on location
          manageRegionalRooms(socket, regionData, role, "join");

          // Save current location details in socket
          socket.currentDivision = regionData.division;
          socket.currentDistrict = regionData.district;

          logger.info(`Initial Sync Success: User=${userId}, Region=${regionData.division}`);
        }
      }

      // ✨ THE FIX: Subscribe to FCM Topics (Outside the location check)
      // This ensures Admins get role-based Push Notifications even without a GPS location
      if (socket.fcmToken) {
        await manageRegionalTopics(
          socket.fcmToken,
          regionData || { division: null, district: null }, // Send empty region if no GPS
          role,
          "subscribe",
        );
        console.log(`✅ FCM Topics Subscribed for Role: ${role}`);
      }

      // Print active rooms in the terminal for debugging
      setTimeout(() => {
        const activeRooms = Array.from(socket.rooms);
        console.log("-----------------------------------------");
        console.log(` User ${userId} is now in these Rooms:`);
        console.table(activeRooms);
        console.log("-----------------------------------------");
      }, 1000);

    } catch (err) {
      handleSocketError(err, "initial_sync");
    }

    // --- MANUAL REGION UPDATE (For Desktop Users) ---
    socket.on("update_manual_region", async (data) => {
      try {
        const { division, district } = data;

        if (!division || !district) {
          throw new AppError("Division and District are required for manual update", 400);
        }

        // Change region only if it's different
        if (division !== socket.currentDivision) {
          // 1. Leave old socket rooms and FCM topics
          if (socket.currentDivision && socket.currentDistrict) {
            const oldRegion = { division: socket.currentDivision, district: socket.currentDistrict };
            manageRegionalRooms(socket, oldRegion, role, "leave");

            if (socket.fcmToken) {
              await manageRegionalTopics(socket.fcmToken, oldRegion, role, "unsubscribe");
            }
          }

          // 2. Join new socket rooms and FCM topics
          const newRegionData = { division, district };
          manageRegionalRooms(socket, newRegionData, role, "join");

          if (socket.fcmToken) {
            await manageRegionalTopics(socket.fcmToken, newRegionData, role, "subscribe");
          }

          logger.info(` Manual Region Set: User=${userId}, Region=${division}`);

          // 3. Update socket session
          socket.currentDivision = division;
          socket.currentDistrict = district;

          // 4. Debug rooms
          setTimeout(() => {
            const activeRooms = Array.from(socket.rooms);
            console.log("-----------------------------------------");
            console.log(` User ${userId} Manually Joined these Rooms:`);
            console.table(activeRooms);
            console.log("-----------------------------------------");
          }, 500);
        }
      } catch (error) {
        handleSocketError(error, "update_manual_region");
      }
    });

    // --- LOCATION UPDATE ---
    // Listens to live GPS updates from mobile apps
    socket.on("update_location", async (data) => {
      try {
        // Prevent overlapping updates
        if (socket.isUpdatingLocation) return;
        socket.isUpdatingLocation = true;

        const { lat, lng } = data;

        if (lat === undefined || lng === undefined) {
          throw new AppError("Latitude and Longitude are required", 400);
        }

        // PERFORMANCE OPTIMIZATION: Skip checking region if moved less than 100 meters
        if (socket.lastLat && socket.lastLng) {
          const distance = calculateDistance(socket.lastLat, socket.lastLng, lat, lng);
          if (distance < 100) {
            return await updateDBLocation(userId, lat, lng, role);
          }
        }

        socket.lastLat = lat;
        socket.lastLng = lng;

        // Check for new region
        const regionData = await getRegionFromCoords(lat, lng);

        if (
          regionData &&
          typeof regionData === "object" &&
          regionData.division !== socket.currentDivision
        ) {
          const oldRegion = { division: socket.currentDivision, district: socket.currentDistrict };

          // 1. Leave old rooms & topics
          manageRegionalRooms(socket, oldRegion, role, "leave");
          if (socket.fcmToken) {
            await manageRegionalTopics(socket.fcmToken, oldRegion, role, "unsubscribe");
          }

          // 2. Join new rooms & topics
          manageRegionalRooms(socket, regionData, role, "join");
          if (socket.fcmToken) {
            await manageRegionalTopics(socket.fcmToken, regionData, role, "subscribe");
          }

          logger.info(`Region Switch: User=${userId}, From=${socket.currentDivision}, To=${regionData.division}`);

          socket.currentDivision = regionData.division;
          socket.currentDistrict = regionData.district;
        }

        // Update coordinates in Database
        await updateDBLocation(userId, lat, lng, role);
      } catch (error) {
        handleSocketError(error, "update_location");
      } finally {
        socket.isUpdatingLocation = false;
      }
    });

    socket.on("disconnect", () => {
      logger.info(` Socket Disconnected: User=${userId}`);
    });
  });
};

/**
 * Helper function to update live location in MongoDB.
 */
const updateDBLocation = async (userId, lat, lng, role) => {
  try {
    const updateData = {
      currentLocation: { type: "Point", coordinates: [lng, lat] },
      ...(role === RECIPIENT_ROLES.DRIVER && { showCurrentLocation: true }),
    };

    // Try User first, then Admin
    let updatedAccount = await User.findByIdAndUpdate(userId, updateData);

    if (!updatedAccount) {
      updatedAccount = await Admin.findByIdAndUpdate(userId, updateData);
    }

    if (!updatedAccount) {
      logger.error(` DB Update Failed: Could not find User or Admin with ID=${userId}`);
    }
  } catch (err) {
    logger.error(` DB Update Failed for User/Admin=${userId}: ${err.message}`);
  }
};