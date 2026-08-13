import Guide from '../models/guide.js';

// Add guide details
const addGuide = async (req, res, next) => {
  try {
    const {
      name,
      title,
      price,
      priceUnit,
      rating,
      isVerified,
      isOnline,
      badge,
      languages,
      specialties,
      image,
      contactNumber,
      availability,
    } = req.body;

    if (!name || !contactNumber) {
      return res.status(400).json({
        success: false,
        message: "Name and contact number are required",
      });
    }

    const newGuide = new Guide({
      name,
      title,
      price,
      priceUnit,
      rating,
      isVerified,
      isOnline,
      badge,
      languages,
      specialties,
      image,
      contactNumber,
      availability,
    });

    await newGuide.save();

    res.status(201).json({
      success: true,
      message: "Guide details added successfully",
      data: newGuide,
    });
  } catch (error) {
    next(error);
  }
};

// Get all guides
const getAllGuides = async (req, res, next) => {
  try {
    const guides = await Guide.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: guides,
    });
  } catch (error) {
    next(error);
  }
};

// Get one guide by id
const getGuideById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const guide = await Guide.findById(id);

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Guide not found",
      });
    }

    res.status(200).json({
      success: true,
      data: guide,
    });
  } catch (error) {
    next(error);
  }
};

// Update guide details
const updateGuide = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedGuide = await Guide.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedGuide) {
      return res.status(404).json({
        success: false,
        message: "Guide not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Guide details updated successfully",
      data: updatedGuide,
    });
  } catch (error) {
    next(error);
  }
};

export {
  addGuide,
  getAllGuides,
  getGuideById,
  updateGuide,
};
