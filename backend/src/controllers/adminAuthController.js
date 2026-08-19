import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const ALLOWED_ADMIN_ROLES = ['Administrator', 'Moderator', 'Editor'];
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,128}$/;

const generateToken = (id) => {
  return jwt.sign({ id, tokenType: 'admin' }, process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET, { expiresIn: '1h' });
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

    return res.status(200).json({
      success: true,
      token,
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

const getAdminProfile = async (req, res) => {
  return res.status(200).json({ success: true, data: req.admin });
};

export {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
};
