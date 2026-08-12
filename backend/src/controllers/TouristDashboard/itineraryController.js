import TripItinerary from "../../models/TouristDashboard/TripItinerary.js";
import TouristProfile from "../../models/TouristDashboard/TouristProfile.js";
import Booking from "../../models/TouristDashboard/Booking.js";
import Notification from "../../models/TouristDashboard/Notification.js";

// ─────────────────────────────────────────────────────────────
// GET /api/itinerary
// Returns the trip itinerary for the authenticated user.
// If none exists, returns 404 with a friendly message.
// ─────────────────────────────────────────────────────────────
async function getItinerary(req, res) {
  try {
    const userId = req.user.id;
    const itinerary = await TripItinerary.findOne({ userId }).lean();

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: "No itinerary found. Create one to get started.",
      });
    }

    return res.status(200).json({ success: true, data: itinerary });
  } catch (err) {
    console.error("[itineraryController] getItinerary error:", err);
    return res.status(500).json({ message: "Failed to fetch itinerary." });
  }
}

// ─────────────────────────────────────────────────────────────
// PUT /api/itinerary
// Create or fully update the trip itinerary for the user.
//
// Body: {
//   title, imageUrl, currentLocation, nextActivity,
//   totalDays, currentDay, weather: { temperatureC, description },
//   days: [{ dayNumber, date, location, activities, notes }]
// }
// ─────────────────────────────────────────────────────────────
async function updateItinerary(req, res) {
  try {
    const userId = req.user.id;
    const {
      title,
      imageUrl,
      currentLocation,
      nextActivity,
      totalDays,
      currentDay,
      weather,
      days,
    } = req.body;

    const payload = {};
    if (title !== undefined) payload.title = String(title).trim();
    if (imageUrl !== undefined) payload.imageUrl = String(imageUrl);
    if (currentLocation !== undefined) payload.currentLocation = String(currentLocation).trim();
    if (nextActivity !== undefined) payload.nextActivity = String(nextActivity).trim();
    if (totalDays !== undefined) payload.totalDays = Number(totalDays);
    if (currentDay !== undefined) payload.currentDay = Number(currentDay);
    if (weather !== undefined) payload.weather = weather;
    if (days !== undefined && Array.isArray(days)) payload.days = days;

    const itinerary = await TripItinerary.findOneAndUpdate(
      { userId },
      { $set: { userId, ...payload } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({ success: true, data: itinerary });
  } catch (err) {
    console.error("[itineraryController] updateItinerary error:", err);
    return res.status(500).json({ message: "Failed to update itinerary." });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/itinerary/report
// Generates a comprehensive final trip report combining profile,
// itinerary, all bookings, and notifications.
// This powers the "Final Report" button on the dashboard.
// ─────────────────────────────────────────────────────────────
async function generateFinalReport(req, res) {
  try {
    const userId = req.user.id;

    // Gather all data in parallel
    const [profile, itinerary, bookings, notifications] = await Promise.all([
      TouristProfile.findOne({ userId }).lean(),
      TripItinerary.findOne({ userId }).lean(),
      Booking.find({ userId }).sort({ dateTime: 1 }).lean(),
      Notification.find({ userId }).sort({ createdAt: -1 }).lean(),
    ]);

    // Budget summary
    const totalBudgetUSD = profile ? Number(profile.budget) : 0;
    const totalSpentUSD = bookings
      .filter((b) => b.status === "Confirmed")
      .reduce((sum, b) => sum + (b.priceUSD || 0), 0);
    const remainingUSD = totalBudgetUSD - totalSpentUSD;

    // Booking counts
    const confirmedCount = bookings.filter((b) => b.status === "Confirmed").length;
    const pendingCount = bookings.filter((b) => b.status === "Pending").length;
    const cancelledCount = bookings.filter((b) => b.status === "Cancelled").length;

    // Days on trip
    let tripDurationDays = 0;
    if (profile && profile.startDate && profile.endDate) {
      const start = new Date(profile.startDate);
      const end = new Date(profile.endDate);
      const diffMs = end - start;
      tripDurationDays = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
    }

    const report = {
      generatedAt: new Date().toISOString(),
      tourist: {
        fullName: req.user.fullName,
        email: req.user.email,
        country: profile ? profile.country : "",
        passportNumber: profile ? profile.passportNumber : "",
      },
      trip: {
        title: itinerary ? itinerary.title : "My Sri Lanka Tour",
        startDate: profile ? profile.startDate : "",
        endDate: profile ? profile.endDate : "",
        durationDays: tripDurationDays,
        preferences: profile ? profile.preferences : [],
        currentDay: itinerary ? itinerary.currentDay : null,
        totalDays: itinerary ? itinerary.totalDays : null,
        currentLocation: itinerary ? itinerary.currentLocation : "",
        itineraryDays: itinerary ? itinerary.days : [],
      },
      budget: {
        totalUSD: totalBudgetUSD,
        spentUSD: totalSpentUSD,
        remainingUSD,
        percentageUsed:
          totalBudgetUSD > 0 ? Math.round((totalSpentUSD / totalBudgetUSD) * 100) : 0,
      },
      health: profile
        ? {
            bloodType: profile.bloodType,
            allergies: profile.allergies,
            medicalConditions: profile.medicalConditions,
          }
        : {},
      emergencyContact: profile
        ? {
            name: profile.emergencyContactName,
            phone: profile.emergencyPhone,
            relationship: profile.relationship,
          }
        : {},
      bookings: {
        total: bookings.length,
        confirmed: confirmedCount,
        pending: pendingCount,
        cancelled: cancelledCount,
        list: bookings,
      },
      notifications: {
        total: notifications.length,
        unread: notifications.filter((n) => !n.isRead).length,
        list: notifications,
      },
    };

    return res.status(200).json({ success: true, data: report });
  } catch (err) {
    console.error("[itineraryController] generateFinalReport error:", err);
    return res.status(500).json({ message: "Failed to generate final report." });
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/itinerary/recommendations
// Returns recommendations based on user preferences.
// ─────────────────────────────────────────────────────────────
async function getRecommendations(req, res) {
  try {
    const { interest } = req.body;
    
    // Mock recommendations mapping until ML endpoint is available
    const mockDb = {
      beach: [
        { destination: "Mirissa", avg_rating: 4.8, category: "Beach" },
        { destination: "Unawatuna", avg_rating: 4.7, category: "Beach" },
        { destination: "Trincomalee", avg_rating: 4.6, category: "Beach" }
      ],
      culture: [
        { destination: "Sigiriya", avg_rating: 4.9, category: "Heritage" },
        { destination: "Galle Fort", avg_rating: 4.7, category: "Cultural" },
        { destination: "Kandy", avg_rating: 4.8, category: "Cultural" }
      ],
      wildlife: [
        { destination: "Yala National Park", avg_rating: 4.9, category: "Wildlife" },
        { destination: "Udawalawe", avg_rating: 4.8, category: "Wildlife" }
      ],
      nature: [
        { destination: "Ella", avg_rating: 4.9, category: "Nature" },
        { destination: "Adam's Peak", avg_rating: 4.7, category: "Nature" },
        { destination: "Nuwara Eliya", avg_rating: 4.6, category: "Nature" }
      ],
      food: [
        { destination: "Colombo", avg_rating: 4.8, category: "Cultural" },
        { destination: "Jaffna", avg_rating: 4.7, category: "Cultural" }
      ]
    };

    const categoryKey = interest ? interest.toLowerCase() : 'beach';
    const recommendations = mockDb[categoryKey] || mockDb['beach'];

    return res.status(200).json({
      success: true,
      result: {
        recommendations
      }
    });
  } catch (err) {
    console.error("[itineraryController] getRecommendations error:", err);
    return res.status(500).json({ message: "Failed to load recommendations." });
  }
}

export {
  getItinerary,
  updateItinerary,
  generateFinalReport,
  getRecommendations,
};
