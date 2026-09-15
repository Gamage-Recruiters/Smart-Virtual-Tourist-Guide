import RentalEarning from "../../models/vehicleRentAdmin/rentalEarnings.js";
import rentalRequest from "../../models/vehicleRentAdmin/rentalRequest.js";
import Vehicle from "../../models/vehicleRentAdmin/vehicle.js";

export const createBooking = async (req, res) => {
  try {
    const {
      vehicleId,
      fromLocation,
      toLocation,
      route,
      startDate,
      endDate,
      duration,
      totalDays,
      isBid,
      offeredDailyRate,
      originalDailyPrice,
      totalAmount,
      status,
    } = req.body;

    // touristId resolved from auth middleware (req.user) or fallback
    const touristId = req.user?._id || req.user?.id || req.body.touristId;

    if (!touristId) {
      return res.status(401).json({ message: "Tourist authentication required." });
    }

    if (!vehicleId || !fromLocation || !toLocation || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required booking details." });
    }

    // Verify vehicle exists and is rentable
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Selected vehicle not found." });
    }

    const newBooking = new rentalRequest({
      touristId,
      vehicleId,
      fromLocation,
      toLocation,
      route: route || `${fromLocation} to ${toLocation}`,
      startDate,
      endDate,
      duration: duration || `${totalDays} Days Trip`,
      totalDays,
      isBid: Boolean(isBid),
      offeredDailyRate,
      originalDailyPrice,
      totalAmount,
      status: status || (isBid ? "NOT BIDDED" : "CONFIRMED"),
      isExpired: false,
    });

    const savedBooking = await newBooking.save();

    return res.status(201).json({
      success: true,
      message: isBid
        ? "Bid offer submitted to renter successfully."
        : "Vehicle booking confirmed successfully.",
      booking: savedBooking,
    });
  } catch (error) {
    console.error("createBooking error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error creating booking request.",
      error: error.message,
    });
  }
};


//  Get all rental requests for renters
export const getRentalRequests = async (req, res) => {
  try {
    // 1. Get the authenticated renter's ID from your auth middleware
    const renterId = req.user?._id || req.user?.id;

    if (!renterId) {
      return res.status(401).json({
        success: false,
        message: "Renter authentication required.",
      });
    }

    // 2. Fetch all vehicle IDs registered by this specific renter
    const myVehicles = await Vehicle.find({ ownerId: renterId }).select("_id");
    const myVehicleIds = myVehicles.map((v) => v._id);

    // 3. Filter requests where vehicleId is in the renter's fleet
    const requests = await rentalRequest
      .find({ vehicleId: { $in: myVehicleIds } })
      .populate("touristId", "fullName country email profileImage")
      .populate("vehicleId", "brand model photos dailyRentalPrice")
      .sort({ createdAt: -1 });

    // 4. Format output matching your frontend RentalRequestsPage structure
    const formattedRequests = requests.map((item) => ({
      id: item._id,
      name: item.touristId?.fullName || "Tourist",
      country: item.touristId?.country || "International",
      avatar: item.touristId?.profileImage || null,
      route: item.route,
      duration: item.duration,
      vehicle: item.vehicleId
        ? `${item.vehicleId.brand} ${item.vehicleId.model}`
        : "Standard Vehicle",
      status: item.status,
      isExpired: item.isExpired,
      totalAmount: item.totalAmount,
      offeredRate: item.offeredDailyRate,
      OriginalRate: item. originalDailyPrice,
      createdAt: item.createdAt,
    }));

    return res.status(200).json(formattedRequests);
  } catch (error) {
    console.error("getRentalRequests error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching rental requests.",
      error: error.message,
    });
  }
};


