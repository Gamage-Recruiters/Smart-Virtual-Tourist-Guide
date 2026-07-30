const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    imageUrl: { type: String, trim: true },
    foodType: {
      type: String,
      enum: ["Vegetarian", "Non-Vegetarian", "Vegan"],
      default: "Non-Vegetarian",
    },
    isAvailable: { type: Boolean, default: true },
    isVegan: { type: Boolean, default: false },
    preparationTime: { type: Number,  min: 0 },
    ingredients: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
