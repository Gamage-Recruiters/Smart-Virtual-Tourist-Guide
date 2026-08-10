const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const logger = require('../utils/logger'); 

const { SESSION_COOKIE_NAME } = require('../middleware/authMiddleware');

const SESSION_MAX_AGE_MS = 60 * 60 * 1000;

const ALLOWED_ADMIN_ROLES = ['Administrator', 'Moderator', 'Editor'];
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,128}$/;

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: SESSION_MAX_AGE_MS,
  path: '/',
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const registerAdmin = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, location = '', username, password, role = 'Administrator' } = req.body;

    if (!fullName || !email || !phoneNumber || !username || !password) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided.' });
    }

    if (!ALLOWED_ADMIN_ROLES.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid administrator role.' });
    }

    if (!PASSWORD_PATTERN.test(password)) {
      return res.status(400).json({ success: false, message: 'Password must be 8-128 characters and contain at least one letter and one number.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();

    const adminExists = await Admin.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });

    if (adminExists) {
      return res.status(409).json({ success: false, message: 'An administrator with this email or username already exists.' });
    }

    const admin = await Admin.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      phoneNumber: phoneNumber.trim(),
      location: location.trim(),
      username: normalizedUsername,
      password,
      role,
      status: 'Active',
    });

    return res.status(201).json({
      success: true,
      message: 'Administrator created successfully.',
      data: {
        _id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        username: admin.username,
        role: admin.role,
        status: admin.status,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'An administrator with this email or username already exists.' });
    }
    return res.status(500).json({ success: false, message: 'Server error during administrator creation.' });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    const admin = await Admin.findOne({ username: username.trim() }).select('+password');

    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    if (admin.status !== 'Active') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended. Please contact an administrator.' });
    }

    const token = generateToken(admin._id);

    res.cookie(SESSION_COOKIE_NAME, token, getCookieOptions());

    return res.status(200).json({
      success: true,
      data: {
        _id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        username: admin.username,
        role: admin.role,
        status: admin.status,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

const logoutAdmin = async (req, res) => {
  res.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

const getAdminProfile = async (req, res) => {
  return res.status(200).json({ success: true, data: req.admin });
};

module.exports = {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
};