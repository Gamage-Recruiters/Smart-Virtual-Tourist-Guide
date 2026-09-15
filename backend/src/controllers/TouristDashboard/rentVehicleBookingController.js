import rentalRequest from "../../models/vehicleRentAdmin/rentalRequest.js";

// @desc    Get all bookings made by the logged-in tourist
// @route   GET /api/tourist/bookings/my-bookings
export const getMyBookings = async (req, res) => {
  try {
    const touristId = req.user?._id || req.user?.id;
    if (!touristId) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    const bookings = await rentalRequest
      .find({ touristId })
      .populate({
        path: "vehicleId",
        select: "brand model photos dailyRentalPrice licensePlate",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error("getMyBookings error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};