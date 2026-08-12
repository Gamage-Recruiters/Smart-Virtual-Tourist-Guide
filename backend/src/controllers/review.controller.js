import Review from "../models/review.model.js";
import Restaurant from "../models/restaurant.model.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * POST /api/reviews
 * Create a review for a restaurant.
 * Auth: Any authenticated user.
 */
const createReview = async (req, res) => {
  try {
    const { restaurantId, rating, comment } = req.body;

    // Validation
    if (!restaurantId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Restaurant ID, rating, and comment are required.",
      });
    }

    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return res.status(400).json({
        success: false,
        message: "Rating must be an integer between 1 and 5.",
      });
    }

    if (comment.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Review comment cannot be empty.",
      });
    }

    if (comment.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Review comment cannot exceed 1000 characters.",
      });
    }

    // Verify restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found.",
      });
    }

    // Check if user already reviewed this restaurant (pre-check for friendly error)
    const existingReview = await Review.findOne({
      user: req.user._id,
      restaurant: restaurantId,
    });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message:
          "You have already reviewed this restaurant. You can edit your existing review instead.",
      });
    }

    const review = await Review.create({
      restaurant: restaurantId,
      user: req.user._id,
      rating,
      comment: comment.trim(),
    });

    // Populate user info for response
    const populatedReview = await Review.findById(review._id).populate(
      "user",
      "fullName username email"
    );

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      review: populatedReview,
    });
  } catch (error) {
    // Handle MongoDB duplicate key error (compound unique index)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "You have already reviewed this restaurant. You can edit your existing review instead.",
      });
    }
    console.error("Create review error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

/**
 * GET /api/reviews/restaurant/:restaurantId
 * Get reviews for a restaurant + stats.
 * Auth: Optional (if provided, user's own review is returned separately).
 * Query params: page (default 1), limit (default 10)
 */
const getRestaurantReviews = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));

    // Verify restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found.",
      });
    }

    // Calculate statistics using aggregation
    const statsAgg = await Review.aggregate([
      { $match: { restaurant: restaurant._id } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          star1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
          star2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
          star3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
          star4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
          star5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
        },
      },
    ]);

    const stats =
      statsAgg.length > 0
        ? {
            averageRating: Math.round(statsAgg[0].averageRating * 10) / 10,
            totalReviews: statsAgg[0].totalReviews,
            distribution: {
              1: statsAgg[0].star1,
              2: statsAgg[0].star2,
              3: statsAgg[0].star3,
              4: statsAgg[0].star4,
              5: statsAgg[0].star5,
            },
          }
        : {
            averageRating: 0,
            totalReviews: 0,
            distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          };

    // Attempt to extract the logged-in user (optional auth)
    let currentUserId = null;
    let userReview = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("_id");
        if (user) {
          currentUserId = user._id;
        }
      } catch {
        // Token invalid/expired — proceed as unauthenticated
      }
    }

    // Fetch the current user's review (if logged in)
    if (currentUserId) {
      userReview = await Review.findOne({
        restaurant: restaurant._id,
        user: currentUserId,
      }).populate("user", "fullName username email");
    }

    // Build query for other reviews (exclude current user's review)
    const otherFilter = { restaurant: restaurant._id };
    if (currentUserId) {
      otherFilter.user = { $ne: currentUserId };
    }

    const totalOtherReviews = await Review.countDocuments(otherFilter);
    const totalPages = Math.ceil(totalOtherReviews / limit) || 1;

    const reviews = await Review.find(otherFilter)
      .populate("user", "fullName username email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      stats,
      userReview,
      reviews,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("Get restaurant reviews error:", error);
    if (error?.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid restaurant ID format." });
    }
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

/**
 * PUT /api/reviews/:reviewId
 * Update own review.
 * Auth: Review owner only.
 */
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    // Validation
    if (!rating && !comment) {
      return res.status(400).json({
        success: false,
        message: "At least rating or comment is required to update.",
      });
    }

    if (rating !== undefined) {
      if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
        return res.status(400).json({
          success: false,
          message: "Rating must be an integer between 1 and 5.",
        });
      }
    }

    if (comment !== undefined) {
      if (comment.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Review comment cannot be empty.",
        });
      }
      if (comment.length > 1000) {
        return res.status(400).json({
          success: false,
          message: "Review comment cannot exceed 1000 characters.",
        });
      }
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found." });
    }

    // Authorization: only the review owner can update
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this review.",
      });
    }

    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment.trim();

    await review.save();

    const updatedReview = await Review.findById(review._id).populate(
      "user",
      "fullName username email"
    );

    return res.status(200).json({
      success: true,
      message: "Review updated successfully.",
      review: updatedReview,
    });
  } catch (error) {
    console.error("Update review error:", error);
    if (error?.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid review ID format." });
    }
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

/**
 * DELETE /api/reviews/:reviewId
 * Delete own review.
 * Auth: Review owner only.
 */
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found." });
    }

    // Authorization: only the review owner can delete
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this review.",
      });
    }

    await Review.findByIdAndDelete(reviewId);

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error("Delete review error:", error);
    if (error?.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid review ID format." });
    }
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

