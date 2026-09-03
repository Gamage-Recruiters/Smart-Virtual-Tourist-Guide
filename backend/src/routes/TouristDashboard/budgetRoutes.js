import express from "express";
const router = express.Router();
import {
  optimizeBudget,
  getBudgetAllocation,
  checkGuardian,
  recalculateBudget,
  checkAnomaly,
  checkAnomalyBatch,
  validateBid,
  getFairPrice,
} from "../../controllers/TouristDashboard/budgetController.js";

// ─────────────────────────────────────────────────────────────
// Middleware: log all budget requests in development
// ─────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== "production") {
  router.use((req, _res, next) => {
    console.log(`[Budget API] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// ─────────────────────────────────────────────────────────────
// BUDGET OPTIMIZATION
// ─────────────────────────────────────────────────────────────

/**
 * POST /api/budget/optimize
 * Generate personalized budget allocation plan.
 *
 * Body:
 * {
 *   startDate:    "2025-03-01",
 *   endDate:      "2025-03-08",
 *   budgetUSD:    1000,
 *   preferences:  ["Cultural", "Food & Dining"],
 *   tripStyle:    "comfort"       (optional — overrides preference mapping)
 * }
 *
 * Response:
 * {
 *   allocation:    { daily_allocation, total_allocation, weights_used, ... }
 *   daily_summary: { daily_breakdown: [{ category, daily_lkr, percentage }] }
 * }
 */
router.post("/optimize", optimizeBudget);

/**
 * POST /api/budget/recalculate
 * Recalculate when tourist updates trip details.
 *
 * Body: { touristId, startDate, endDate, budgetUSD, preferences[] }
 */
router.post("/recalculate", recalculateBudget);

/**
 * GET /api/budget/allocation/:touristId
 * Get the saved budget allocation plan for a tourist.
 */
router.get("/allocation/:touristId", getBudgetAllocation);

// ─────────────────────────────────────────────────────────────
// BUDGET GUARDIAN
// ─────────────────────────────────────────────────────────────

/**
 * POST /api/budget/guardian
 * Real-time spending alert check.
 *
 * Body: { totalBudgetLKR: 320000, spentSoFarLKR: 230000 }
 *
 * Response:
 * {
 *   alert_level:   "WARNING",
 *   percent_used:  71.9,
 *   remaining_lkr: 90000,
 *   message:       "⚠️ 72% used. LKR 90,000 remaining. Consider cheaper options."
 * }
 */
router.post("/guardian", checkGuardian);

// ─────────────────────────────────────────────────────────────
// ANOMALY DETECTION
// ─────────────────────────────────────────────────────────────

/**
 * POST /api/budget/anomaly/check
 * Check if a single bid is overpriced.
 *
 * Body: { serviceType: "van_full_day", priceLKR: 65000 }
 *
 * Response:
 * {
 *   is_anomaly:    true,
 *   alert_message: "⚠️ van full day bid of LKR 65,000 looks overpriced...",
 *   benchmark:     { avg_price_lkr: 13000, threshold_lkr: 19000 },
 *   recommendation: "Request another bid or negotiate to market rate."
 * }
 */
router.post("/anomaly/check", checkAnomaly);

/**
 * POST /api/budget/anomaly/check-batch
 * Check all bids in marketplace compare view (max 20).
 *
 * Body:
 * {
 *   bids: [
 *     { bid_id: "b001", service_type: "van_full_day",  price_lkr: 65000 },
 *     { bid_id: "b002", service_type: "van_full_day",  price_lkr: 13000 },
 *     { bid_id: "b003", service_type: "guide_per_day", price_lkr: 6000  }
 *   ]
 * }
 */
router.post("/anomaly/check-batch", checkAnomalyBatch);

/**
 * POST /api/budget/anomaly/validate
 * Validate a single bid before saving it to the database.
 *
 * Body: { bidId: "b001", serviceType: "tuk_tuk_per_km", priceLKR: 450 }
 */
router.post("/anomaly/validate", validateBid);

/**
 * GET /api/budget/fair-price/:serviceType
 * Get market price range for a service type (shown in marketplace UI).
 *
 * Example: GET /api/budget/fair-price/van_full_day
 */
router.get("/fair-price/:serviceType", getFairPrice);

export default router;