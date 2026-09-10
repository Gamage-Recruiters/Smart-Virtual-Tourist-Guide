import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: [true, "Restaurant is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
      maxlength: [1000, "Review comment cannot exceed 1000 characters"],
    },
    restaurantReply: {
      type: String,
      trim: true,
      maxlength: [1000, "Reply cannot exceed 1000 characters"],
    },
    restaurantReplyDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Compound unique index: one review per user per restaurant
reviewSchema.index({ user: 1, restaurant: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
