const User = require('../models/User');
const Admin = require('../models/Admin');

// Fetch dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const travelAgencies = await User.countDocuments({ role: 'Travel Agency' });
        const registeredDrivers = await User.countDocuments({ role: 'Driver' });
        const hotelPartners = await User.countDocuments({ role: 'Hotel Owner' });

        res.status(200).json({
            success: true,
            data: { totalUsers, travelAgencies, registeredDrivers, hotelPartners }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all users and admins combined for the management table
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').lean();
        const admins = await Admin.find({}).select('-password').lean();

        // Combine and format data to match frontend table requirements
        const combinedData = [...users, ...admins].sort((a, b) => {
            const dateA = new Date(a.createdAt || a.joinedDate);
            const dateB = new Date(b.createdAt || b.joinedDate);
            return dateB - dateA; // Sort by newest first
        });

        res.status(200).json({ success: true, users: combinedData });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error while fetching users' });
    }
};

// Update user or admin status safely
const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['Active', 'Suspended', 'Pending'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }

        // 1. Check User collection first
        let updatedAccount = await User.findByIdAndUpdate(id, { status }, { new: true });

        // 2. If not found in User, check Admin collection
        if (!updatedAccount) {
            if (status === 'Pending') {
                return res.status(400).json({ success: false, message: 'Admins cannot have Pending status' });
            }
            updatedAccount = await Admin.findByIdAndUpdate(id, { status }, { new: true });
        }

        if (!updatedAccount) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }

        res.status(200).json({ success: true, message: `Status updated to ${status}` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error while updating status' });
    }
};

module.exports = { 
    getDashboardStats, 
    getAllUsers, 
    updateUserStatus 
};