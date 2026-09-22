import logger from "../../utils/logger.js"; // Import the logger utility to print messages to the console

export const deliverViaSocket = (io, notification) => {
  // Extract required fields from the notification object
  const { _id, scope, recipientId, recipientRole, region, district } = notification;

  // Initialize the variable to hold the target room name
  let targetRoom = null;

  // The scope is now strictly coming from the Database (UNICAST, MULTICAST, or BROADCAST)
  const currentScope = scope;

  // Check the scope to decide where to send the message
  switch (currentScope) {
    // --- 1. PERSONAL MESSAGES ---
    case "UNICAST":
      // Create a unique room name for a specific user using their userId
      targetRoom = `user_${recipientId}`;
      break;

    // --- 2. GROUP MESSAGES ---
    case "MULTICAST":
      // If there is a region and the role is 'ALL' or not provided
      if (region && (!recipientRole || recipientRole === "ALL")) {
        targetRoom = `region_${region}`; // Send to everyone in this region
      }
      // If there is a district and the role is 'ALL' or not provided
      else if (district && (!recipientRole || recipientRole === "ALL")) {
        targetRoom = `district_${district}`; // Send to everyone in this district
      }
      // If both role and region are provided
      else if (recipientRole && region) {
        targetRoom = `region_${region}_role_${recipientRole}`; // Send to a specific role in a region
      }
      // If both role and district are provided
      else if (recipientRole && district) {
        targetRoom = `district_${district}_role_${recipientRole}`; // Send to a specific role in a district
      }
      // If only the role is provided
      else if (recipientRole) {
        targetRoom = `role_${recipientRole}`; // Send to all users with this role anywhere
      }
      break;

    // --- 3. PUBLIC MESSAGES ---
    case "BROADCAST":
      // Log that we are sending a message to everyone
      logger.info(
        ` [Socket] Broadcasting notification ${_id} to ALL connected users.`,
      );
      // Send the message to all connected users and stop the function
      return io.emit("new_notification", notification);
  }

  // Finally, check if a target room was found
  if (targetRoom) {
    // Log the room name we are sending the message to
    logger.info(
      ` [Socket] Emitting notification ${_id} to Room: ${targetRoom}`,
    );
    // Send the message only to the users inside this specific room
    io.to(targetRoom).emit("new_notification", notification);
  } else {
    // If no room was found, show a warning in the console
    logger.warn(
      ` [Socket] Target room NOT FOUND for notification: ${_id}. Check logic!`,
    );
  }
};
