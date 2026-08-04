import User from "../src/models/User.js";
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

    /**
     * Helper function to handle and emit socket errors to the frontend.
     * Prevents the server from crashing when an error occurs inside the socket.
     */
    const handleSocketError = (err, eventName) => {
      const statusCode = err.statusCode || 500;
      const message = err.message || "Internal Socket Error";

      logger.error(`❌ [Socket ${eventName}] User=${userId}: ${message}`);

      // Send the error back to the client
      socket.emit("error", {
        status: err.status || "error",
        statusCode,
        message,
        event: eventName,
      });
    };

    // --- INITIAL SYNC ---
    // When the user connects, load their last known location and add them to regional rooms
    try {
      const user = await User.findById(userId).select(
        "currentLocation fcmToken",
      );

      if (!user) throw new AppError("User not found during initial sync", 404);

      // Attach FCM token to the socket session for later use
      socket.fcmToken = user.fcmToken;

      if (user.currentLocation?.coordinates) {
        // MongoDB uses [longitude, latitude] format
        const [lng, lat] = user.currentLocation.coordinates;
        const regionData = await getRegionFromCoords(lat, lng);

        if (regionData && typeof regionData === "object") {
          // Add user to the relevant Socket rooms
          manageRegionalRooms(socket, regionData, role, "join");

          // Subscribe user to the relevant Firebase (FCM) topics
          if (socket.fcmToken) {
            await manageRegionalTopics(
              socket.fcmToken,
              regionData,
              role,
              "subscribe",
            );
          }

          // Save current location details in the socket session to track future movements
          socket.currentDivision = regionData.division;
          socket.currentDistrict = regionData.district;

          logger.info(
            `Initial Sync Success: User=${userId}, Region=${regionData.division}`,
          );

          // For debugging purposes: Print the rooms the user is currently in
          setTimeout(() => {
            const activeRooms = Array.from(socket.rooms);
            console.log("-----------------------------------------");
            console.log(` User ${userId} is now in these Rooms:`);
            console.table(activeRooms);
            console.log("-----------------------------------------");
          }, 1000);
        }
      }
    } catch (err) {
      handleSocketError(err, "initial_sync");
    }

    // --- LOCATION UPDATE ---
    // Listens to live GPS updates from the client app
    socket.on("update_location", async (data) => {
      try {
        // This lock keeps two location updates from running at the same time.
        if (socket.isUpdatingLocation) {
          logger.debug(`Location update already running for user ${userId}`);
          return;
        }

        // This lock stops overlapping room changes and duplicate joins.
        socket.isUpdatingLocation = true;

        const { lat, lng } = data;

        if (lat === undefined || lng === undefined) {
          throw new AppError("Latitude and Longitude are required", 400);
        }

        // PERFORMANCE OPTIMIZATION (Throttling)
        // If the user moved less than 100 meters, skip the expensive region check
        if (socket.lastLat && socket.lastLng) {
          const distance = calculateDistance(
            socket.lastLat,
            socket.lastLng,
            lat,
            lng,
          );
          if (distance < 100) {
            return await updateDBLocation(userId, lat, lng, role);
          }
        }

        // Update last known coordinates in the socket session
        socket.lastLat = lat;
        socket.lastLng = lng;

        // Check if the user entered a new region
        const regionData = await getRegionFromCoords(lat, lng);

        if (
          regionData &&
          typeof regionData === "object" &&
          regionData.division !== socket.currentDivision
        ) {
          // 1. Leave the old socket rooms and unsubscribe from old FCM topics
          manageRegionalRooms(
            socket,
            {
              division: socket.currentDivision,
              district: socket.currentDistrict,
            },
            role,
            "leave",
          );

          if (socket.fcmToken) {
            await manageRegionalTopics(
              socket.fcmToken,
              {
                division: socket.currentDivision,
                district: socket.currentDistrict,
              },
              role,
              "unsubscribe",
            );
          }

          // 2. Join the new socket rooms and subscribe to new FCM topics
          manageRegionalRooms(socket, regionData, role, "join");

          if (socket.fcmToken) {
            await manageRegionalTopics(
              socket.fcmToken,
              regionData,
              role,
              "subscribe",
            );
          }

          logger.info(
            `🔄 Region Switch: User=${userId}, From=${socket.currentDivision}, To=${regionData.division}`,
          );

          // Update the current region in the socket session
          socket.currentDivision = regionData.division;
          socket.currentDistrict = regionData.district;
        }

        // Always update the exact GPS location in the Database
        await updateDBLocation(userId, lat, lng, role);
      } catch (error) {
        handleSocketError(error, "update_location");
      } finally {
        // This releases the lock when the update is done.
        socket.isUpdatingLocation = false;
      }
    });

    socket.on("disconnect", () => {
      logger.info(`👋 Socket Disconnected: User=${userId}`);
    });
  });
};

/**
 * Helper function to update the user's live location in MongoDB.
 * If the user is a DRIVER, it also sets 'showCurrentLocation' to true.
 */
const updateDBLocation = async (userId, lat, lng, role) => {
  try {
    await User.findByIdAndUpdate(userId, {
      currentLocation: { type: "Point", coordinates: [lng, lat] }, // [longitude, latitude]
      ...(role === RECIPIENT_ROLES.DRIVER && { showCurrentLocation: true }),
    });
  } catch (err) {
    logger.error(` DB Update Failed for User=${userId}: ${err.message}`);
  }
};