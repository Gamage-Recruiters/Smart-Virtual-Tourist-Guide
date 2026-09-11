import express from "express";
const router = express.Router();
import { registerTourist, getProfile, updateProfile, createProfile } from "../../controllers/TouristDashboard/touristController.js";

router.post("/", createProfile);
router.post("/register", registerTourist);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/profile", updateProfile);

export default router;
