const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger'); // Assuming you have your logger here
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token will be valid for 30 days
  });
};

// @desc    Register a new admin
// @route   POST /api/admin/auth/register
// @access  Public (or you can restrict this later to only existing SuperAdmins)
const registerAdmin = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, location, username, password, role } = req.body;

    // Check if admin already exists by email or username
    const adminExists = await Admin.findOne({ $or: [{ email }, { username }] });

    if (adminExists) {
      return res.status(400).json({ message: 'Admin with this email or username already exists' });
    }

    // Create new admin
    const admin = await Admin.create({
      fullName,
      email,
      phoneNumber,
      location,
      username,
      password,
      role
    });

    if (admin) {
      logger.info(`New admin registered: ${admin.email}`);
      res.status(201).json({
        _id: admin.id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid admin data' });
    }
  } catch (error) {
    logger.error('Error in registerAdmin: ', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Authenticate admin & get token (Login)
// @route   POST /api/admin/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find admin by username (and explicitly select the password field)
    const admin = await Admin.findOne({ username }).select('+password');

    // Check if admin exists and password matches
    if (admin && (await admin.matchPassword(password))) {
      logger.info(`Admin logged in: ${admin.username}`);
      res.json({
        _id: admin.id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    logger.error('Error in loginAdmin: ', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};
// @desc    Get all users and admins combined for the management table
// @route   GET /api/admin/auth/users
// @access  Public
const getAllUsers = async (req, res) => {
  try {
    // 1. Fetch from User collection
    const users = await User.find({}).select('-password').lean();
    
    // 2. Fetch from Admin collection
    const admins = await Admin.find({}).select('-password').lean();

    // 3. Combine both arrays into one
    const combinedData = [...users, ...admins];

    // 4. Sort by date (Newest first)
    combinedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(combinedData);
  } catch (error) {
    console.error('Error fetching combined users: ', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};
// @desc    Toggle user/admin active status (Active <-> Suspended)
// @route   PUT /api/admin/auth/users/:id/status
// @access  Public
const toggleUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // 1. මුලින්ම සාමාන්‍ය User කෙනෙක්ද බලලා status එක මාරු කරනවා
    let account = await User.findById(userId);
    
    // 2. සාමාන්‍ය User කෙනෙක් නොවේ නම් Admin කෙනෙක්ද බලනවා
    if (!account) {
      account = await Admin.findById(userId);
    }

    if (account) {
      // දැනට තියෙන තත්ත්වය අනෙක් පැත්තට හරවනවා (true -> false හෝ false -> true)
      account.isActive = !account.isActive;
      await account.save();

      res.json({ 
        message: `Status updated successfully`, 
        isActive: account.isActive 
      });
    } else {
      res.status(404).json({ message: 'Account not found' });
    }
  } catch (error) {
    console.error('Error toggling status:', error);
    res.status(500).json({ message: 'Server error while updating status' });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAllUsers,
  toggleUserStatus,
};