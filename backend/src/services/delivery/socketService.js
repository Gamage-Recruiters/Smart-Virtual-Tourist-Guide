const logger = require("../../utils/logger");

/**
 * Socket Service - Room Management
 * 
 * Adds (joins) or removes (leaves) a user from specific Socket.io rooms
 * based on their current physical location and role.
 */
exports.manageRegionalRooms = (socket, regionData, role, action = "join") => {
  if (!regionData || !regionData.division || !regionData.district) {
    logger.warn(
      `Socket ${action} skipped: Incomplete region data provided.`,
    );
    return;
  }

  const { division, district } = regionData;

  const rooms = [
    `region_${division}`,
    `district_${district}`,
    `region_${division}_role_${role}`,
    `district_${district}_role_${role}`,
  ];

  rooms.forEach((room) => {
    if (action === "join") {
      socket.join(room);
    } else {
      socket.leave(room);
    }
  });

  logger.info(
    `Socket Rooms ${action}ed: Division=${division}, District=${district} for User=${socket.userId}`,
  );
};
