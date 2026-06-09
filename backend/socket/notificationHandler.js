const Driver = require("../src/models/Driver.js");
const Tourist = require("../src/models/Tourist.js");
const { getRegionFromCoords } = require("../src/utils/locationHelper.js");
const mongoose = require("mongoose");
const AppError = require("../src/errors/appError.js"); 

module.exports = (io) => {
  io.on("connection", (socket) => {
    
    // --- Error Handling Helper for Socket ---
    const handleSocketError = (err) => {
      console.error(`❌ Socket Error [${socket.id}]:`, err.message);
      socket.emit("error", {
        status: err.status || "error",
        message: err.message || "Something went wrong on the server",
      });
    };

    const { userId, role, initialRegion } = socket.handshake.query;

    if (!userId || !role) {
       return handleSocketError(new AppError("Authentication failed: userId and role are required", 401));
    }

    console.log(`🔔 New Connection! UserID: ${userId}, Role: ${role}`);

    try {
      socket.join(`user_${userId}`);
      socket.join(`role_${role}`);

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

    // --- Update Location Event with Error Handling ---
    socket.on("update_location", async (data) => {
      try {
        const { lat, lng } = data;

        if (lat === undefined || lng === undefined) {
          throw new AppError("Invalid data: Latitude and Longitude are required", 400);
        }

        const newRegion = await getRegionFromCoords(lat, lng);

        if (newRegion && newRegion !== socket.currentRegion) {
          if (socket.currentRegion) {
            socket.leave(`region_${socket.currentRegion}`);
            socket.leave(`region_${socket.currentRegion}_role_${socket.userRole}`);
          }

          socket.join(`region_${newRegion}`);
          const newCombinedRoom = `region_${newRegion}_role_${socket.userRole}`;
          socket.join(newCombinedRoom);

          socket.currentRegion = newRegion;
          console.log(`🔄 Room switched to: ${newCombinedRoom}`);
        }

        // Database Updates
        if (socket.userRole === "DRIVER") {
          const updated = await Driver.findOneAndUpdate(
            { _id: socket.userId.trim() },
            { currentLocation: { type: "Point", coordinates: [lng, lat] }, showCurrentLocation: true },
            { new: true, runValidators: true }
          );
          if (!updated) throw new AppError("Driver not found in database", 404);
        } 
        else if (socket.userRole === "TOURIST") {
          const updated = await Tourist.findOneAndUpdate(
            { _id: socket.userId.trim() },
            { currentLocation: { type: "Point", coordinates: [lng, lat] } },
            { new: true, runValidators: true }
          );
          if (!updated) throw new AppError("Tourist not found in database", 404);
        }

      } catch (error) {
        handleSocketError(error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected`);
    });
  });
};