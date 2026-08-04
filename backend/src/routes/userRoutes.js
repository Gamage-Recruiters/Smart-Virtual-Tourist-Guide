const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// Protected route — userId comes from req.user._id (authenticated token), not from URL params
router.patch("/fcm-token", protect, userController.updateFCMToken);

module.exports = router;
