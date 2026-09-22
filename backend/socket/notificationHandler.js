import User from "../src/models/User.js";
import Admin from "../src/models/Admin/Admin.js";

import { getRegionFromCoords } from "../src/utils/locationHelper.js";
import { manageRegionalRooms } from "../src/services/delivery/socketService.js";
import { manageRegionalTopics } from "../src/services/delivery/fcmService.js";
import calculateDistance from "../src/utils/geoUtils.js";
import AppError from "../src/errors/appError.js";
import logger from "../src/utils/logger.js";
import { RECIPIENT_ROLES } from "../src/constants/notificationConstants.js";

/**
 * Socket.IO connection handler for the Notification Engine.
 *
 * Registers all real-time event listeners for a single authenticated socket connection.
 * Authentication and user identity are expected to have been attached to the socket
 * object by the upstream socket authentication middleware before this handler runs.
 *
 * Handles:
 * - `initial_sync`        — Syncs existing location/FCM state from DB on connect.
 * - `update_location`     — Processes live GPS updates from mobile clients.
 * - `update_manual_region`— Processes manual city selection from desktop clients.
 * - `disconnect`          — Logs clean disconnections.
 *
 * @param {import("socket.io").Server} io - The Socket.IO server instance.
 */
export default (io) => {
  io.on("connection", async (socket) => {
    // User identity is set by the auth middleware; do not trust client-supplied values.
    const userId = socket.userId;
    const role = socket.userRole;

    logger.info(
      `Secure Socket Connected: UserID=[REDACTED], Role=${role}, SocketID=${socket.id}`,
    );

    // Private room for unicast messages targeted to this specific user.
    socket.join(`user_${userId}`);
    // Role room for broadcast messages targeted to all users of a given role.
    socket.join(`role_${role}`);

    /**
     * Emits a structured error event back to the client for a given socket event.
     * Logs the error server-side without exposing sensitive context to the client.
     *
     * @param {Error|AppError} err       - The error object.
     * @param {string}         eventName - The socket event that triggered the error.
     */
    const handleSocketError = (err, eventName) => {
      const statusCode = err.statusCode || 500;
      const message = err.message || "Internal Socket Error";

      logger.error(`[Socket:${eventName}] Role=${role}: ${message}`);

      socket.emit("error", {
        status: err.status || "error",
        statusCode,
        message,
        event: eventName,
      });
    };

    // --- INITIAL SYNC ---
    // Runs once when a user or admin connects. Restores their last known location
    // to regional socket rooms and FCM topics so they immediately receive the correct
    // notifications without having to update their location first.
    try {
      // Check User collection first; fall back to Admin for admin accounts.
      let account = await User.findById(userId).select("currentLocation fcmToken");

      if (!account) {
        account = await Admin.findById(userId).select("currentLocation fcmToken");
      }

      if (!account) {
        throw new AppError("User or Admin not found during initial sync", 404);
      }

      // Cache the FCM token on the socket for efficient access during location updates.
      socket.fcmToken = account.fcmToken;

      // Region data is null by default — admins without GPS will still receive
      // role-based push notifications via role-scoped FCM topics below.
      let regionData = null;

      if (account.currentLocation?.coordinates) {
        const [lng, lat] = account.currentLocation.coordinates;
        regionData = await getRegionFromCoords(lat, lng);

        if (regionData && typeof regionData === "object") {
          // Join the geographic socket rooms that correspond to the user's last known location.
          manageRegionalRooms(socket, regionData, role, "join");

          // Cache the current region on the socket to enable efficient diff-checking
          // during subsequent location updates (avoids redundant room leave/join cycles).
          socket.currentDivision = regionData.division;
          socket.currentDistrict = regionData.district;

          logger.info(`Initial Sync Success: Role=${role}, Region=${regionData.division}`);
        }
      }

      // Subscribe to FCM topics unconditionally so that users without GPS (e.g., admins)
      // still receive role-based push notifications when the app is in the background.
      if (socket.fcmToken) {
        await manageRegionalTopics(
          socket.fcmToken,
          regionData || { division: null, district: null },
          role,
          "subscribe",
        );
        logger.info(`FCM Topics Subscribed: Role=${role}`);
      }

    } catch (err) {
      handleSocketError(err, "initial_sync");
    }

    // --- MANUAL REGION UPDATE (Desktop Users) ---
    // Desktop users cannot use GPS; they select their city via the LocationSelector modal.
    // This event applies the same room/topic management as a live GPS update, but using
    // the division and district from the user's manual selection.
    socket.on("update_manual_region", async (data) => {
      try {
        const { division, district } = data;

        if (!division || !district) {
          throw new AppError("Division and District are required for manual update", 400);
        }

        // Skip the full leave/join cycle if the user selected the same region as before.
        if (division !== socket.currentDivision) {
          // 1. Leave previous rooms and unsubscribe from previous FCM topics.
          if (socket.currentDivision && socket.currentDistrict) {
            const oldRegion = { division: socket.currentDivision, district: socket.currentDistrict };
            manageRegionalRooms(socket, oldRegion, role, "leave");

            if (socket.fcmToken) {
              await manageRegionalTopics(socket.fcmToken, oldRegion, role, "unsubscribe");
            }
          }

          // 2. Join new rooms and subscribe to new FCM topics.
          const newRegionData = { division, district };
          manageRegionalRooms(socket, newRegionData, role, "join");

          if (socket.fcmToken) {
            await manageRegionalTopics(socket.fcmToken, newRegionData, role, "subscribe");
          }

          logger.info(`Manual Region Set: Role=${role}, Region=${division}`);

          // 3. Update the cached region on the socket for future diff-checks.
          socket.currentDivision = division;
          socket.currentDistrict = district;
        }
      } catch (error) {
        handleSocketError(error, "update_manual_region");
      }
    });

    // --- LIVE LOCATION UPDATE (Mobile Clients) ---
    // Receives GPS coordinates emitted by mobile clients at a minimum 50m movement threshold
    // (enforced client-side). Applies an additional 100m server-side filter to avoid
    // triggering expensive region lookups for minor GPS drift.
    socket.on("update_location", async (data) => {
      try {
        // Mutex flag: prevents concurrent overlapping updates if events arrive rapidly.
        if (socket.isUpdatingLocation) return;
        socket.isUpdatingLocation = true;

        const { lat, lng } = data;

        if (lat === undefined || lng === undefined) {
          throw new AppError("Latitude and Longitude are required", 400);
        }

        // Skip region lookup if the user has moved less than 100 metres from their
        // last processed position. Still updates the DB to keep the stored location fresh.
        if (socket.lastLat && socket.lastLng) {
          const distance = calculateDistance(socket.lastLat, socket.lastLng, lat, lng);
          if (distance < 100) {
            return await updateDBLocation(userId, lat, lng, role);
          }
        }

        socket.lastLat = lat;
        socket.lastLng = lng;

        const regionData = await getRegionFromCoords(lat, lng);

        // Only trigger room/topic transitions when the user crosses into a new division.
        if (
          regionData &&
          typeof regionData === "object" &&
          regionData.division !== socket.currentDivision
        ) {
          const oldRegion = { division: socket.currentDivision, district: socket.currentDistrict };

          // Leave old regional rooms and FCM topics before joining new ones.
          manageRegionalRooms(socket, oldRegion, role, "leave");
          if (socket.fcmToken) {
            await manageRegionalTopics(socket.fcmToken, oldRegion, role, "unsubscribe");
          }

          manageRegionalRooms(socket, regionData, role, "join");
          if (socket.fcmToken) {
            await manageRegionalTopics(socket.fcmToken, regionData, role, "subscribe");
          }

          logger.info(`Region Switch: Role=${role}, From=${socket.currentDivision}, To=${regionData.division}`);

          socket.currentDivision = regionData.division;
          socket.currentDistrict = regionData.district;
        }

        // Persist the updated coordinates to MongoDB for server-side rehydration on reconnect.
        await updateDBLocation(userId, lat, lng, role);
      } catch (error) {
        handleSocketError(error, "update_location");
      } finally {
        // Always release the mutex, even if an error occurred.
        socket.isUpdatingLocation = false;
      }
    });

    socket.on("disconnect", () => {
      logger.info(`Socket Disconnected: Role=${role}`);
    });
  });
};

