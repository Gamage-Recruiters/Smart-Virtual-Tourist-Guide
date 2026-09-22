import Restaurant from "../../models/Restuarant/restaurant.model.js";
import { sendNotification } from "../../services/NotificationService.js";
import {
  NOTIFICATION_SCOPES,
  RECIPIENT_ROLES,
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_PRIORITIES,
} from "../../constants/notificationConstants.js";

const REQUIRED_FIELDS = [
  "restaurantName",
  "registrationNo",
  "ownerName",
  "email",
  "phone",
  "district",
];

const isMissingRequired = (body) => {
  return REQUIRED_FIELDS.filter((field) => !body?.[field]);
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

const createRestaurantProfile = async (req, res) => {
  try {
    const missing = isMissingRequired(req.body);
    if (missing.length > 0) {
      return res.status(400).json({
        message: "Validation error",
        errors: missing.map((field) => `${field} is required`),
      });
    }

    const restaurant = await Restaurant.create(req.body);

    // --- Notification: MULTICAST to all Administrators ---
    // Alerts admins that a new restaurant has registered and requires identity/business verification.
    try {
      const io = req.app.get('io');
      await sendNotification(io, {
        scope: NOTIFICATION_SCOPES.MULTICAST,
        recipientRole: RECIPIENT_ROLES.ADMIN,
        title: '🍽️ New Restaurant Profile Registered',
        message: `"${restaurant.restaurantName}" (Reg. No: ${restaurant.registrationNo}) in ${restaurant.district} has submitted a new profile for verification.`,
        category: NOTIFICATION_CATEGORIES.SYSTEM,
        priority: NOTIFICATION_PRIORITIES.HIGH,
        actionUrl: `/admin/restaurants/${restaurant._id}`,
      });
    } catch (notifError) {
      console.error('[Notification Error] createRestaurantProfile:', notifError.message);
    }

    return res.status(201).json(restaurant);
  } catch (error) {
    const { status, message } = getErrorResponse(error);
    return res.status(status).json({ message });
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
    const { status, message } = getErrorResponse(error);
    return res.status(status).json({ message });
  }
};

const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().sort({ createdAt: -1 });
    return res.status(200).json(restaurants);
  } catch (error) {
    const { status, message } = getErrorResponse(error);
    return res.status(status).json({ message });
  }
};

const updateRestaurantProfile = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    return res.status(200).json(restaurant);
  } catch (error) {
    const { status, message } = getErrorResponse(error);
    return res.status(status).json({ message });
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
    const { status, message } = getErrorResponse(error);
    return res.status(status).json({ message });
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
      { returnDocument: 'after', runValidators: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    return res.status(200).json(restaurant);
  } catch (error) {
    const { status, message } = getErrorResponse(error);
    return res.status(status).json({ message });
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
      { returnDocument: 'after', runValidators: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    return res.status(200).json(restaurant);
  } catch (error) {
    const { status, message } = getErrorResponse(error);
    return res.status(status).json({ message });
  }
};

export {
  createRestaurantProfile,
  getRestaurantProfileById,
  getAllRestaurants,
  updateRestaurantProfile,
  deleteRestaurantProfile,
  updateOperatingHours,
  updateBannerImage,
};
