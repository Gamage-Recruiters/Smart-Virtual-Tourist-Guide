import express from "express";
import { updateFCMToken } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected route — userId comes from req.user._id (authenticated token), not from URL params
router.patch("/fcm-token", protect, updateFCMToken);

export default router;