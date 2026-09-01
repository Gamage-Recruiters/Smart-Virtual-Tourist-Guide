import mlClient from "./mlServices.js";

// ─────────────────────────────────────────────────────────────
// 1. CHECK SINGLE BID
//    Called when a provider submits a bid in the marketplace
// ─────────────────────────────────────────────────────────────

/**
 * Checks whether a single marketplace bid is overpriced.
 *
 * @param {string} serviceType  - e.g. "tuk_tuk_per_km", "van_full_day"
 * @param {number} priceLKR     - bid price in LKR
 *
 * @returns {Promise<Object>}
 *   {
 *     is_anomaly, ml_flagged, rule_flagged,
 *     confidence, benchmark,
 *     alert_message, recommendation
 *   }
 */
async function checkBidAnomaly(serviceType, priceLKR) {
  const { data } = await mlClient.post("/api/anomaly/check", {
    service_type: serviceType,
    price_lkr:    priceLKR,
  });
  return data.data;
}

// ─────────────────────────────────────────────────────────────
// 2. CHECK BATCH OF BIDS
//    Called when tourist views all bids for a marketplace request
// ─────────────────────────────────────────────────────────────

/**
 * Checks multiple bids at once — used in the marketplace compare view.
 *
 * @param {Array<{bid_id, service_type, price_lkr}>} bids
 *
 * @returns {Promise<Object>}
 *   {
 *     total_bids, anomalies_found, clean_bids,
 *     results: [{ bid_id, is_anomaly, alert_message, benchmark, ... }]
 *   }
 */
async function checkBidsBatch(bids) {
  if (!Array.isArray(bids) || bids.length === 0) {
    throw new Error("bids must be a non-empty array.");
  }

  const formatted = bids.map((b) => ({
    bid_id:       b.bid_id || b.bidId || String(Math.random()),
    service_type: b.service_type || b.serviceType,
    price_lkr:    b.price_lkr    || b.priceLKR,
  }));

  const { data } = await mlClient.post("/api/anomaly/check-batch", {
    bids: formatted,
  });

  return data;
}

// ─────────────────────────────────────────────────────────────
// 3. VALIDATE BID BEFORE SAVING
//    Gate-check: should we allow this bid to be stored?
// ─────────────────────────────────────────────────────────────

/**
 * Validates a bid before it is saved to the database.
 * Returns validation status — does NOT block saving,
 * but flags the bid so the tourist can see the warning.
 *
 * @param {string} bidId
 * @param {string} serviceType
 * @param {number} priceLKR
 *
 * @returns {Promise<Object>}
 */
async function validateBidPrice(bidId, serviceType, priceLKR) {
  const result = await checkBidAnomaly(serviceType, priceLKR);

  return {
    bid_id:        bidId,
    service_type:  serviceType,
    price_lkr:     priceLKR,
    is_valid:      true,
    is_flagged:    result.is_anomaly,
    confidence:    result.confidence,
    warning:       result.is_anomaly ? result.alert_message : null,
    recommendation: result.recommendation,
    benchmark:     result.benchmark,
  };
}

// ─────────────────────────────────────────────────────────────
// 4. GET FAIR PRICE RANGE
//    Returns market benchmark for a service type
// ─────────────────────────────────────────────────────────────

/**
 * Returns the market price range for a given service type.
 * Achieved by running a "normal" price check and extracting the benchmark.
 *
 * @param {string} serviceType
 * @returns {Promise<Object|null>}
 */
async function getFairPriceRange(serviceType) {
  const SAMPLE_PRICES = {
    tuk_tuk_per_km:          80,
    van_full_day:         13000,
    car_full_day:          9500,
    bus_intercity:           400,
    taxi_airport:           3500,
    hotel_budget:           4000,
    hotel_mid:             10000,
    hotel_luxury:          30000,
    activity_surf:          5000,
    activity_whale_watching: 6500,
    activity_sigiriya_entry: 5000,
    activity_safari:        10000,
    activity_cooking_class:  3500,
    guide_per_day:           6000,
    guide_half_day:          3000,
    meal_local:               400,
    meal_tourist:            1200,
    meal_fine_dining:        4000,
  };

  const samplePrice = SAMPLE_PRICES[serviceType];
  if (!samplePrice) return null;

  const result = await checkBidAnomaly(serviceType, samplePrice);
  return result.benchmark || null;
}

export {
  checkBidAnomaly,
  checkBidsBatch,
  validateBidPrice,
  getFairPriceRange,
};