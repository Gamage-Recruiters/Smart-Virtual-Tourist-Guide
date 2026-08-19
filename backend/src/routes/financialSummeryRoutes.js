import express from "express";
import { getBudgetAllocation } from "../controllers/financialSummeryController.js";

const router = express.Router();
router.get("/allocation/:touristId", getBudgetAllocation);

export default router;

