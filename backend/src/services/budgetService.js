const mlClient = require("./mlServices");

// ─────────────────────────────────────────────────────────────
// Preference chip → trip_style mapping
// Matches the chips shown on the registration form (Step 02)
// ─────────────────────────────────────────────────────────────
const PREFERENCE_TO_STYLE = {
  Adventure:     "budget",
  Nature:        "budget",
  Cultural:      "comfort",
  Historical:    "comfort",
  "Food & Dining": "comfort",
  Relaxation:    "luxury",
  Beach:         "luxury",
  Shopping:      "balanced",
  Photography:   "balanced",
  Nightlife:     "balanced",
};

const USD_TO_LKR = parseFloat(process.env.USD_TO_LKR_RATE) || 320;

/**
 * Maps an array of preference chip selections to a single trip_style.
 * If multiple preferences map to different styles, picks the most common one.
 *
 * @param {string[]} preferences  - e.g. ["Adventure", "Nature", "Beach"]
 * @returns {string}              - "budget" | "comfort" | "luxury" | "balanced"
 */
function mapPreferencesToStyle(preferences = []) {
  const counts = { budget: 0, comfort: 0, luxury: 0, balanced: 0 };
  preferences.forEach((pref) => {
    const style = PREFERENCE_TO_STYLE[pref] || "balanced";
    counts[style]++;
  });
  return Object.keys(counts).reduce((a, b) => (counts[a] >= counts[b] ? a : b));
}

/**
 * Calculates number of days between two date strings.
 *
 * @param {string} startDate  - ISO date string "YYYY-MM-DD"
 * @param {string} endDate    - ISO date string "YYYY-MM-DD"
 * @returns {number}
 */
function calculateNumDays(startDate, endDate) {
  const start = new Date(startDate);
  const end   = new Date(endDate);
  const diff  = Math.round((end - start) / (1000 * 60 * 60 * 24));
  if (diff <= 0) throw new Error("End date must be after start date.");
  return diff;
}

// ─────────────────────────────────────────────────────────────
// 1. OPTIMIZE BUDGET
//    Called after tourist completes Step 02 registration form
// ─────────────────────────────────────────────────────────────

/**
 * Generates a personalized budget allocation plan by calling the ML API.
 *
 * @param {Object} params
 * @param {string}   params.startDate      - from Start Date picker
 * @param {string}   params.endDate        - from End Date picker
 * @param {number}   params.budgetUSD      - from Budget Range slider (USD)
 * @param {string[]} params.preferences    - from Travel Preferences chips
 * @param {string}   [params.tripStyle]    - optional override
 * @param {Object}   [params.customWeights]- optional custom category weights
 *
 * @returns {Promise<Object>} allocation plan from ML model
 */
async function optimizeBudget({
  startDate,
  endDate,
  budgetUSD,
  preferences = [],
  tripStyle = null,
  customWeights = null,
}) {
  const numDays      = calculateNumDays(startDate, endDate);
  const budgetLKR    = Math.round(budgetUSD * USD_TO_LKR);
  const resolvedStyle = tripStyle || mapPreferencesToStyle(preferences);

  const payload = {
    total_budget_lkr: budgetLKR,
    num_days:         numDays,
    trip_style:       resolvedStyle,
    ...(customWeights && { preferences: customWeights }),
  };

  const { data } = await mlClient.post("/api/budget/optimize", payload);

  return {
    ...data.data,
    meta: {
      budget_usd:   budgetUSD,
      start_date:   startDate,
      end_date:     endDate,
      preferences,
      usd_to_lkr:   USD_TO_LKR,
    },
  };
}

// ─────────────────────────────────────────────────────────────
// 2. BUDGET GUARDIAN
//    Called in real-time as tourist makes bookings
// ─────────────────────────────────────────────────────────────

/**
 * Checks current spending against total budget and returns alert level.
 *
 * @param {number} totalBudgetLKR   - tourist's total budget in LKR
 * @param {number} spentSoFarLKR    - amount spent so far in LKR
 *
 * @returns {Promise<Object>}  { alert_level, percent_used, remaining_lkr, message }
 */
async function checkBudgetGuardian(totalBudgetLKR, spentSoFarLKR) {
  const { data } = await mlClient.post("/api/budget/check-guardian", {
    total_budget_lkr:   totalBudgetLKR,
    spent_so_far_lkr:   spentSoFarLKR,
  });
  return data.data;
}

// ─────────────────────────────────────────────────────────────
// 3. RECALCULATE BUDGET
//    Called when tourist updates their trip dates or budget
// ─────────────────────────────────────────────────────────────

/**
 * Recalculates budget allocation when tourist modifies trip details.
 * Convenience wrapper around optimizeBudget.
 */
async function recalculateBudget(touristId, updatedParams) {
  const result = await optimizeBudget(updatedParams);
  return { tourist_id: touristId, recalculated: true, ...result };
}

// ─────────────────────────────────────────────────────────────
// 4. GET DAILY BUDGET SUMMARY
//    Returns a simplified day-by-day budget view
// ─────────────────────────────────────────────────────────────

/**
 * Returns simplified daily budget breakdown for dashboard widget.
 *
 * @param {Object} allocationPlan  - result from optimizeBudget
 * @returns {Object}
 */
function buildDailySummary(allocationPlan) {
  const { daily_allocation, num_days, daily_budget_lkr, trip_style } = allocationPlan;

  return {
    trip_style,
    num_days,
    daily_budget_lkr,
    daily_breakdown: Object.entries(daily_allocation).map(([category, amount]) => ({
      category,
      daily_lkr:  amount,
      daily_usd:  +(amount / USD_TO_LKR).toFixed(2),
      percentage: +((amount / daily_budget_lkr) * 100).toFixed(1),
    })),
  };
}

module.exports = {
  optimizeBudget,
  checkBudgetGuardian,
  recalculateBudget,
  buildDailySummary,
  mapPreferencesToStyle,
  calculateNumDays,
  USD_TO_LKR,
};