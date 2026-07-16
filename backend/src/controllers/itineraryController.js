const Itinerary = require('../models/Itinerary');

const getItineraryById = async (req, res) => {
    try {

        const { touristId, tripId } = req.params;

        const itinerary = await Itinerary.findOne({
            _id: tripId,
            tourist_id: touristId
        });

        const trip_summary = generateTripSummary(itinerary);

        if (!itinerary) {
            return res.status(404).json({
                success: false,
                message: "Itinerary not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                itinerary,
                trip_summary
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getTripStats = async (req, res) => {
    try {
        const { touristId, tripId } = req.params;
        const itinerary = await Itinerary.findOne({ _id: tripId, tourist_id: touristId });

        if (!itinerary) return res.status(404).json({ success: false, message: "Itinerary not found" });

        const totalDistance = itinerary.final_report.distance_km || 0;

        const totalFood = itinerary.daily_plan.reduce((acc, day) =>
            acc + day.activities.filter(a => a.type === 'food' && a.completed).length, 0);

        const totalPlaces = itinerary.daily_plan.reduce((acc, day) =>
            acc + day.activities.filter(a => a.type === 'sightseeing' && a.completed).length, 0);

        const totalPhotos = itinerary.daily_plan.reduce((acc, day) => acc + (day.images ? day.images.length : 0), 0);

        res.status(200).json({
            success: true,
            data: { totalDistance, totalFood, totalPlaces, totalPhotos }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};




const generateTripSummary = (itinerary) => {
    const locations = [...new Set(itinerary.daily_plan.map(d => d.location).filter(Boolean))];
    const highlights = itinerary.final_report?.highlights || [];
    const placesVisited = itinerary.final_report?.places_visited || locations.length;
    const savedLKR = itinerary.final_report?.total_savings_lkr || 0;
    const savedUSD = Math.round(savedLKR / 300);

    // Build location string
    const locationStr = locations.length > 1
        ? `${locations.slice(0, -1).join(', ')} and ${locations[locations.length - 1]}`
        : locations[0] || 'Sri Lanka';

    // Build highlights string
    const highlightStr = highlights.length > 0
        ? highlights.slice(0, 2).join(', ')
        : 'exploring local culture and natural wonders';

    // Generate summary paragraph
    const summary = `Your journey through Sri Lanka was an incredible experience filled with cultural discoveries and natural wonders. From ${locationStr}, every destination offered unique insights into the rich heritage of this beautiful island nation. During your ${itinerary.num_days}-day adventure, you visited ${placesVisited} amazing places including highlights such as ${highlightStr}. The combination of historical sites, natural beauty, and warm hospitality created an unforgettable travel experience.${savedUSD > 0 ? ` You also managed to save $${savedUSD} under your planned budget — a great achievement!` : ''}`;

    return summary;
};


module.exports = {
    getItineraryById,
    getTripStats
};
