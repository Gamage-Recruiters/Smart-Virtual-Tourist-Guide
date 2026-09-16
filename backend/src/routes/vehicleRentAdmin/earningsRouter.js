import express from "express";
import { dashboardStats, getEarningsOverview } from "../../controllers/vehicleRentAdmin/earningsContoller.js";
import { protect } from "../../middleware/authMiddleware.js";

const earningsRouter = express.Router();

earningsRouter.get("/dashboard-stats",protect ,dashboardStats);
earningsRouter.get("/rantal-earnings",protect ,getEarningsOverview);

export default earningsRouter;