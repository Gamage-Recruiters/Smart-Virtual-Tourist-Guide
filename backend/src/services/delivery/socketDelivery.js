const logger = require("../../utils/logger");

/**
 * Socket Delivery Service
 * 
 * Description:
 * This function is responsible for sending real-time messages to users who are currently online (App is open).
 * It calculates the correct Socket.io "Room" based on the notification's scope and target details.
 */
exports.deliverViaSocket = (io, notification) => {
  // Extract all the necessary routing details from the notification document
  const { _id, scope, recipientId, recipientRole, region, district } =
    notification;
    
  let targetRoom = null;

  switch (scope) {
    // --- 1. PERSONAL MESSAGES ---
    case "UNICAST":
      // Target the private room unique to the specific user
      targetRoom = `user_${recipientId}`;
      break;

    // --- 2. GROUP MESSAGES ---
    case "MULTICAST":
      // Determine the correct room based on location and role.
      // The logic checks from the most specific area to the broadest area.

      // A. If sending to EVERYONE in a specific Division
      if (region && (!recipientRole || recipientRole === "ALL")) {
        targetRoom = `region_${region}`;
      } 
      // B. If sending to EVERYONE in a specific District
      else if (district && (!recipientRole || recipientRole === "ALL")) {
        targetRoom = `district_${district}`;
      } 
      // C. If sending to a specific Role in a Division (e.g., Drivers in Balangoda)
      else if (recipientRole && region) {
        targetRoom =  `region_${region}_role_${recipientRole}`;
      } 
      // D. If sending to a specific Role in a District (e.g., Tourists in Ratnapura)
      else if (recipientRole && district) {
        targetRoom = `district_${district}_role_${recipientRole}`;  
      } 
      // E. If sending to a Role across the whole country (e.g., All System Admins)
      else if (recipientRole) {
        targetRoom = `role_${recipientRole}`;
      }
      break;

    // --- 3. PUBLIC MESSAGES ---
    case "BROADCAST":
      logger.info(
        ` [Socket] Broadcasting notification ${_id} to ALL connected users.`,
      );
      // io.emit sends the message to everyone connected to the server. No rooms needed.
      return io.emit("new_notification", notification);
  }

  // Finally, send the message to the determined target room
  if (targetRoom) {
    logger.info(
      ` [Socket] Emitting notification ${_id} to Room: ${targetRoom}`,
    );
    io.to(targetRoom).emit("new_notification", notification);
  } else {
    // If no room matched the conditions, log a warning instead of crashing
    logger.warn(
      ` [Socket] Target room NOT FOUND for notification: ${_id}. Check logic!`,
    );
  }
};