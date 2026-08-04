import * as budgetService from "../services/budgetService.js";
import * as anomalyService from "../services/anomalyService.js";

// ─────────────────────────────────────────────────────────────
// Helper: standardised API response format
// ─────────────────────────────────────────────────────────────
const sendSuccess = (res, data, statusCode = 200) =>
  res.status(statusCode).json({ success: true, data });

const sendError = (res, message, statusCode = 400) =>
  res.status(statusCode).json({ success: false, error: message });

// ─────────────────────────────────────────────────────────────
// POST /api/budget/optimize
//
// Called right after tourist completes Step 02 registration.
// Body: { startDate, endDate, budgetLKR, preferences[], tripStyle? }
//       budgetUSD is also accepted for backward compatibility.
// ─────────────────────────────────────────────────────────────
const optimizeBudget = async (req, res) => {
  try {
    const { userId, startDate, endDate, budgetLKR, budgetUSD, preferences, tripStyle, customWeights } = req.body;

    if (!startDate) return sendError(res, "startDate is required.");
    if (!endDate) return sendError(res, "endDate is required.");

    // Accept budgetLKR (new) or budgetUSD (legacy) — at least one must be present
    const rawBudget = budgetLKR ?? budgetUSD;
    if (!rawBudget) return sendError(res, "budgetLKR (or budgetUSD) is required.");
    if (isNaN(Number(rawBudget))) return sendError(res, "Budget must be a number.");
    if (Number(rawBudget) <= 0) return sendError(res, "Budget must be greater than 0.");

    const result = await budgetService.optimizeBudget({
      userId,
      startDate,
      endDate,
      budgetLKR: budgetLKR ? Number(budgetLKR) : null,
      budgetUSD: budgetLKR ? null : Number(budgetUSD),
      preferences: Array.isArray(preferences) ? preferences : [],
      tripStyle: tripStyle || null,
      customWeights: customWeights || null,
    });

    const dailySummary = budgetService.buildDailySummary(result);

    return sendSuccess(res, { allocation: result, daily_summary: dailySummary });
  } catch (err) {
    console.error("[budgetController.optimizeBudget]", err.message);
    return sendError(res, err.message, err.statusCode || 500);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/budget/allocation/:touristId
// ─────────────────────────────────────────────────────────────
const getBudgetAllocation = async (req, res) => {
  try {
    const { touristId } = req.params;
    if (!touristId) return sendError(res, "touristId param is required.");

    const result = await budgetService.getBudgetAllocation(touristId);
    if (!result) return sendError(res, "No budget allocation found.", 404);

    return sendSuccess(res, result);
  } catch (err) {
    console.error("[budgetController.getBudgetAllocation]", err.message);
    return sendError(res, err.message, err.statusCode || 500);
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/budget/guardian
//
// Called in real-time as tourist makes bookings.
// Body: { totalBudgetLKR, spentSoFarLKR }
// ─────────────────────────────────────────────────────────────
const checkGuardian = async (req, res) => {
  try {
    const { totalBudgetLKR, spentSoFarLKR } = req.body;

    if (totalBudgetLKR === undefined) return sendError(res, "totalBudgetLKR is required.");
    if (spentSoFarLKR === undefined) return sendError(res, "spentSoFarLKR is required.");

    const total = Number(totalBudgetLKR);
    const spent = Number(spentSoFarLKR);

    if (isNaN(total) || total <= 0) return sendError(res, "totalBudgetLKR must be a positive number.");
    if (isNaN(spent) || spent < 0) return sendError(res, "spentSoFarLKR cannot be negative.");
    if (spent > total) return sendError(res, "spentSoFarLKR cannot exceed totalBudgetLKR.");

    const result = await budgetService.checkBudgetGuardian(total, spent);
    return sendSuccess(res, result);
  } catch (err) {
    console.error("[budgetController.checkGuardian]", err.message);
    return sendError(res, err.message, err.statusCode || 500);
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/budget/recalculate
//
// Called when tourist updates dates or budget on their profile.
// Body: { touristId, startDate, endDate, budgetLKR, preferences[] }
//       budgetUSD is also accepted for backward compatibility.
// ─────────────────────────────────────────────────────────────
const recalculateBudget = async (req, res) => {
  try {
    const { touristId, startDate, endDate, budgetLKR, budgetUSD, preferences } = req.body;

    if (!touristId) return sendError(res, "touristId is required.");
    if (!startDate) return sendError(res, "startDate is required.");
    if (!endDate) return sendError(res, "endDate is required.");

    const rawBudget = budgetLKR ?? budgetUSD;
    if (!rawBudget) return sendError(res, "budgetLKR (or budgetUSD) is required.");

    const result = await budgetService.recalculateBudget(touristId, {
      startDate,
      endDate,
      budgetLKR: budgetLKR ? Number(budgetLKR) : null,
      budgetUSD: budgetLKR ? null : Number(budgetUSD),
      preferences: Array.isArray(preferences) ? preferences : [],
    });

    const dailySummary = budgetService.buildDailySummary(result);
    return sendSuccess(res, { allocation: result, daily_summary: dailySummary });
  } catch (err) {
    console.error("[budgetController.recalculateBudget]", err.message);
    return sendError(res, err.message, err.statusCode || 500);
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/budget/anomaly/check
//
// Called when a bid is submitted in the marketplace.
// Body: { serviceType, priceLKR }
// ─────────────────────────────────────────────────────────────
const checkAnomaly = async (req, res) => {
  try {
    const { serviceType, priceLKR } = req.body;

    if (!serviceType) return sendError(res, "serviceType is required.");
    if (priceLKR === undefined) return sendError(res, "priceLKR is required.");

    const price = Number(priceLKR);
    if (isNaN(price) || price <= 0) return sendError(res, "priceLKR must be a positive number.");

    const result = await anomalyService.checkBidAnomaly(serviceType, price);
    return sendSuccess(res, result);
  } catch (err) {
    console.error("[budgetController.checkAnomaly]", err.message);
    return sendError(res, err.message, err.statusCode || 500);
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/budget/anomaly/check-batch
//
// Called when tourist views all bids in marketplace compare view.
// Body: { bids: [{ bid_id, service_type, price_lkr }] }
// ─────────────────────────────────────────────────────────────
const checkAnomalyBatch = async (req, res) => {
  try {
    const { bids } = req.body;

    if (!Array.isArray(bids) || bids.length === 0)
      return sendError(res, "bids must be a non-empty array.");
    if (bids.length > 20)
      return sendError(res, "Maximum 20 bids per batch request.");

    const result = await anomalyService.checkBidsBatch(bids);
    return sendSuccess(res, result);
  } catch (err) {
    console.error("[budgetController.checkAnomalyBatch]", err.message);
    return sendError(res, err.message, err.statusCode || 500);
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/budget/anomaly/validate
//
// Gate-check before saving a bid to the database.
// Body: { bidId, serviceType, priceLKR }
// ─────────────────────────────────────────────────────────────
const validateBid = async (req, res) => {
  try {
    const { bidId, serviceType, priceLKR } = req.body;

    if (!bidId) return sendError(res, "bidId is required.");
    if (!serviceType) return sendError(res, "serviceType is required.");
    if (priceLKR === undefined) return sendError(res, "priceLKR is required.");

    const result = await anomalyService.validateBidPrice(bidId, serviceType, Number(priceLKR));
    return sendSuccess(res, result);
  } catch (err) {
    console.error("[budgetController.validateBid]", err.message);
    return sendError(res, err.message, err.statusCode || 500);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/budget/fair-price/:serviceType
//
// Returns market price range for a given service type.
// Used to show "fair price" hint in marketplace UI.
// ─────────────────────────────────────────────────────────────
const getFairPrice = async (req, res) => {
  try {
    const { serviceType } = req.params;
    if (!serviceType) return sendError(res, "serviceType param is required.");

    const result = await anomalyService.getFairPriceRange(serviceType);
    if (!result) return sendError(res, `No benchmark data for service type: ${serviceType}`, 404);

    return sendSuccess(res, result);
  } catch (err) {
    console.error("[budgetController.getFairPrice]", err.message);
    return sendError(res, err.message, err.statusCode || 500);
  }
};

export {
  optimizeBudget,
  getBudgetAllocation,
  checkGuardian,
  recalculateBudget,
  checkAnomaly,
  checkAnomalyBatch,
  validateBid,
  getFairPrice,
};