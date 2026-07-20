// ══════════════════════════════════════════════════════════════════════════════
// Seed Test Itinerary Data to MongoDB
// Run: node seedItinerary.js
// Location: backend/seedItinerary.js
// ══════════════════════════════════════════════════════════════════════════════

require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected! ✅'))
    .catch(err => console.log('Error:', err));

// Itinerary Schema
const ItinerarySchema = new mongoose.Schema({
    tourist_id:       { type: mongoose.Schema.Types.ObjectId },
    title:            { type: String },
    start_date:       { type: Date },
    end_date:         { type: Date },
    num_days:         { type: Number },
    total_budget_lkr: { type: Number },
    total_spent_lkr:  { type: Number },
    preference:       { type: String },
    tourist_profile:  { type: Object },
    allocations:      { type: Object },
    daily_plan:       { type: Array },
    recommendations:  { type: Array },
    status:           { type: String },
    final_report:     { type: Object },
}, { timestamps: true });

const Itinerary = mongoose.model('Itinerary', ItinerarySchema);

// Test itinerary data
const testItinerary = {
    tourist_id:       new mongoose.Types.ObjectId(),
    title:            'My Sri Lanka Tour',
    start_date:       new Date('2026-03-15'),
    end_date:         new Date('2026-03-25'),
    num_days:         10,
    total_budget_lkr: 160000,
    total_spent_lkr:  142000,
    preference:       'budget',
    tourist_profile: {
        age:          28,
        nationality:  'US',
        interest:     'history',
        budget_level: 'medium',
    },
    allocations: {
        transport:  0.20,
        food:       0.30,
        stay:       0.35,
        activity:   0.10,
        emergency:  0.05,
    },
    daily_plan: [
        {
            day:           1,
            date:          new Date('2026-03-15'),
            is_travel_day: true,
            location:      'Colombo',
            total_lkr:     26667,
            transport_lkr: 4000,
            food_lkr:      9333,
            stay_lkr:      8000,
            activity_lkr:  4000,
            emergency_lkr: 1333,
            actual_spent:  24000,
            activities: [
                { time: '2:30 PM', name: 'Arrival at Bandaranaike Airport',  type: 'transport',      estimated_cost: 0,    completed: true },
                { time: '4:30 PM', name: 'Check-in at Cinnamon Grand Hotel', type: 'accommodation',  estimated_cost: 8000, completed: true },
                { time: '6:30 PM', name: 'Galle Face Green sunset walk',     type: 'sightseeing',    estimated_cost: 0,    completed: true },
                { time: '8:30 PM', name: 'Dinner at Ministry of Crab',       type: 'food',           estimated_cost: 4500, completed: true },
            ],
        },
        {
            day:           2,
            date:          new Date('2026-03-16'),
            is_travel_day: false,
            location:      'Kandy',
            total_lkr:     20513,
            transport_lkr: 3077,
            food_lkr:      7180,
            stay_lkr:      6154,
            activity_lkr:  3077,
            emergency_lkr: 1025,
            actual_spent:  19500,
            activities: [
                { time: '8:00 AM',  name: 'Drive to Kandy (3.5 hours)',       type: 'transport',   estimated_cost: 3000, completed: true },
                { time: '12:00 PM', name: 'Visit Temple of the Tooth',        type: 'sightseeing', estimated_cost: 1500, completed: true },
                { time: '3:00 PM',  name: 'Royal Botanical Gardens tour',     type: 'sightseeing', estimated_cost: 500,  completed: true },
                { time: '7:00 PM',  name: 'Cultural dance show',              type: 'activity',    estimated_cost: 1500, completed: true },
            ],
        },
        {
            day:           3,
            date:          new Date('2026-03-17'),
            is_travel_day: false,
            location:      'Sigiriya',
            total_lkr:     22564,
            transport_lkr: 3385,
            food_lkr:      7897,
            stay_lkr:      6769,
            activity_lkr:  3385,
            emergency_lkr: 1128,
            actual_spent:  21000,
            activities: [
                { time: '6:00 AM',  name: 'Drive to Sigiriya',               type: 'transport',   estimated_cost: 2000, completed: true },
                { time: '8:00 AM',  name: 'Climb Sigiriya Rock Fortress',     type: 'sightseeing', estimated_cost: 4500, completed: true },
                { time: '1:00 PM',  name: 'Lunch at local restaurant',        type: 'food',        estimated_cost: 1500, completed: true },
                { time: '3:00 PM',  name: 'Visit Dambulla Cave Temple',       type: 'sightseeing', estimated_cost: 1500, completed: true },
            ],
        },
    ],
    recommendations: [
        { destination: 'Sigiriya',    category: 'Heritage', tags: 'history,nature,adventure', entry_fee_lkr: 4500, avg_rating: 4.8 },
        { destination: 'Ella',        category: 'Nature',   tags: 'nature,adventure,scenic',  entry_fee_lkr: 0,    avg_rating: 4.6 },
        { destination: 'Kandy',       category: 'Cultural', tags: 'culture,history,temple',   entry_fee_lkr: 1500, avg_rating: 4.5 },
        { destination: 'Mirissa',     category: 'Beach',    tags: 'beach,nature,relaxation',  entry_fee_lkr: 0,    avg_rating: 4.4 },
        { destination: 'Galle',       category: 'Heritage', tags: 'history,culture,beach',    entry_fee_lkr: 0,    avg_rating: 4.3 },
    ],
    status: 'completed',
    final_report: {
        generated:         true,
        generated_at:      new Date(),
        total_savings_lkr: 18000,
        places_visited:    3,
        distance_km:       127,
        highlights:        ['Climbed Sigiriya Rock', 'Visited Temple of the Tooth', 'Sunset at Galle Face Green'],
    },
};

// Save to MongoDB
const seedData = async () => {
    try {
        const itinerary = new Itinerary(testItinerary);
        const saved = await itinerary.save();
        console.log('✅ Test itinerary saved to MongoDB!');
        console.log(`📋 Itinerary ID: ${saved._id}`);
        console.log(`\n👉 Use this ID in your frontend:`);
        console.log(`   <TripItinerary itineraryId="${saved._id}" />`);
        mongoose.connection.close();
    } catch (err) {
        console.error('Error saving itinerary:', err);
        mongoose.connection.close();
    }
};

seedData();