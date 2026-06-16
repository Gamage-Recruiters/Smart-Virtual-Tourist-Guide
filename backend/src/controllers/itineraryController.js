const Itinerary = require('../models/Itinerary');

const getItineraryById = async (req, res) => {
    try {
        
        const { touristId, tripId } = req.params;

        const itinerary = await Itinerary.findOne({ 
            _id: tripId, 
            tourist_id: touristId 
        });
        
        if (!itinerary) {
            return res.status(404).json({ 
                success: false, 
                message: "Itinerary not found" 
            });
        }
        
        return res.status(200).json({ 
            success: true, 
            data: itinerary 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

module.exports = {
    getItineraryById
};