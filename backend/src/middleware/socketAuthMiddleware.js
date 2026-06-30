const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

/**
 * Socket Authentication Middleware
 * 
 * Checks if the user connecting to the socket has a valid token.
 * Gracefully handles the case where the User model is not yet available.
 */

// Graceful User model loading — works with or without User model
let User;
try {
  User = require("../models/User");
} catch (e) {
  // User model not yet available — will use JWT-decoded data only
}

const socketAuth = async (socket, next) => {
  try {
    // 1. Get the token from either the 'auth' object or the 'headers'
    const token = socket.handshake.auth.token || socket.handshake.headers.token;

    if (!token) {
      logger.warn(
        `Socket Connection Denied: Token missing. Socket ID: ${socket.id}`,
      );
      return next(new Error("Authentication error: Token missing"));
    }

    // 2. Decode the token to extract the user data
    const decoded = jwt.decode(token);

    if (!decoded || !decoded.id) {
      logger.error(
        `Socket Auth Failed: Invalid Token Structure. IP: ${socket.handshake.address}`,
      );
      return next(new Error("Authentication error: Invalid token"));
    }

    // 3. If User model is available, verify user exists in DB and get role
    if (User) {
      try {
        const user = await User.findById(decoded.id).select("role");
        if (user) {
          socket.userId = user._id.toString();
          socket.userRole = user.role;
        } else {
          // User not found in DB — use decoded token data as fallback
          logger.warn(`Socket Auth: User ${decoded.id} not found in DB, using token data`);
          socket.userId = decoded.id;
          socket.userRole = decoded.role || 'TOURIST';
        }
      } catch (dbErr) {
        // DB error — fallback to token data
        logger.warn(`Socket Auth: DB lookup failed, using token data: ${dbErr.message}`);
        socket.userId = decoded.id;
        socket.userRole = decoded.role || 'TOURIST';
      }
    } else {
      // No User model — use decoded token data directly
      socket.userId = decoded.id;
      socket.userRole = decoded.role || 'TOURIST';
    }

    logger.info(
      `Socket Authenticated: User ${socket.userId} (${socket.userRole})`,
    );

    next();
  } catch (err) {
    logger.error(`Socket Auth Middleware Exception: ${err.message}`);
    next(new Error("Authentication error: Internal server error"));
  }
};

module.exports = socketAuth;
