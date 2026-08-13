import express from 'express';
const router = express.Router();

import { addDriver,
  getAllDrivers,
  getDriverById,
  updateDriver, } from '../controllers/driverController.js';

router.post("/", addDriver);
router.get("/", getAllDrivers);
router.get("/:id", getDriverById);
router.put("/:id", updateDriver);

export default router;