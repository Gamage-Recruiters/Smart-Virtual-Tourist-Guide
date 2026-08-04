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
      currentLocation,
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
      ownerId: req.user._id,
      brand,
      model,
      year,
      licensePlate,
      transmission,
      fuelType,
      passengers,
      luggage,
      dailyRentalPrice,
      currentLocation,
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
      { returnDocument: "after", runValidators: true },
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

// 4. GET ALL VEHICLES (Read All-global)
export const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({}).sort({ createdAt: -1 }); // Newest first
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

// 5. GET ALL VEHICLES FOR A SPECIFIC VENDOR (Read All)
export const getVehiclesByVendor = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ ownerId: req.user._id });
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

// 6. GET SINGLE VEHICLE DETAILS (Read One)
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

//7. get three recent vehicles for a specific vendor
export const getRecentVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ownerId: req.user._id}).sort({ createdAt: -1 }).limit(3);
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

// 8. search vehicles by licensePlate, model, brand for a specific vendor
export const searchVehicles = async (req, res) => {
  try {
    const { query } = req.query;
    if(!query){
      return res.status(400).json({ message: "Please provide a search query" });
    }
    const vehicles = await Vehicle.find({
      ownerId: req.user._id,
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