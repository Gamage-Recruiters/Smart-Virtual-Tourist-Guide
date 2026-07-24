const Activity = require('../models/activity');

// Get all activities
const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find();
    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getActivities
};
