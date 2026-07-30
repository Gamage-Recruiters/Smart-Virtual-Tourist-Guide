const express = require("express");
const menuItemController = require("../controllers/menuItem.controller");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// ── Public routes (tourists can browse menus) ────────────────────────────────
router.get("/restaurant/:restaurantId", menuItemController.getMenuItemsByRestaurant);
router.get("/search", menuItemController.searchMenuItems);
router.get("/:id", menuItemController.getMenuItemById);

// ── Protected routes (restaurant_user only) ──────────────────────────────────
router.post(
  "/",
  protect,
  authorizeRoles("restaurant_user"),
  menuItemController.createMenuItem
);
router.put(
  "/:id",
  protect,
  authorizeRoles("restaurant_user"),
  menuItemController.updateMenuItem
);
router.delete(
  "/:id",
  protect,
  authorizeRoles("restaurant_user"),
  menuItemController.deleteMenuItem
);
router.patch(
  "/:id/availability",
  protect,
  authorizeRoles("restaurant_user"),
  menuItemController.toggleAvailability
);

module.exports = router;
