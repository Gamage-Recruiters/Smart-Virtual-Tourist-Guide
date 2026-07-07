const budgetService = require("../services/budgetService");
const { getUserFromToken, saveTouristProfile } = require("../services/touristStore");

function extractToken(req) {
  const header = req.headers.authorization || "";
  const [, token] = header.split(" ");
  return token || null;
}

async function createProfile(req, res) {
  try {
    const token = extractToken(req);
    const user = await getUserFromToken(token);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized. Please register again." });
    }

    const profilePayload = {
      country: req.body.country || "",
      passportNumber: req.body.passportNumber || "",
      startDate: req.body.startDate || "",
      endDate: req.body.endDate || "",
      budget: Number(req.body.budget || 0),
      preferences: Array.isArray(req.body.preferences) ? req.body.preferences : [],
      visaType: req.body.visaType || "",
      medicalConditions: req.body.medicalConditions || "",
      foodAllergies: req.body.foodAllergies || "",
      emergencyContactName: req.body.emergencyContactName || "",
      emergencyPhone: req.body.emergencyPhone || "",
      relationship: req.body.relationship || "",
    };

    if (!profilePayload.country) {
      return res.status(400).json({ message: "country is required." });
    }
    if (!profilePayload.startDate) {
      return res.status(400).json({ message: "startDate is required." });
    }
    if (!profilePayload.endDate) {
      return res.status(400).json({ message: "endDate is required." });
    }
    if (!profilePayload.budget || Number.isNaN(profilePayload.budget) || profilePayload.budget <= 0) {
      return res.status(400).json({ message: "budget must be a positive number." });
    }
    if (!profilePayload.emergencyContactName) {
      return res.status(400).json({ message: "emergencyContactName is required." });
    }
    if (!profilePayload.emergencyPhone) {
      return res.status(400).json({ message: "emergencyPhone is required." });
    }

    const savedProfile = await saveTouristProfile({
      userId: user.id,
      profile: profilePayload,
    });

    let budgetPlan = null;
    try {
      budgetPlan = await budgetService.optimizeBudget({
        startDate: profilePayload.startDate,
        endDate: profilePayload.endDate,
        budgetUSD: profilePayload.budget,
        preferences: profilePayload.preferences,
      });
    } catch (budgetErr) {
      budgetPlan = {
        error: budgetErr.message || "Budget optimization temporarily unavailable.",
      };
    }

    return res.status(201).json({
      message: "Tourist profile saved successfully.",
      user,
      profile: savedProfile,
      budgetPlan,
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      message: err.message || "Failed to save tourist profile.",
    });
  }
}

module.exports = {
  createProfile,
};
