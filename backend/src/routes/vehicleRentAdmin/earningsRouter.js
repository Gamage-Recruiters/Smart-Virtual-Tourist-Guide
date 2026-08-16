import express from "express";
import { dashboardStats } from "../../controllers/vehicleRentAdmin/earningsContoller.js";
import { protect } from "../../middleware/authMiddleware.js";

const earningsRouter = express.Router();

earningsRouter.get("/dashboard-stats",protect ,dashboardStats);

export default earningsRouter;