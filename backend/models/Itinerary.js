import mongoose from 'mongoose';

// Activity Schema
const ActivitySchema = new mongoose.Schema({
    time:           { type: String },
    name:           { type: String, required: true },
    location:       { type: String },
    type:           { type: String, enum: ['sightseeing', 'food', 'transport', 'accommodation', 'activity'] },
    estimated_cost: { type: Number, default: 0 },
    actual_cost:    { type: Number, default: 0 },
    notes:          { type: String },
    completed:      { type: Boolean, default: false },
});

// Daily Plan Schema
const DailyPlanSchema = new mongoose.Schema({
    day:             { type: Number, required: true },
    date:            { type: Date },
    is_travel_day:   { type: Boolean, default: false },
    location:        { type: String },
    total_lkr:       { type: Number, default: 0 },
    transport_lkr:   { type: Number, default: 0 },
    food_lkr:        { type: Number, default: 0 },
    stay_lkr:        { type: Number, default: 0 },
    activity_lkr:    { type: Number, default: 0 },
    emergency_lkr:   { type: Number, default: 0 },
    actual_spent:    { type: Number, default: 0 },
    activities:      [ActivitySchema],
    // Images for this day's location (fetched from MongoDB instead of external API)
    images:          [{ type: String }],
});

// Main Itinerary Schema
const ItinerarySchema = new mongoose.Schema({
    tourist_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title:          { type: String, default: 'My Sri Lanka Tour' },
    start_date:     { type: Date, required: true },
    end_date:       { type: Date, required: true },
    num_days:       { type: Number, required: true },
    total_budget_lkr:   { type: Number, required: true },
    total_spent_lkr:    { type: Number, default: 0 },
    currency:           { type: String, default: 'LKR' },
    preference:         { type: String, enum: ['budget', 'mid-range', 'luxury'], default: 'mid-range' },
    tourist_profile: {
        age:          { type: Number },
        nationality:  { type: String },
        interest:     { type: String },
        budget_level: { type: String, enum: ['low', 'medium', 'high'] },
    },
    allocations: {
        transport:  { type: Number },
        food:       { type: Number },
        stay:       { type: Number },
        activity:   { type: Number },
        emergency:  { type: Number },
    },
    daily_plan: [DailyPlanSchema],
    recommendations: [{
        destination:    { type: String },
        category:       { type: String },
        tags:           { type: String },
        entry_fee_lkr:  { type: Number },
        avg_rating:     { type: Number },
    }],
    status: {
        type: String,
        enum: ['draft', 'active', 'completed', 'cancelled'],
        default: 'draft',
    },
    final_report: {
        generated:          { type: Boolean, default: false },
        generated_at:       { type: Date },
        total_savings_lkr:  { type: Number, default: 0 },
        places_visited:     { type: Number, default: 0 },
        distance_km:        { type: Number, default: 0 },
        highlights:         [{ type: String }],
    },
}, { timestamps: true });

const Itinerary = mongoose.model('Itinerary', ItinerarySchema);

export default Itinerary;