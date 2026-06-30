const logger = require("../../utils/logger");

/**
 * Socket Delivery Service
 * 
 * Sends real-time messages to users who are currently online (App is open).
 * Calculates the correct Socket.io "Room" based on the notification's scope and target details.
 */
exports.deliverViaSocket = (io, notification) => {
  const { _id, scope, recipientId, recipientRole, region, district } =
    notification;
    
  let targetRoom = null;

  switch (scope) {
    // --- 1. PERSONAL MESSAGES ---
    case "UNICAST":
      targetRoom = `user_${recipientId}`;
      break;

    // --- 2. GROUP MESSAGES ---
    case "MULTICAST":
      if (region && (!recipientRole || recipientRole === "ALL")) {
        targetRoom = `region_${region}`;
      } 
      else if (district && (!recipientRole || recipientRole === "ALL")) {
        targetRoom = `district_${district}`;
      } 
      else if (recipientRole && region) {
        targetRoom = `region_${region}_role_${recipientRole}`;
      } 
      else if (recipientRole && district) {
        targetRoom = `district_${district}_role_${recipientRole}`;  
      } 
      else if (recipientRole) {
        targetRoom = `role_${recipientRole}`;
      }
      break;

    // --- 3. PUBLIC MESSAGES ---
    case "BROADCAST":
      logger.info(
        `[Socket] Broadcasting notification ${_id} to ALL connected users.`,
      );
      return io.emit("new_notification", notification);
  }

  if (targetRoom) {
    logger.info(
      `[Socket] Emitting notification ${_id} to Room: ${targetRoom}`,
    );
    io.to(targetRoom).emit("new_notification", notification);
  } else {
    logger.warn(
      `[Socket] Target room NOT FOUND for notification: ${_id}. Check logic!`,
    );
  }
};
