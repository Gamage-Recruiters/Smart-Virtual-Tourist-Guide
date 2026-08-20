import MenuItem from "../models/menuItem.model.js";
import Restaurant from "../models/restaurant.model.js";

const REQUIRED_FIELDS = ["restaurantId", "name", "category", "price"];

const isMissingRequired = (body) => {
  return REQUIRED_FIELDS.filter((field) => body?.[field] === undefined);
};

const isValidFoodType = (value) => {
  return (
    value === "Vegetarian" || value === "Non-Vegetarian" || value === "Vegan"
  );
};

const getErrorResponse = (error) => {
  if (error?.name === "CastError") {
    return { status: 400, message: "Invalid id format" };
  }
  if (error?.name === "ValidationError") {
    return { status: 400, message: "Validation error" };
  }
  return { status: 500, message: "Server error" };
};

const createMenuItem = async (req, res) => {
  try {
    const missing = isMissingRequired(req.body);
    if (missing.length > 0) {
      return res.status(400).json({
        message: "Validation error",
        errors: missing.map((field) => `${field} is required`),
      });
    }

    if (req.body.price < 0) {
      return res.status(400).json({
        message: "Validation error",
        errors: ["price cannot be negative"],
      });
    }

    if (req.body.foodType && !isValidFoodType(req.body.foodType)) {
      return res.status(400).json({
        message: "Validation error",
        errors: ["foodType must be Vegetarian, Non-Vegetarian, or Vegan"],
      });
    }

    const restaurant = await Restaurant.findById(req.body.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const menuItem = await MenuItem.create(req.body);
    return res.status(201).json(menuItem);
  } catch (error) {
    const { status, message } = getErrorResponse(error);
    return res.status(status).json({ message });
  }
};

const getMenuItemsByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const menuItems = await MenuItem.find({ restaurantId }).sort({
      createdAt: -1,
    });
    return res.status(200).json(menuItems);
  } catch (error) {
    const { status, message } = getErrorResponse(error);
    return res.status(status).json({ message });
  }
};

const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    return res.status(200).json(menuItem);
  } catch (error) {
    const { status, message } = getErrorResponse(error);
    return res.status(status).json({ message });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    if (req.body.price !== undefined && req.body.price < 0) {
      return res.status(400).json({
        message: "Validation error",
        errors: ["price cannot be negative"],
      });
    }

    if (req.body.foodType && !isValidFoodType(req.body.foodType)) {
      return res.status(400).json({
        message: "Validation error",
        errors: ["foodType must be Vegetarian, Non-Vegetarian, or Vegan"],
      });
    }

    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    return res.status(200).json(menuItem);
  } catch (error) {
    const { status, message } = getErrorResponse(error);
    return res.status(status).json({ message });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    return res.status(200).json({ message: "Menu item deleted" });
  } catch (error) {
    const { status, message } = getErrorResponse(error);
    return res.status(status).json({ message });
  }
};

const toggleAvailability = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();

    return res.status(200).json(menuItem);
  } catch (error) {
    const { status, message } = getErrorResponse(error);
    return res.status(status).json({ message });
  }
};

const searchMenuItems = async (req, res) => {
  try {
    const { keyword = "" } = req.query;
    const search = keyword.trim();
    if (!search) {
      return res.status(200).json([]);
    }

    const regex = new RegExp(search, "i");
    const menuItems = await MenuItem.find({
      $or: [{ name: regex }, { category: regex }, { description: regex }],
    }).sort({ createdAt: -1 });

    return res.status(200).json(menuItems);
  } catch (error) {
    const { status, message } = getErrorResponse(error);
    return res.status(status).json({ message });
  }
};

export {
  createMenuItem,
  getMenuItemsByRestaurant,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
  searchMenuItems,
};
