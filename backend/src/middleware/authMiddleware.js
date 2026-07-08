const User = require("../models/User");

/**
 * authMiddleware
 * ──────────────
 * Validates the Bearer session token issued at registration.
 * On success, attaches `req.user` (safe public fields + id string).
 * On failure, returns 401.
 */
async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (!token || scheme.toLowerCase() !== "bearer") {
      return res.status(401).json({ message: "No token provided. Please log in." });
    }

    const user = await User.findOne({ sessionToken: token }).lean();

    if (!user) {
      return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
    }

    // Attach safe user object (no password / sessionToken exposed)
    req.user = {
      id: String(user._id),
      fullName: user.fullName,
      email: user.email,
    };

    next();
  } catch (err) {
    console.error("[authMiddleware] Error:", err);
    return res.status(500).json({ message: "Authentication check failed." });
  }
}

module.exports = authMiddleware;
