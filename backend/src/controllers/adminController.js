// controllers/adminController.js
const User = require('../models/User');


const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const travelAgencies = await User.countDocuments({ role: 'Travel Agency' });
        const registeredDrivers = await User.countDocuments({ role: 'Driver' });
        const hotelPartners = await User.countDocuments({ role: 'Hotel Owner' });

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                travelAgencies,
                registeredDrivers,
                hotelPartners
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ joinedDate: -1 });
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getDashboardStats, getAllUsers };