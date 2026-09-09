import Offer from "../../models/Restuarant/offer.model.js";
import Restaurant from "../../models/Restuarant/restaurant.model.js";

const REQUIRED_FIELDS = [
  "restaurantId",
  "title",
  "description",
  "discountPercentage",
  "startDate",
  "endDate",
];

const isMissingRequired = (body) => {
  return REQUIRED_FIELDS.filter((field) => body?.[field] === undefined);
};

const isValidDiscount = (value) => {
  return value >= 0 && value <= 100;
};

const toDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const isValidDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return false;
  }
  return endDate > startDate;
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

const createOffer = async (req, res) => {
  try {
    const missing = isMissingRequired(req.body);
    if (missing.length > 0) {
      return res.status(400).json({
        message: "Validation error",
        errors: missing.map((field) => `${field} is required`),
      });
    }

    if (!isValidDiscount(req.body.discountPercentage)) {
      return res.status(400).json({
        message: "Validation error",
        errors: ["discountPercentage must be between 0 and 100"],
      });
    }

    const startDate = toDate(req.body.startDate);
    const endDate = toDate(req.body.endDate);
    if (!isValidDateRange(startDate, endDate)) {
      return res.status(400).json({
        message: "Validation error",
        errors: ["endDate must be after startDate"],
      });
    }

    const restaurant = await Restaurant.findById(req.body.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const offer = await Offer.create({
      ...req.body,
      startDate,
      endDate,
    });
    return res.status(201).json(offer);
  } catch (error) {
    const { status, message } = getErrorResponse(error);
    return res.status(status).json({ message });
  }
};

const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    return res.status(200).json(offers);
  } catch (error) {
    const { status, message } = getErrorResponse(error);
    return res.status(status).json({ message });
  }
};

const getOffersByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const offers = await Offer.find({ restaurantId }).sort({ createdAt: -1 });
    return res.status(200).json(offers);
  } catch (error) {
    const { status, message } = getErrorResponse(error);
    return res.status(status).json({ message });
  }
};

const getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }
    return res.status(200).json(offer);
  } catch (error) {
    const { status, message } = getErrorResponse(error);
    return res.status(status).json({ message });
  }
};

const updateOffer = async (req, res) => {
  try {
    if (
      req.body.discountPercentage !== undefined &&
      !isValidDiscount(req.body.discountPercentage)
    ) {
      return res.status(400).json({
        message: "Validation error",
        errors: ["discountPercentage must be between 0 and 100"],
      });
    }

    const existing = await Offer.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Offer not found" });
    }

    const startDate = toDate(req.body.startDate) || existing.startDate;
    const endDate = toDate(req.body.endDate) || existing.endDate;
    if (!isValidDateRange(startDate, endDate)) {
      return res.status(400).json({
        message: "Validation error",
        errors: ["endDate must be after startDate"],
      });
    }

    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      { ...req.body, startDate, endDate },
      { new: true, runValidators: true }
    );

    return res.status(200).json(offer);
  } catch (error) {
    const { status, message } = getErrorResponse(error);
    return res.status(status).json({ message });
  }
};

const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }
    return res.status(200).json({ message: "Offer deleted" });
  } catch (error) {
    const { status, message } = getErrorResponse(error);
    return res.status(status).json({ message });
  }
};

const toggleOfferStatus = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    offer.isActive = !offer.isActive;
    await offer.save();

    return res.status(200).json(offer);
  } catch (error) {
    const { status, message } = getErrorResponse(error);
    return res.status(status).json({ message });
  }
};

const getActiveOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ isActive: true }).sort({ createdAt: -1 });
    return res.status(200).json(offers);
  } catch (error) {
    const { status, message } = getErrorResponse(error);
    return res.status(status).json({ message });
  }
};

export {
  createOffer,
  getAllOffers,
  getOffersByRestaurant,
  getOfferById,
  updateOffer,
  deleteOffer,
  toggleOfferStatus,
  getActiveOffers,
};
