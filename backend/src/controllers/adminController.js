const User = require('../models/User');
const Admin = require('../models/Admin');
const Booking = require("../models/Booking");
const Package = require("../models/Package");
const Advertisement = require('../models/Advertisement');
// Fetch dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        // Run queries concurrently for high performance
        const [totalUsers, travelAgencies, registeredDrivers, hotelPartners] = await Promise.all([
            User.countDocuments({}), 
            User.countDocuments({ role: { $in: ['Travel Agency', 'TRAVEL_AGENCY'] } }), 
            User.countDocuments({ role: { $in: ['Driver', 'DRIVER'] } }), 
            User.countDocuments({ role: { $in: ['Hotel Owner', 'HOTEL_OWNER'] } })
        ]);

        // Structuring the response exactly as Frontend expects
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
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ success: false, message: 'Server error while fetching analytics' });
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
// Get all ads with optional status filter
const getAllAds = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};
        const ads = await Advertisement.find(filter).sort({ createdAt: -1 });
        
        res.status(200).json({ success: true, data: ads });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error fetching ads' });
    }
};

// Update Ad Status (Active/Paused)
const updateAdStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const updatedAd = await Advertisement.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedAd) return res.status(404).json({ success: false, message: 'Ad not found' });

        res.status(200).json({ success: true, message: `Ad marked as ${status}`, data: updatedAd });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating ad' });
    }
};
// Create a new advertisement
const createAdvertisement = async (req, res) => {
    try {
        const { title, description, type, budget, startDate, endDate, imageUrl } = req.body;

        // Create new Ad object
        const newAd = new Advertisement({
            title,
            description,
            companyName: 'System Admin', // Fallback for required fields
            targetUrl: '#',
            type, // Banner Ad, Sidebar Ad etc.
            // Remove any '$' or letters from budget if user typed them
            budget: Number(budget.toString().replace(/[^0-9.-]+/g,"")), 
            startDate,
            endDate,
            // If no image uploaded, use a nice default travel image
            imageUrl: imageUrl || 'https://images.unsplash.com/photo-1544473244-f6895e69ce8d?w=800&q=80',
            status: 'Active',
            clicks: 0,
            impressions: 0
        });

        await newAd.save();
        res.status(201).json({ success: true, message: 'Advertisement created successfully', data: newAd });
    } catch (error) {
        console.error("Create Ad Error:", error);
        res.status(500).json({ success: false, message: 'Server error while creating advertisement' });
    }
};
// Get single advertisement by ID for viewing/editing
const getAdvertisementById = async (req, res) => {
    try {
        const ad = await Advertisement.findById(req.params.id);
        if (!ad) {
            return res.status(404).json({ success: false, message: 'Advertisement not found' });
        }
        res.status(200).json({ success: true, data: ad });
    } catch (error) {
        console.error("Get Ad By ID Error:", error);
        res.status(500).json({ success: false, message: 'Server error fetching advertisement' });
    }
};

// Update an existing advertisement
const updateAdvertisement = async (req, res) => {
    try {
        const updatedAd = await Advertisement.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedAd) {
            return res.status(404).json({ success: false, message: 'Advertisement not found' });
        }
        res.status(200).json({ success: true, message: 'Advertisement updated successfully', data: updatedAd });
    } catch (error) {
        console.error("Update Ad Error:", error);
        res.status(500).json({ success: false, message: 'Server error updating advertisement' });
    }
};

// Delete an advertisement
const deleteAdvertisement = async (req, res) => {
    try {
        await Advertisement.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Ad deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting ad' });
    }
};
// Delete a user or admin account permanently
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Check and delete from User collection first
        let deletedAccount = await User.findByIdAndDelete(id);

        // 2. If not found in User, check and delete from Admin collection
        if (!deletedAccount) {
            deletedAccount = await Admin.findByIdAndDelete(id);
        }

        if (!deletedAccount) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }

        res.status(200).json({ success: true, message: 'Account successfully deleted' });
    } catch (error) {
        console.error("Delete User Error:", error);
        res.status(500).json({ success: false, message: 'Server error while deleting account' });
    }
};

// ===============================
// Dashboard Analytics
// GET /admin/dashboard-analytics
// ===============================
const getDashboardAnalytics = async (req, res) => {
    try {
        // Monthly Revenue
        const revenue = await Booking.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    revenue: { $sum: "$pricing.total" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // Monthly Bookings
        const bookings = await Booking.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    bookings: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // Package Categories
        const packagePerformance = await Package.aggregate([
            { $unwind: "$BasicInformation.categories" },
            {
                $group: {
                    _id: "$BasicInformation.categories",
                    value: { $sum: 1 }
                }
            },
            { $sort: { value: -1 } }
        ]);

        // User Roles
        const userDistribution = await User.aggregate([
            {
                $group: {
                    _id: "$role",
                    value: { $sum: 1 }
                }
            }
        ]);

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Format Data for Charts
        const revenueChart = months.map((month, index) => {
            const item = revenue.find(r => r._id === index + 1);
            return { name: month, revenue: item ? item.revenue : 0 };
        });

        const bookingChart = months.map((month, index) => {
            const item = bookings.find(r => r._id === index + 1);
            return { name: month, bookings: item ? item.bookings : 0 };
        });

        res.json({
            success: true,
            data: {
                revenueChart,
                bookingChart,
                packagePerformance: packagePerformance.map(item => ({
                    name: item._id,
                    value: item.value
                })),
                userDistribution: userDistribution.map(item => ({
                    name: item._id,
                    value: item.value
                }))
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to load dashboard analytics"
        });
    }
};

module.exports = { 
    getDashboardStats, 
    getAllUsers, 
    updateUserStatus,
    getAllAds,
    updateAdStatus,
    createAdvertisement,
    getAdvertisementById,
    updateAdvertisement,
    deleteAdvertisement,
    getDashboardAnalytics,
    deleteUser
};