/**
 * PUT /api/reviews/:reviewId/reply
 * Restaurant owner replies to a review.
 * Auth: restaurant_user whose email matches the restaurant's email.
 */
const replyToReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reply } = req.body;

    if (!reply || reply.trim().length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Reply cannot be empty." });
    }

    if (reply.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Reply cannot exceed 1000 characters.",
      });
    }

    const review = await Review.findById(reviewId).populate("restaurant");
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found." });
    }

    // Authorization: restaurant owner must own this restaurant
    // Match by email (consistent with existing codebase pattern)
    if (
      !review.restaurant ||
      review.restaurant.email !== req.user.email
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to reply to this review.",
      });
    }

    review.restaurantReply = reply.trim();
    review.restaurantReplyDate = new Date();
    await review.save();

    const updatedReview = await Review.findById(review._id).populate(
      "user",
      "fullName username email"
    );

    return res.status(200).json({
      success: true,
      message: "Reply submitted successfully.",
      review: updatedReview,
    });
  } catch (error) {
    console.error("Reply to review error:", error);
    if (error?.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid review ID format." });
    }
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

/**
 * GET /api/reviews/owner/:restaurantId
 * Get all reviews for a restaurant (restaurant owner dashboard).
 * Auth: restaurant_user whose email matches the restaurant's email.
 * Query params: page (default 1), limit (default 10)
 */
const getOwnerReviews = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found." });
    }

    // Authorization: only the restaurant owner
    if (restaurant.email !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view these reviews.",
      });
    }

    // Statistics
    const statsAgg = await Review.aggregate([
      { $match: { restaurant: restaurant._id } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          star1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
          star2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
          star3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
          star4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
          star5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
        },
      },
    ]);

    const stats =
      statsAgg.length > 0
        ? {
            averageRating: Math.round(statsAgg[0].averageRating * 10) / 10,
            totalReviews: statsAgg[0].totalReviews,
            distribution: {
              1: statsAgg[0].star1,
              2: statsAgg[0].star2,
              3: statsAgg[0].star3,
              4: statsAgg[0].star4,
              5: statsAgg[0].star5,
            },
          }
        : {
            averageRating: 0,
            totalReviews: 0,
            distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          };

    const totalReviews = await Review.countDocuments({
      restaurant: restaurant._id,
    });
    const totalPages = Math.ceil(totalReviews / limit) || 1;

    const reviews = await Review.find({ restaurant: restaurant._id })
      .populate("user", "fullName username email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      stats,
      reviews,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("Get owner reviews error:", error);
    if (error?.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid restaurant ID format." });
    }
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export {
  createReview,
  getRestaurantReviews,
  updateReview,
  deleteReview,
  replyToReview,
  getOwnerReviews,
};
