const Restaurant = require("../models/restaurant.model");

const REQUIRED_FIELDS = [
  "restaurantName",
  "registrationNo",
  "ownerName",
  "email",
  "phone",
  "businessType",
];

const isMissingRequired = (body) => {
  return REQUIRED_FIELDS.filter((field) => !body?.[field]);
};

const isValidFoodType = (value) => {
  return value === "Restaurant" || value === "Home Based";
};

const createRestaurantProfile = async (req, res) => {
  try {
    const missing = isMissingRequired(req.body);
    if (missing.length > 0) {
      return res.status(400).json({
        message: "Validation error",
        errors: missing.map((field) => `${field} is required`),
      });
    }

    if (!isValidFoodType(req.body.businessType)) {
      return res.status(400).json({
        message: "Validation error",
        errors: ["businessType must be Restaurant or Home Based"],
      });
    }

    const restaurant = await Restaurant.create(req.body);
    return res.status(201).json(restaurant);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getRestaurantProfileById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    return res.status(200).json(restaurant);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().sort({ createdAt: -1 });
    return res.status(200).json(restaurants);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const updateRestaurantProfile = async (req, res) => {
  try {
    if (req.body.businessType && !isValidFoodType(req.body.businessType)) {
      return res.status(400).json({
        message: "Validation error",
        errors: ["businessType must be Restaurant or Home Based"],
      });
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    return res.status(200).json(restaurant);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteRestaurantProfile = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    return res.status(200).json({ message: "Restaurant deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const updateOperatingHours = async (req, res) => {
  try {
    const { operatingHours } = req.body;
    if (!Array.isArray(operatingHours)) {
      return res.status(400).json({
        message: "Validation error",
        errors: ["operatingHours must be an array"],
      });
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { operatingHours },
      { new: true, runValidators: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    return res.status(200).json(restaurant);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const updateBannerImage = async (req, res) => {
  try {
    const { bannerImage } = req.body;
    if (!bannerImage) {
      return res.status(400).json({
        message: "Validation error",
        errors: ["bannerImage is required"],
      });
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { bannerImage },
      { new: true, runValidators: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    return res.status(200).json(restaurant);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createRestaurantProfile,
  getRestaurantProfileById,
  getAllRestaurants,
  updateRestaurantProfile,
  deleteRestaurantProfile,
  updateOperatingHours,
  updateBannerImage,
};
