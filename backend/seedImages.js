// ══════════════════════════════════════════════════════════════════════════════
// Seed Images Script
// Smart Virtual Tourist Guide — Sri Lanka
// Location: backend/seedImages.js
// Purpose: Add location-based image URLs to existing itinerary daily_plan
// Run: node seedImages.js
// ══════════════════════════════════════════════════════════════════════════════

require('dotenv').config();
const mongoose = require('mongoose');
const Itinerary = require('./models/Itinerary');

// ── Location Image Map ─────────────────────────────────────────────────────
// Real Unsplash images hand-picked to match each day's activities
const locationImages = {
    'Colombo': [
        'https://images.unsplash.com/photo-1517400508447-f8dd518b86db?w=400',   // Airport
        'https://images.unsplash.com/photo-1660557989695-14fac79c086d?w=400',   // Galle Face Green
        'https://images.unsplash.com/photo-1602016082275-1c502e6d8100?w=400',   // Hotel
        'https://images.unsplash.com/photo-1630140198466-10ef7334b4d4?w=400',   // Ministry of Crab / seafood
    ],
    'Kandy': [
        'https://images.unsplash.com/photo-1665849050332-8d5d7e59afb6?w=400',   // Temple of the Tooth
        'https://images.unsplash.com/photo-1676360109561-df0bb43925fb?w=400',   // Royal Botanical Gardens
        'https://images.unsplash.com/photo-1647495248190-025cf9eb1ce2?w=400',   // Cultural dance show
        'https://images.unsplash.com/photo-1649853762237-7ef38a6ea6c0?w=400',   // Kandy mountains/general
    ],
    'Sigiriya': [
        'https://images.unsplash.com/photo-1612862862126-865765df2ded?w=400',   // Sigiriya Rock Fortress
        'https://images.unsplash.com/photo-1756670164679-83f5fa92d1e1?w=400',   // Dambulla Cave Temple
        'https://images.unsplash.com/photo-1742281095661-29de44440bb6?w=400',   // Local restaurant food
        'https://images.unsplash.com/photo-1700599771609-8e235c52ae77?w=400',   // Lion Rock landscape
    ],
    // Default fallback for any other location not yet added
    'default': [
        'https://images.unsplash.com/photo-1612862862126-865765df2ded?w=400',
        'https://images.unsplash.com/photo-1665849050332-8d5d7e59afb6?w=400',
        'https://images.unsplash.com/photo-1517400508447-f8dd518b86db?w=400',
        'https://images.unsplash.com/photo-1660557989695-14fac79c086d?w=400',
    ],
};

// ── Get images for a location ──────────────────────────────────────────────
const getImagesForLocation = (location) => {
    if (!location) return locationImages['default'];
    // Try exact match first
    if (locationImages[location]) return locationImages[location];
    // Try partial match (e.g. "Sigiriya Rock" → "Sigiriya")
    const key = Object.keys(locationImages).find(k =>
        location.toLowerCase().includes(k.toLowerCase()) ||
        k.toLowerCase().includes(location.toLowerCase())
    );
    return key ? locationImages[key] : locationImages['default'];
};

// ── Main seed function ─────────────────────────────────────────────────────
const seedImages = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Get all itineraries
        const itineraries = await Itinerary.find({});
        console.log(`📋 Found ${itineraries.length} itinerary/itineraries`);

        let updatedCount = 0;

        for (const itinerary of itineraries) {
            let updated = false;

            // Update images for each day in daily_plan
            itinerary.daily_plan = itinerary.daily_plan.map((day) => {
                const images = getImagesForLocation(day.location);
                day.images = images;
                updated = true;
                console.log(`  📸 Day ${day.day} (${day.location}) → ${images.length} images added`);
                return day;
            });

            if (updated) {
                await itinerary.save();
                updatedCount++;
                console.log(`✅ Itinerary ${itinerary._id} updated`);
            }
        }

        console.log(`\n🎉 Done! ${updatedCount} itinerary/itineraries updated with images.`);
        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding images:', error.message);
        process.exit(1);
    }
};

seedImages();