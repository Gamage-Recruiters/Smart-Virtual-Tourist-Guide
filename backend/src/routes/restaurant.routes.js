const express = require("express");
const restaurantController = require("../controllers/restaurant.controller");

const router = express.Router();

router.post("/", restaurantController.createRestaurantProfile);
router.get("/", restaurantController.getAllRestaurants);
router.get("/:id", restaurantController.getRestaurantProfileById);
router.put("/:id", restaurantController.updateRestaurantProfile);
router.delete("/:id", restaurantController.deleteRestaurantProfile);
router.put("/:id/banner", restaurantController.updateBannerImage);
router.put("/:id/hours", restaurantController.updateOperatingHours);

module.exports = router;
