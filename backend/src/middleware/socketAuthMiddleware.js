import jwt from "jsonwebtoken";
import User from "../models/User.js";
import logger from "../utils/logger.js";

/**
 * Socket Authentication Middleware.
 * This function checks if the user connecting to the socket has a valid JWT token
 * signed with the application's JWT_SECRET.
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

    // 2. Verify the token using the real JWT_SECRET
    // Previously used jwt.decode() which skipped signature verification,
    // allowing any forged token to impersonate any user.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the decoded token has the required 'id' field
    if (!decoded || !decoded.id) {
      logger.error(
        `Socket Auth Failed: Invalid Token Structure. IP: ${socket.handshake.address}`,
      );
      return next(new Error("Authentication error: Invalid token"));
    }

    // 3. Find the user in the database to ensure they still exist and get their role
    // Exclude password for security, matching the REST API's authMiddleware behavior
    const user = await User.findById(decoded.id).select("-password");

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
    // Catch JWT verification failures (expired token, invalid signature, etc.)
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      logger.error(`Socket Auth Failed: ${err.message}`);
      return next(new Error("Authentication error: Invalid or expired token"));
    }

    // Catch and log any unexpected server errors during authentication
    logger.error(`Socket Auth Middleware Exception: ${err.message}`);
    next(new Error("Authentication error: Internal server error"));
  }
};

export default socketAuth;