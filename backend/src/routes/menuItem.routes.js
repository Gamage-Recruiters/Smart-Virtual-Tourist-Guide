import express from "express";
import * as menuItemController from "../controllers/menuItem.controller.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

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

export default router;
