const logger = require("../../utils/logger");

/**
 * Socket Service - Room Management
 * 
 * Description:
 * This function adds (joins) or removes (leaves) a user from specific Socket.io rooms.
 * These rooms are based on the user's current physical location and their role.
 * It manages 4 types of rooms simultaneously to support our hybrid geo-fencing system.
 */
exports.manageRegionalRooms = (socket, regionData, role, action = "join") => {
  // 1. Safety Check: Ensure all required location data is available before proceeding
  // This prevents the server from crashing if location data is incomplete
  if (!regionData || !regionData.division || !regionData.district) {
    logger.warn(
      `Socket ${action} skipped: Incomplete region data provided.`,
    );
    return;
  }

  const { division, district } = regionData;

  // 2. Define the list of dynamic rooms the user should interact with
  const rooms = [
    `region_${division}`,                   // Broad room: All users in this division
    `district_${district}`,                 // Broad room: All users in this district
    `region_${division}_role_${role}`,      // Targeted room: Specific role in this division
    `district_${district}_role_${role}`,    // Targeted room: Specific role in this district
  ];

  // 3. Loop through the rooms and execute the requested action (either 'join' or 'leave')
  rooms.forEach((room) => {
    if (action === "join") {
      socket.join(room);
    } else {
      socket.leave(room);
    }
  });

  // 4. Log the successful operation for server monitoring
  logger.info(
    `Socket Rooms ${action}ed: Division=${division}, District=${district} for User=${socket.userId}`,
  );
};