const express = require("express");
const offerController = require("../controllers/offer.controller");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

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

module.exports = router;
