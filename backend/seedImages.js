import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

// ── Location Image Map ─────────────────────────────────────────────────────
const locationImages = {
    'Colombo': [
        'https://images.unsplash.com/photo-1517400508447-f8dd518b86db?w=400',
        'https://images.unsplash.com/photo-1660557989695-14fac79c086d?w=400',
        'https://images.unsplash.com/photo-1602016082275-1c502e6d8100?w=400',
        'https://images.unsplash.com/photo-1630140198466-10ef7334b4d4?w=400',
    ],
    'Kandy': [
        'https://images.unsplash.com/photo-1665849050332-8d5d7e59afb6?w=400',
        'https://images.unsplash.com/photo-1676360109561-df0bb43925fb?w=400',
        'https://images.unsplash.com/photo-1647495248190-025cf9eb1ce2?w=400',
        'https://images.unsplash.com/photo-1649853762237-7ef38a6ea6c0?w=400',
    ],
    'Sigiriya': [
        'https://images.unsplash.com/photo-1612862862126-865765df2ded?w=400',
        'https://images.unsplash.com/photo-1756670164679-83f5fa92d1e1?w=400',
        'https://images.unsplash.com/photo-1742281095661-29de44440bb6?w=400',
        'https://images.unsplash.com/photo-1700599771609-8e235c52ae77?w=400',
    ],
    'default': [
        'https://images.unsplash.com/photo-1612862862126-865765df2ded?w=400',
        'https://images.unsplash.com/photo-1665849050332-8d5d7e59afb6?w=400',
        'https://images.unsplash.com/photo-1517400508447-f8dd518b86db?w=400',
        'https://images.unsplash.com/photo-1660557989695-14fac79c086d?w=400',
    ],
};

const getImagesForLocation = (location) => {
    if (!location) return locationImages['default'];
    if (locationImages[location]) return locationImages[location];
    const key = Object.keys(locationImages).find(k =>
        location.toLowerCase().includes(k.toLowerCase()) ||
        k.toLowerCase().includes(location.toLowerCase())
    );
    return key ? locationImages[key] : locationImages['default'];
};

const seedImages = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const db         = mongoose.connection.db;
        const collection = db.collection('itineraries');
        const itineraries = await collection.find({}).toArray();
        console.log(`📋 Found ${itineraries.length} itinerary/itineraries`);

        for (const itinerary of itineraries) {
            const updatedDailyPlan = itinerary.daily_plan.map((day) => {
                const images = getImagesForLocation(day.location);
                console.log(`  📸 Day ${day.day} (${day.location}) → ${images.length} images added`);
                return { ...day, images };
            });

            await collection.updateOne(
                { _id: itinerary._id },
                { $set: { daily_plan: updatedDailyPlan } }
            );
            console.log(`✅ Itinerary ${itinerary._id} updated`);
        }

        console.log('\n🎉 Done! Images added to all itineraries.');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

seedImages();