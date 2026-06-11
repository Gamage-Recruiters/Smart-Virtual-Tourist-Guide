import express from 'express';
import { addVehicle, deleteVehicle, getAllVehicles, getVehicleById, updateVehicle } from '../../controllers/vehicleRentAdmin/vehicleController.js';


const vehicleRouter = express.Router();

vehicleRouter.post("/", addVehicle);
vehicleRouter.get("/", getAllVehicles);
vehicleRouter.get("/:id", getVehicleById);
vehicleRouter.put("/:id", updateVehicle);
vehicleRouter.delete("/:id", deleteVehicle);

export default vehicleRouter;