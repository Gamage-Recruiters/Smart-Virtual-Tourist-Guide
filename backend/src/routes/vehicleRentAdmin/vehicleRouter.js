import express from 'express';
import { addVehicle, deleteVehicle, getAllVehicles, getRecentVehicles, getVehicleById, getVehiclesByVendor, searchVehicles, updateVehicle } from '../../controllers/vehicleRentAdmin/vehicleController.js';
import { protect } from '../../middleware/authMiddleware.js';


const vehicleRouter = express.Router();

vehicleRouter.get("/renter",protect, getVehiclesByVendor);
vehicleRouter.get("/recent",protect, getRecentVehicles)
vehicleRouter.get("/search",protect, searchVehicles);
vehicleRouter.get("/", getAllVehicles);
vehicleRouter.post("/", protect, addVehicle);
vehicleRouter.put("/:id", protect, updateVehicle);
vehicleRouter.delete("/:id", protect, deleteVehicle);
vehicleRouter.get("/:id", getVehicleById);

export default vehicleRouter;