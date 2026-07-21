// ══════════════════════════════════════════════════════════════════════════════
// Itinerary Model
// Smart Virtual Tourist Guide — Sri Lanka
// Location: backend/models/Itinerary.js
// Used for: AI Generated Trip Plans — Final Trip Report
// ══════════════════════════════════════════════════════════════════════════════

import mongoose from 'mongoose';

// Activity Schema — each activity in a day
const ActivitySchema = new mongoose.Schema({
    time:           { type: String },                    // e.g. "09:00 AM"
    name:           { type: String, required: true },    // e.g. "Sigiriya Rock Fortress"
    location:       { type: String },                    // e.g. "Sigiriya"
    type:           { type: String, enum: ['sightseeing', 'food', 'transport', 'accommodation', 'activity'] },
    estimated_cost: { type: Number, default: 0 },        // in LKR
    actual_cost:    { type: Number, default: 0 },        // in LKR
    notes:          { type: String },
    completed:      { type: Boolean, default: false },
});

// Daily Plan Schema — one day of the trip
const DailyPlanSchema = new mongoose.Schema({
    day:             { type: Number, required: true },   // Day number e.g. 1, 2, 3
    date:            { type: Date },                     // Actual date
    is_travel_day:   { type: Boolean, default: false },  // First and last days
    location:        { type: String },                   // Main location for the day
    total_lkr:       { type: Number, default: 0 },       // Total budget for day
    transport_lkr:   { type: Number, default: 0 },       // Transport budget
    food_lkr:        { type: Number, default: 0 },       // Food budget
    stay_lkr:        { type: Number, default: 0 },       // Accommodation budget
    activity_lkr:    { type: Number, default: 0 },       // Activities budget
    emergency_lkr:   { type: Number, default: 0 },       // Emergency fund
    actual_spent:    { type: Number, default: 0 },       // Actual amount spent
    activities:      [ActivitySchema],                   // List of activities

    // ── Images for this day's location (added for TripItinerary UI) ────────
    // Store 4 image URLs per day based on location (e.g. Colombo, Kandy, Sigiriya)
    // These are fetched directly from DB instead of using an external API
    images: [{ type: String }],                          // Array of image URLs
});

// Main Itinerary Schema
const ItinerarySchema = new mongoose.Schema({

    // Tourist reference
    tourist_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    // Trip details
    title:          { type: String, default: 'My Sri Lanka Tour' },
    start_date:     { type: Date, required: true },
    end_date:       { type: Date, required: true },
    num_days:       { type: Number, required: true },

    // Budget details
    total_budget_lkr:   { type: Number, required: true },  // Planned budget
    total_spent_lkr:    { type: Number, default: 0 },      // Actual spent
    currency:           { type: String, default: 'LKR' },
    preference:         { type: String, enum: ['budget', 'mid-range', 'luxury'], default: 'mid-range' },

    // Tourist profile used for generation
    tourist_profile: {
        age:          { type: Number },
        nationality:  { type: String },
        interest:     { type: String },
        budget_level: { type: String, enum: ['low', 'medium', 'high'] },
    },

    // Budget allocation (from ML Budget Optimizer)
    allocations: {
        transport:  { type: Number },   // percentage e.g. 0.20
        food:       { type: Number },
        stay:       { type: Number },
        activity:   { type: Number },
        emergency:  { type: Number },
    },

    // Day-by-day plan (from ML Budget Optimizer)
    daily_plan: [DailyPlanSchema],

    // Recommended places (from ML Recommendation System)
    recommendations: [{
        destination:    { type: String },
        category:       { type: String },
        tags:           { type: String },
        entry_fee_lkr:  { type: Number },
        avg_rating:     { type: Number },
    }],

    // Trip status
    status: {
        type: String,
        enum: ['draft', 'active', 'completed', 'cancelled'],
        default: 'draft',
    },

    // Final report data
    final_report: {
        generated:          { type: Boolean, default: false },
        generated_at:       { type: Date },
        total_savings_lkr:  { type: Number, default: 0 },
        places_visited:     { type: Number, default: 0 },
        distance_km:        { type: Number, default: 0 },
        highlights:         [{ type: String }],
    },

}, { timestamps: true });

// ── API to get itinerary for Final Trip Report ─────────────────────────────
// GET /api/itinerary/:id
// Returns full itinerary with daily_plan, allocations, recommendations

export default mongoose.model('Itinerary', ItinerarySchema);