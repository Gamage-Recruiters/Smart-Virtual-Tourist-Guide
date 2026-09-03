import express from "express";
import * as offerController from "../../controllers/Restuarant/offer.controller.js";
import { protect, authorizeRoles } from "../../middleware/authMiddleware.js";

const router = express.Router();

// ── Public routes (tourists can view offers) ─────────────────────────────────
router.get("/", offerController.getAllOffers);
router.get("/active", offerController.getActiveOffers);
router.get("/restaurant/:restaurantId", offerController.getOffersByRestaurant);
router.get("/:id", offerController.getOfferById);

// ── Protected routes (restaurant_user only) ──────────────────────────────────
router.post(
  "/",
  protect,
  authorizeRoles("restaurant_user"),
  offerController.createOffer
);
router.put(
  "/:id",
  protect,
  authorizeRoles("restaurant_user"),
  offerController.updateOffer
);
router.delete(
  "/:id",
  protect,
  authorizeRoles("restaurant_user"),
  offerController.deleteOffer
);
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("restaurant_user"),
  offerController.toggleOfferStatus
);

export default router;
