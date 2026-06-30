const express = require("express");
const restaurantController = require("../controllers/restaurant.controller");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// ── Public routes (tourists can browse) ─────────────────────────────────────
router.get("/", restaurantController.getAllRestaurants);
router.get("/:id", restaurantController.getRestaurantProfileById);

// ── Protected routes (restaurant_user only) ──────────────────────────────────
router.post(
  "/",
  protect,
  authorizeRoles("restaurant_user"),
  restaurantController.createRestaurantProfile
);
router.put(
  "/:id",
  protect,
  authorizeRoles("restaurant_user"),
  restaurantController.updateRestaurantProfile
);
router.delete(
  "/:id",
  protect,
  authorizeRoles("restaurant_user"),
  restaurantController.deleteRestaurantProfile
);
router.put(
  "/:id/banner",
  protect,
  authorizeRoles("restaurant_user"),
  restaurantController.updateBannerImage
);
router.put(
  "/:id/hours",
  protect,
  authorizeRoles("restaurant_user"),
  restaurantController.updateOperatingHours
);

module.exports = router;
