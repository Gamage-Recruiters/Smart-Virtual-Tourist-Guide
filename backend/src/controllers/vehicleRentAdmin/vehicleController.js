import Vehicle from "../../models/vehicleRentAdmin/vehicle.js";

// 1. ADD NEW VEHICLE (Create)
export const addVehicle = async (req, res) => {
  try {
    const {
      brand,
      model,
      year,
      licensePlate,
      transmission,
      fuelType,
      passengers,
      luggage,
      dailyRentalPrice,
      location,
      photos,
      documents,
    } = req.body;

    // Check if a vehicle with the same license plate already exists
    const existingVehicle = await Vehicle.findOne({ licensePlate });

    if (existingVehicle) {
      return res
        .status(400)
        .json({ message: "A vehicle with this license plate already exists." });
    }

    const newVehicle = new Vehicle({
      ownerId: req.body.ownerId,
      brand,
      model,
      year,
      licensePlate,
      transmission,
      fuelType,
      passengers,
      luggage,
      dailyRentalPrice,
      currentLocation: req.body.location,
      photos,
      documents,
    });

    const savedVehicle = await newVehicle.save();
    res
      .status(201)
      .json({ message: "Vehicle added successfully!", vehicle: savedVehicle });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Server error while adding vehicle",
        error: error.message,
      });
  }
};

// 2. UPDATE VEHICLE DETAILS (Update)
export const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true },
    );

    if (!updatedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res
      .status(200)
      .json({
        message: "Vehicle updated successfully!",
        vehicle: updatedVehicle,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Server error while updating vehicle",
        error: error.message,
      });
  }
};

// 3. DELETE VEHICLE (Delete)
export const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedVehicle = await Vehicle.findByIdAndDelete(id);

    if (!deletedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res
      .status(200)
      .json({ message: "Vehicle deleted successfully from fleet!" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Server error while deleting vehicle",
        error: error.message,
      });
  }
};

// 4. GET ALL VEHICLES FOR A SPECIFIC VENDOR (Read All)
export const getAllVehicles = async (req, res) => {
  try {
    const { ownerId } = req.query;
    const filter = ownerId ? { ownerId } : {};

    const vehicles = await Vehicle.find(filter).sort({ createdAt: -1 }); // Newest first
    res.status(200).json(vehicles);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Server error while fetching fleet",
        error: error.message,
      });
  }
};

// 5. GET SINGLE VEHICLE DETAILS (Read One)
export const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json(vehicle);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Server error while fetching vehicle details",
        error: error.message,
      });
  }
};

//6. get five recent vehicles
export const getRecentVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 }).limit(3);
    res.status(200).json(vehicles);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Server error while fetching recent vehicles",
        error: error.message,
      });
  }
}

// 7. search vehicles by licensePlate, model, brand
export const searchVehicles = async (req, res) => {
  try {
    const { query } = req.query;
    const vehicles = await Vehicle.find({
      $or: [
        { licensePlate: { $regex: query, $options: "i" } },
        { model: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
      ],
    });
    res.status(200).json(vehicles);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Server error while searching vehicles",
        error: error.message,
      });
  }
}