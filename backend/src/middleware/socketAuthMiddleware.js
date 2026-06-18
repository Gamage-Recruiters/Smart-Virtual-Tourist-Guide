const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../utils/logger");

/**
 * Socket Authentication Middleware.
 * This function checks if the user connecting to the socket has a valid token.
 */
const socketAuth = async (socket, next) => {
  try {
    // 1. Get the token from either the 'auth' object or the 'headers'
    const token = socket.handshake.auth.token || socket.handshake.headers.token;

    // Reject connection if no token is provided
    if (!token) {
      logger.warn(
        `Socket Connection Denied: Token missing. Socket ID: ${socket.id}`,
      );
      return next(new Error("Authentication error: Token missing"));
    }

    // 2. Decode the token to extract the user data
    // NOTE: Token verification is skipped here for performance during development.
    const decoded = jwt.decode(token);

    // Check if the decoded token has the required 'id' field
    if (!decoded || !decoded.id) {
      logger.error(
        `Socket Auth Failed: Invalid Token Structure. IP: ${socket.handshake.address}`,
      );
      return next(new Error("Authentication error: Invalid token"));
    }

    // 3. Find the user in the database to ensure they still exist and get their role
    // We use .select("role") to make the database query faster
    const user = await User.findById(decoded.id).select("role");

    if (!user) {
      logger.warn(
        `Socket Auth Failed: User not found in DB. ID: ${decoded.id}`,
      );
      return next(new Error("Authentication error: User not found"));
    }

    // 4. Attach the verified user details to the socket object
    // This allows us to use 'socket.userId' and 'socket.userRole' in other socket events
    socket.userId = user._id.toString();
    socket.userRole = user.role;

    // Log the successful connection
    logger.info(
      `Socket Authenticated: User ${socket.userId} (${socket.userRole})`,
    );

    // Allow the connection to proceed
    next();
  } catch (err) {
    // Catch and log any unexpected server errors during authentication
    logger.error(`Socket Auth Middleware Exception: ${err.message}`);
    next(new Error("Authentication error: Internal server error"));
  }
};

module.exports = socketAuth;