/**
 * Persists the user's current GPS coordinates to MongoDB.
 * Attempts the User collection first, then falls back to Admin.
 * For driver users, also sets `showCurrentLocation: true` to make
 * their live location visible to tourists on the map.
 *
 * @async
 * @param {string} userId - The authenticated user's MongoDB ObjectId string.
 * @param {number} lat    - Latitude to store.
 * @param {number} lng    - Longitude to store.
 * @param {string} role   - The user's role, used to conditionally set driver-specific fields.
 * @returns {Promise<void>}
 */
const updateDBLocation = async (userId, lat, lng, role) => {
  try {
    const updateData = {
      // GeoJSON Point format: coordinates are [longitude, latitude] per the GeoJSON spec.
      currentLocation: { type: "Point", coordinates: [lng, lat] },
      ...(role === RECIPIENT_ROLES.DRIVER && { showCurrentLocation: true }),
    };

    let updatedAccount = await User.findByIdAndUpdate(userId, updateData);

    if (!updatedAccount) {
      updatedAccount = await Admin.findByIdAndUpdate(userId, updateData);
    }

    if (!updatedAccount) {
      logger.error(`DB Location Update Failed: Account not found for Role=${role}`);
    }
  } catch (err) {
    logger.error(`DB Location Update Error: Role=${role}: ${err.message}`);
  }
};