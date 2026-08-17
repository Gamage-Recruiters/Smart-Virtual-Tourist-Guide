import Vehicle from "../../models/vehicleRentAdmin/vehicle.js";

export const dashboardStats = async (req, res) => {
  try {
    const activeRenatalsCount = await Vehicle.countDocuments({
        ownerId: req.user._id,
        status:"Rented"
    })

    res.status(200).json({
        activeRenatalsCount: activeRenatalsCount
    });
  } catch (err) {
    res.status(500).json({
      message: "Error Fetching active rentals!",
      error: err.message,
    });
  }
};
