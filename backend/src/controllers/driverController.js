import Driver from '../models/driver.js';

// Add driver details
const addDriver = async (req, res, next) => {
  try {
    const {
      driverName,
      vehicleName,
      vehicleNumber,
      vehicleColor,
      nationalIdNumber,
      contactNumber,
      showCurrentLocation,
      availability,
    } = req.body;

    if (
      !driverName ||
      !vehicleName ||
      !vehicleNumber ||
      !vehicleColor ||
      !nationalIdNumber ||
      !contactNumber
    ) {
      return res.status(400).json({
        success: false,
        message: "All driver details are required",
      });
    }

    const newDriver = new Driver({
      driverName,
      vehicleName,
      vehicleNumber,
      vehicleColor,
      nationalIdNumber,
      contactNumber,
      showCurrentLocation,
      availability,
    });

    await newDriver.save();

    res.status(201).json({
      success: true,
      message: "Driver details added successfully",
      data: newDriver,
    });
  } catch (error) {
    next(error);
  }
};

// Get all drivers
const getAllDrivers = async (req, res, next) => {
  try {
    const drivers = await Driver.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: drivers,
    });
  } catch (error) {
    next(error);
  }
};

// Get one driver by id
const getDriverById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const driver = await Driver.findById(id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    res.status(200).json({
      success: true,
      data: driver,
    });
  } catch (error) {
    next(error);
  }
};

// Update driver details
const updateDriver = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedDriver = await Driver.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedDriver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Driver details updated successfully",
      data: updatedDriver,
    });
  } catch (error) {
    next(error);
  }
};

export {
  addDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
};