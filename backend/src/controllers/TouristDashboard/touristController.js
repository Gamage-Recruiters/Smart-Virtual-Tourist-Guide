import * as budgetService from "../../services/TouristDashboard/budgetService.js";
import { createUser, getUserFromToken, saveTouristProfile, getTouristProfile } from "../../services/TouristDashboard/touristStore.js";
import User from "../../models/User.js";

function extractToken(req) {
  const header = req.headers.authorization || "";
  const [, token] = header.split(" ");
  return token || null;
}

// Complete 2-step registration endpoint
async function registerTourist(req, res) {
  try {
    const {
      fullName,
      email,
      password,
      gender,
      country,
      travelType,
      travelStart,
      startDate,
      travelEnd,
      endDate,
      budget,
      budgetMin,
      budgetMax,
      budgetRange,
      travelStyle,
      preferences,
      accommodationType,
      bloodType,
      medicalCondition,
      medicalConditions,
      allergies,
      foodAllergies,
      emergencyName,
      emergencyContactName,
      emergencyRelationship,
      relationship,
      emergencyContactNumber,
      emergencyPhone,
      emergencyCountry
    } = req.body;

    const userRegistration = await createUser({
      fullName,
      email,
      password,
      gender,
      country,
      travelType
    });

    const parsedAllergies = Array.isArray(allergies)
      ? allergies
      : Array.isArray(foodAllergies)
        ? foodAllergies
        : typeof foodAllergies === "string" && foodAllergies.trim()
          ? foodAllergies.split(",").map(i => i.trim()).filter(Boolean)
          : [];

    const minBudget = budgetMin || budget || 10000;
    const maxBudget = budgetMax || budget || 50000;
    const formattedBudgetRange = budgetRange || `Rs. ${minBudget} - Rs. ${maxBudget}`;

    const profilePayload = {
      gender: gender || "Male",
      country: country || "Sri Lanka",
      travelType: travelType || "Solo",
      startDate: travelStart || startDate || "",
      endDate: travelEnd || endDate || "",
      budget: Number(maxBudget),
      budgetMin: Number(minBudget),
      budgetMax: Number(maxBudget),
      budgetRange: formattedBudgetRange,
      preferences: Array.isArray(travelStyle) ? travelStyle : Array.isArray(preferences) ? preferences : [],
      accommodationType: accommodationType || "Hotel",
      bloodType: bloodType || "O+",
      allergies: parsedAllergies,
      medicalConditions: medicalCondition || medicalConditions || "",
      emergencyContactName: emergencyName || emergencyContactName || "",
      relationship: emergencyRelationship || relationship || "",
      emergencyPhone: emergencyContactNumber || emergencyPhone || "",
      emergencyCountry: emergencyCountry || "United States"
    };

    const savedProfile = await saveTouristProfile({
      userId: userRegistration.user.id,
      profile: profilePayload
    });

    return res.status(201).json({
      success: true,
      message: "Tourist registered successfully.",
      token: userRegistration.token,
      user: userRegistration.user,
      profile: savedProfile
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed to register tourist."
    });
  }
}

// Get Tourist Profile details
async function getProfile(req, res) {
  try {
    const token = extractToken(req);
    const user = await getUserFromToken(token);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized. Please log in again." });
    }

    const profile = await getTouristProfile(user.id);

    return res.status(200).json({
      success: true,
      user,
      profile: profile || {}
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Failed to retrieve profile."
    });
  }
}

// Update Tourist Profile details
async function updateProfile(req, res) {
  try {
    const token = extractToken(req);
    const user = await getUserFromToken(token);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized. Please log in again." });
    }

    // Update User basic info if provided
    if (req.body.fullName || req.body.email) {
      const updateFields = {};
      if (req.body.fullName) updateFields.fullName = req.body.fullName;
      if (req.body.email) updateFields.email = req.body.email;
      await User.findByIdAndUpdate(user.id, { $set: updateFields });
    }

    const parsedAllergies = Array.isArray(req.body.allergies)
      ? req.body.allergies
      : Array.isArray(req.body.foodAllergies)
        ? req.body.foodAllergies
        : typeof req.body.foodAllergies === "string" && req.body.foodAllergies.trim()
          ? req.body.foodAllergies.split(",").map(i => i.trim()).filter(Boolean)
          : [];

    const minBudget = req.body.budgetMin || req.body.budget || 10000;
    const maxBudget = req.body.budgetMax || req.body.budget || 50000;
    const formattedBudgetRange = req.body.budgetRange || `Rs. ${minBudget} - Rs. ${maxBudget}`;

    const profilePayload = {
      gender: req.body.gender || "Male",
      country: req.body.country || "Sri Lanka",
      travelType: req.body.travelType || "Solo",
      passportNumber: req.body.passportNumber || req.body.passport || "",
      startDate: req.body.travelStart || req.body.startDate || "",
      endDate: req.body.travelEnd || req.body.endDate || "",
      budget: Number(maxBudget),
      budgetMin: Number(minBudget),
      budgetMax: Number(maxBudget),
      budgetRange: formattedBudgetRange,
      preferences: Array.isArray(req.body.travelStyle) ? req.body.travelStyle : Array.isArray(req.body.preferences) ? req.body.preferences : [],
      accommodationType: req.body.accommodationType || "Hotel",
      bloodType: req.body.bloodType || "O+",
      allergies: parsedAllergies,
      medicalConditions: req.body.medicalCondition || req.body.medicalConditions || "",
      emergencyContactName: req.body.emergencyName || req.body.emergencyContactName || "",
      relationship: req.body.emergencyRelationship || req.body.relationship || "",
      emergencyPhone: req.body.emergencyContactNumber || req.body.emergencyPhone || "",
      emergencyCountry: req.body.emergencyCountry || "United States"
    };

    const savedProfile = await saveTouristProfile({
      userId: user.id,
      profile: profilePayload
    });

    return res.status(200).json({
      success: true,
      message: "Tourist profile updated successfully.",
      user: { ...user, fullName: req.body.fullName || user.fullName, email: req.body.email || user.email },
      profile: savedProfile
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed to update tourist profile."
    });
  }
}

export {
  registerTourist,
  getProfile,
  updateProfile,
  updateProfile as createProfile
};
