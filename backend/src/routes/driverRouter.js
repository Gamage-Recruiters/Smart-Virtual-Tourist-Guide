const express = require("express");
const router = express.Router();

const {
  addDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
} = require("../controllers/driverController");

router.post("/", addDriver);
router.get("/", getAllDrivers);
router.get("/:id", getDriverById);
router.put("/:id", updateDriver);

module.exports = router;