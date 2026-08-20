import express from "express";
import * as reviewController from "../controllers/review.controller.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// ── Public routes (with optional auth handled inside controller) ─────────────
router.get(
  "/restaurant/:restaurantId",
  reviewController.getRestaurantReviews
);

// ── Protected routes (any authenticated user) ────────────────────────────────
router.post("/", protect, reviewController.createReview);
router.put("/:reviewId", protect, reviewController.updateReview);
router.delete("/:reviewId", protect, reviewController.deleteReview);

// ── Restaurant owner routes ──────────────────────────────────────────────────
router.put(
  "/:reviewId/reply",
  protect,
  authorizeRoles("restaurant_user"),
  reviewController.replyToReview
);

router.get(
  "/owner/:restaurantId",
  protect,
  authorizeRoles("restaurant_user"),
  reviewController.getOwnerReviews
);

export default router;
