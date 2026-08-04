import express from "express";
const router = express.Router();
import { register, login } from "../controllers/authController.js";
import { registerTourist, updateProfile } from "../controllers/touristController.js";

router.post("/register", register);
router.post("/register/tourist", registerTourist);
router.post("/login", login);
router.put("/update-travel-info", updateProfile);

export default router;