//   Get current tourist's bookings
export const getTouristBookings = async (req, res) => {
  try {
    const touristId = req.user?._id || req.user?.id;
    const bookings = await rentalRequest.find({ touristId })
      .populate("vehicleId")
      .sort({ createdAt: -1 });

    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, declineReason } = req.body;
    const renterId = req.user?._id || req.user?.id;

    // Validate incoming status
    const allowedStatuses = ["CONFIRMED", "WON", "CANCELLED"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status update. Allowed values: CONFIRMED, WON, CANCELLED",
      });
    }

    const booking = await rentalRequest.findById(id).populate("vehicleId");
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking request not found.",
      });
    }

    // Resolve vehicle ID whether populated or unpopulated
    const vehicleDocId = booking.vehicleId?._id || booking.vehicleId;

    // 1. Update booking request status
    booking.status = status;
    if (declineReason) {
      booking.declineReason = declineReason;
    }
    await booking.save();

    // 2. Handle Status: ACCEPTED ("CONFIRMED" or "WON")
    if (status === "CONFIRMED" || status === "WON") {
      // Mark vehicle as Rented
      await Vehicle.findByIdAndUpdate(
        vehicleDocId,
        { $set: { status: "Rented" } },
        { returnDocument: "after", runValidators: true }
      );

      // Auto-record in RentalEarning (prevent duplicates)
      const existingEarning = await RentalEarning.findOne({ bookingId: booking._id });
      if (!existingEarning) {
        const generatedTrxId = `TRX-${Math.floor(10000 + Math.random() * 90000)}`;

        const vehicleBrand = booking.vehicleId?.brand || "";
        const vehicleModel = booking.vehicleId?.model || "";
        const tripDescription = `${booking.route || "Rental Trip"} (${vehicleBrand} ${vehicleModel})`.trim();

        await RentalEarning.create({
          renterId: renterId || booking.vehicleId?.ownerId,
          bookingId: booking._id,
          vehicleId: vehicleDocId,
          touristId: booking.touristId,
          transactionId: generatedTrxId,
          tripDescription,
          amount: booking.totalAmount || 0,
          tripStatus: "ACTIVE",
          payoutStatus: "PROCESSING",
        });
      }
    }

    // 3. Handle Status: DECLINED / CANCELLED
    else if (status === "CANCELLED") {
      // Check if this vehicle has any other currently confirmed bookings
      const activeBookingsCount = await rentalRequest.countDocuments({
        vehicleId: vehicleDocId,
        _id: { $ne: booking._id },
        status: { $in: ["CONFIRMED", "WON"] },
      });

      // If no other active rentals exist, revert the vehicle back to "Available"
      if (activeBookingsCount === 0) {
        await Vehicle.findByIdAndUpdate(
          vehicleDocId,
          { $set: { status: "Available" } },
          { returnDocument: "after", runValidators: true }
        );
      }

      // Mark any previously created earnings document as CANCELLED so it's excluded from revenue
      await RentalEarning.findOneAndUpdate(
        { bookingId: booking._id },
        { $set: { tripStatus: "CANCELLED" } }
      );
    }

    return res.status(200).json({
      success: true,
      message:
        status === "CANCELLED"
          ? "Rental request declined."
          : "Rental request accepted, vehicle marked as Rented, and earnings recorded!",
      data: booking,
    });
  } catch (error) {
    console.error("updateBookingStatus error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error updating booking status.",
      error: error.message,
    });
  }
};

export const completeBookingTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await rentalRequest.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    if (booking.status !== "CONFIRMED" && booking.status !== "WON") {
      return res.status(400).json({
        message: "Only confirmed trips can be marked as completed.",
      });
    }

    // 1. Update Booking
    booking.status = "COMPLETED";
    await booking.save();

    // 2. Free up the Vehicle & Increment trips completed count
    await Vehicle.findByIdAndUpdate(booking.vehicleId, {
      $set: { status: "Available" },
      $inc: { tripsCompleted: 1 },
    });

    // 3. Move Earnings to PENDING_PAYOUT
    await RentalEarning.findOneAndUpdate(
      { bookingId: booking._id },
      {
        $set: {
          tripStatus: "COMPLETED",
          payoutStatus: "PENDING_PAYOUT",
          completionDate: new Date(),
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Trip completed! Vehicle is now available and funds are moved to pending payout.",
      booking,
    });
  } catch (error) {
    console.error("completeBookingTrip error:", error);
    return res.status(500).json({ message: error.message });
  }
};