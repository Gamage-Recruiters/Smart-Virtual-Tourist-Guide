import TouristProfile from "../models/TouristProfile.js";
import Booking from "../models/Booking.js";
import Notification from "../models/Notification.js";
import TripItinerary from "../models/TripItinerary.js";

/**
 * GET /api/dashboard/summary
 * Returns a single aggregated payload that the Dashboard page needs:
 *   - Tourist profile (budget, dates, preferences)
 *   - Budget status (budget, spent, remaining, percentage)
 *   - Active trip itinerary snapshot
 *   - Upcoming bookings (next 3, chronological)
 *   - Unread notification count
 */
async function getDashboardSummary(req, res) {
  try {
    const userId = req.user.id;

    // ── 1. Tourist profile ──────────────────────────────────────────
    const profile = await TouristProfile.findOne({ userId }).lean();

    // ── 2. Budget status ────────────────────────────────────────────
    // In a full implementation, `spent` would be derived from confirmed
    // bookings. We expose both so the frontend can calculate percentage.
    const budget = profile ? Number(profile.budget) : 0;
    const confirmedBookings = await Booking.find({
      userId,
      status: "Confirmed",
    }).lean();
    const spent = confirmedBookings.reduce((sum, b) => sum + (b.priceUSD || 0), 0);
    const remaining = budget - spent;
    const percentage = budget > 0 ? Math.round((spent / budget) * 100) : 0;

    // ── 3. Trip itinerary snapshot ───────────────────────────────────
    const itinerary = await TripItinerary.findOne({ userId }).lean();

    // Derive progress percentage from currentDay / totalDays
    const tripProgress =
      itinerary && itinerary.totalDays > 0
        ? Math.round((itinerary.currentDay / itinerary.totalDays) * 100)
        : 0;

    // ── 4. Upcoming bookings (next 3) ────────────────────────────────
    const upcomingBookings = await Booking.find({
      userId,
      status: { $ne: "Cancelled" },
    })
      .sort({ dateTime: 1 })
      .limit(3)
      .lean();

    // ── 5. Unread notification count ─────────────────────────────────
    const unreadCount = await Notification.countDocuments({ userId, isRead: false });

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: req.user.id,
          fullName: req.user.fullName,
          email: req.user.email,
        },
        profile: profile || null,
        budget: {
          total: budget,
          spent,
          remaining,
          percentage,
        },
        itinerary: itinerary
          ? {
              title: itinerary.title,
              imageUrl: itinerary.imageUrl,
              currentLocation: itinerary.currentLocation,
              nextActivity: itinerary.nextActivity,
              currentDay: itinerary.currentDay,
              totalDays: itinerary.totalDays,
              tripProgress,
              weather: itinerary.weather,
              startDate: profile ? profile.startDate : "",
              endDate: profile ? profile.endDate : "",
            }
          : null,
        upcomingBookings,
        unreadNotifications: unreadCount,
      },
    });
  } catch (err) {
    console.error("[dashboardController] getDashboardSummary error:", err);
    return res.status(500).json({ message: "Failed to load dashboard data." });
  }
}

export { getDashboardSummary };
