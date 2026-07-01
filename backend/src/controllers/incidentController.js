// @desc    Get count of incidents (optionally filtered by touristId)
// @route   GET /api/safety/incidents/count
// @access  Private (Report Generator/Tourist)
const Incident = require('../models/incident');

// const getIncidentCount = async (req, res, next) => {
//   try {
//     const { touristId, tripId } = req.query;

//     if (!touristId || !tripId) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Both touristId and tripId are required in query parameters" 
//       });
//     }

//     const count = await Incident.countDocuments({ touristId, tripId });
    
//     res.status(200).json({ success: true, count });
//   } catch (error) {
//     logger.error('Error fetching incident count:', error);
//     next(error);
//   }
// };

const getIncidentCount = async (req, res, next) => {
  try {
    const { touristId } = req.query;

    if (!touristId) {
      return res.status(400).json({ 
        success: false, 
        message: "touristId is required in query parameters" 
      });
    }

    const count = await Incident.countDocuments({ touristId });
    
    res.status(200).json({ success: true, count });
  } catch (error) {
    logger.error('Error fetching incident count:', error);
    next(error);
  }
};

module.exports = { getIncidentCount };