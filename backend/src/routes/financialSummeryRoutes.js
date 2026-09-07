import express from "express";
import { getBudgetAllocation , getLatestExpenses } from "../controllers/financialSummeryController.js";

const router = express.Router();
router.get("/allocation/:touristId", getBudgetAllocation);
router.get("/expenses/:touristId", getLatestExpenses);

export default router;

