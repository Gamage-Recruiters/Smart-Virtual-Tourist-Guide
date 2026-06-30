const logger = require("../src/utils/logger");

/**
 * Socket Notification Handler
 * 
 * Handles user room joining for BROADCAST/UNICAST notification delivery.
 * 
 * The full version (with geo-fencing, FCM topics, location tracking)
 * can be enabled later when needed.
 */
module.exports = (io) => {
  io.on("connection", async (socket) => {
    const userId = socket.userId;
    const role = socket.userRole;

    logger.info(
      `Socket Connected: User=${userId}, Role=${role}, SocketID=${socket.id}`,
    );

    // Join the user's private room (for UNICAST notifications)
    socket.join(`user_${userId}`);

    // Join the role-specific room (for MULTICAST by role)
    socket.join(`role_${role}`);

    logger.info(
      `User ${userId} joined rooms: user_${userId}, role_${role}`,
    );

    socket.on("disconnect", () => {
      logger.info(`Socket Disconnected: User=${userId}`);
    });
  });
};
