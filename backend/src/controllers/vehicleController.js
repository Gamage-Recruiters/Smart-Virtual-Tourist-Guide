import Vehicle from '../models/vehicleRentAdmin/vehicle.js';

// Get all vehicles
export const getAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: vehicles,
    });
  } catch (error) {
    next(error);
  }
};
