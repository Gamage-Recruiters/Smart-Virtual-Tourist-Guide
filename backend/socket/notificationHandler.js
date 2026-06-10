const User = require("../src/models/User.js"); // පරණ models දෙක වෙනුවට මේක විතරක් ගන්න
const { getRegionFromCoords } = require("../src/utils/locationHelper.js");
const mongoose = require("mongoose");
const AppError = require("../src/errors/appError.js");

module.exports = (io) => {
  io.on("connection", (socket) => {
    const handleSocketError = (err) => {
      console.error(`❌ Socket Error [${socket.id}]:`, err.message);
      socket.emit("error", {
        status: err.status || "error",
        message: err.message || "Something went wrong on the server",
      });
    };

    const { userId, role, initialRegion } = socket.handshake.query;

    if (!userId || !role) {
      return handleSocketError(
        new AppError(
          "Authentication failed: userId and role are required",
          401,
        ),
      );
    }

    console.log(`🔔 New Connection! UserID: ${userId}, Role: ${role}`);

    try {
      // 1. Unicast Room (Individual)
      socket.join(`user_${userId}`);

      // 2. Multicast Room (By Role)
      socket.join(`role_${role}`);

      // 3. Regional & Combined Rooms
      if (initialRegion) {
        socket.join(`region_${initialRegion}`);
        const combinedRoom = `region_${initialRegion}_role_${role}`;
        socket.join(combinedRoom);
        socket.currentRegion = initialRegion;
      }

      socket.userId = userId;
      socket.userRole = role;
    } catch (err) {
      handleSocketError(err);
    }

    // --- Update Location Event ---
    socket.on("update_location", async (data) => {
      try {
        const { lat, lng } = data;

        if (lat === undefined || lng === undefined) {
          throw new AppError(
            "Invalid data: Latitude and Longitude are required",
            400,
          );
        }

        const newRegion = await getRegionFromCoords(lat, lng);

        if (newRegion && newRegion !== socket.currentRegion) {
          if (socket.currentRegion) {
            socket.leave(`region_${socket.currentRegion}`);
            socket.leave(
              `region_${socket.currentRegion}_role_${socket.userRole}`,
            );
          }

          socket.join(`region_${newRegion}`);
          const newCombinedRoom = `region_${newRegion}_role_${socket.userRole}`;
          socket.join(newCombinedRoom);

          socket.currentRegion = newRegion;
          console.log(
            `🔄 User ${socket.userId} (${socket.userRole}) switched to: ${newCombinedRoom}`,
          );
        }

        const updatedUser = await User.findOneAndUpdate(
          { _id: socket.userId.trim() },
          {
            currentLocation: { type: "Point", coordinates: [lng, lat] },
            ...(socket.userRole === "DRIVER" && { showCurrentLocation: true }),
          },
          { returnDocument: "after", runValidators: true },
        );

        if (!updatedUser) {
          throw new AppError("User not found in database", 404);
        }

        console.log(
          `✅ DB Updated for ${socket.userRole}: ${updatedUser.fullName}`,
        );
      } catch (error) {
        handleSocketError(error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected`);
    });
  });
};
