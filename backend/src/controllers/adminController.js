// controllers/adminController.js
const bcrypt = require('bcryptjs');
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

// Fetch recent activities for the dashboard
const getRecentActivities = async (req, res) => {
    try {
        // Fetch the 5 most recently joined users
        const recentUsers = await User.find()
            .sort({ joinedDate: -1 })
            .limit(5);

        // Format the data to match the frontend requirements
        const activities = recentUsers.map(user => ({
            type: 'User Registration',
            description: `${user.name} joined from ${user.location || 'Sri Lanka'}`,
            time: user.joinedDate
        }));

        res.status(200).json({ success: true, activities });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add a new user to the system (For testing and admin data entry)
const createUser = async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ 
            success: true, 
            message: 'User created successfully', 
            user: newUser 
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
// Update user status (e.g., Approve a pending user or Suspend a user)
const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Ensure the status is valid
        const validStatuses = ['Active', 'Suspended', 'Pending'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }

        // Find user by ID and update the status
        const updatedUser = await User.findByIdAndUpdate(
            id, 
            { status }, 
            { new: true } // This returns the updated user data
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ 
            success: true, 
            message: `User status successfully updated to ${status}`, 
            user: updatedUser 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add New Admin Logic
// Add New Admin Logic
const addNewAdmin = async (req, res) => {
  try {
    const { 
      role, 
      fullName, 
      email, 
      phoneNumber, 
      location, 
      username, 
      password,
      permissions 
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !password || !username) {
      return res.status(400).json({ success: false, message: 'Required fields are missing.' });
    }

    // Check for existing user by email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email or Username already exists.' });
    }

    // Hash the password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Map frontend fields to database schema and save
    const newAdmin = new User({
      name: fullName,          // Mapping fullName to name
      email: email,
      phone: phoneNumber,      // Mapping phoneNumber to phone
      location: location,
      username: username,
      password: hashedPassword,
      role: role,
      permissions: permissions || [], 
      status: 'Active'
    });

    await newAdmin.save();

    res.status(201).json({ success: true, message: 'New Admin added successfully!' });

  } catch (error) {
    console.error("Error in addNewAdmin:", error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

module.exports = { 
    getDashboardStats, 
    getAllUsers, 
    getRecentActivities,
    createUser,
    updateUserStatus,
     addNewAdmin
};