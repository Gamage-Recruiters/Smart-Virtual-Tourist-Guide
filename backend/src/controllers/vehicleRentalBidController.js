import RentalRequest from '../models/vehicleRentAdmin/rentalRequest.js';
import VehicleBid from '../models/vehicleRentAdmin/bid.js';

// 1. Tourist creates a rental request
export const createRentalRequest = async (req, res, next) => {
  try {
    const { touristId, pickupLocation, dropoffLocation, startDate, endDate, durationDays, vehiclePreference } = req.body;
    
    if (!touristId || !pickupLocation || !dropoffLocation || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newRequest = new RentalRequest({
      touristId,
      pickupLocation,
      dropoffLocation,
      startDate,
      endDate,
      durationDays,
      vehiclePreference
    });

    await newRequest.save();

    res.status(201).json({
      success: true,
      message: "Rental request created successfully",
      data: newRequest
    });
  } catch (error) {
    next(error);
  }
};

// 2. Get all rental requests (for admins/vendors to view)
export const getRentalRequests = async (req, res, next) => {
  try {
    const requests = await RentalRequest.find()
      .populate('touristId', 'name email')
      .sort({ createdAt: -1 });
      
    res.status(200).json({
      success: true,
      data: requests
    });
  } catch (error) {
    next(error);
  }
};

// 3. Vendor places a bid on a rental request
export const submitVehicleBid = async (req, res, next) => {
  try {
    const { requestId, vendorId, vehicleId, bidAmount, message } = req.body;

    if (!requestId || !vendorId || !vehicleId || !bidAmount) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newBid = new VehicleBid({
      requestId,
      vendorId,
      vehicleId,
      bidAmount: Number(bidAmount),
      message
    });

    await newBid.save();

    res.status(201).json({
      success: true,
      message: "Vehicle bid submitted successfully!",
      data: newBid
    });
  } catch (error) {
    next(error);
  }
};

// 4. Get bids for a specific rental request
export const getVehicleBidsByRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;

    if (!requestId) {
      return res.status(400).json({ success: false, message: "requestId is required" });
    }

    const bids = await VehicleBid.find({ requestId })
      .populate('vendorId', 'name email')
      .populate('vehicleId', 'brand model type')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bids
    });
  } catch (error) {
    next(error);
  }
};
