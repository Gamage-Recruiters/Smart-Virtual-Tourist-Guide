import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';
import { auth, firebaseInitialized } from '../configs/firebase.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const generateUsername = async (email) => {
  const base = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
  let username = base;
  let exists = await User.findOne({ username });
  let count = 1;
  while (exists) {
    username = `${base}${count}`;
    exists = await User.findOne({ username });
    count++;
  }
  return username;
};

const registerTourist = async (req, res) => {
  try {
    console.log('Registering tourist request body:', req.body);
    const { fullName, email, password, country, travelType, gender, travelPreferences, healthInfo, emergencyContact } = req.body;

    const emailNormalized = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: emailNormalized });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const username = await generateUsername(emailNormalized);

    const user = await User.create({
      fullName,
      username,
      email: emailNormalized,
      password,
      role: 'tourist_user',
      country,
      travelType,
      gender,
      travelPreferences,
      healthInfo,
      emergencyContact,
    });

    res.status(201).json({
      success: true,
      message: 'Tourist registered successfully',
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        country: user.country,
        travelType: user.travelType,
        gender: user.gender,
        travelPreferences: user.travelPreferences,
        healthInfo: user.healthInfo,
        emergencyContact: user.emergencyContact,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const registerHotelOwner = async (req, res) => {
  try {
    const { fullName, email, password, contactNumber } = req.body;

    const emailNormalized = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: emailNormalized });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const username = await generateUsername(emailNormalized);

    const user = await User.create({
      fullName,
      username,
      email: emailNormalized,
      password,
      role: 'hotelowner_user',
      contactNumber,
      hotels: [],
    });

    res.status(201).json({
      success: true,
      message: 'Hotel Owner registered successfully',
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        contactNumber: user.contactNumber,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const addHotelInfo = async (req, res) => {
  try {
    const { hotelName, hotelRegistrationNo, hotelAddress, hotelEmail, hotelRegisteredYear, hotelContactNumber } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.role !== 'hotelowner_user') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    user.hotels.push({ hotelName, hotelRegistrationNo, hotelAddress, hotelEmail, hotelRegisteredYear, hotelContactNumber });
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Hotel information added successfully',
      hotels: user.hotels,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const registerGuide = async (req, res) => {
  try {
    const { fullName, email, password, contactNumber, guideId, dob, gender } = req.body;

    const emailNormalized = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: emailNormalized });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const username = await generateUsername(emailNormalized);

    const user = await User.create({
      fullName,
      username,
      email: emailNormalized,
      password,
      role: 'guide_user',
      contactNumber,
      guideId,
      dob,
      gender
    });

    res.status(201).json({
      success: true,
      message: 'Guide registered successfully',
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        contactNumber: user.contactNumber,
        guideId: user.guideId,
        dob: user.dob,
        gender: user.gender
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const registerRestaurant = async (req, res) => {
  try {
    const { fullName, email, password, contactNumber } = req.body;

    const emailNormalized = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: emailNormalized });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const username = await generateUsername(emailNormalized);

    const user = await User.create({
      fullName,
      username,
      email: emailNormalized,
      password,
      role: 'restaurant_user',
      contactNumber
    });

    res.status(201).json({
      success: true,
      message: 'Restaurant registered successfully',
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        contactNumber: user.contactNumber
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const registerRenter = async (req, res) => {
  try {
    const { fullName, email, password, contactNumber } = req.body;

    const emailNormalized = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: emailNormalized });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const username = await generateUsername(emailNormalized);

    const user = await User.create({
      fullName,
      username,
      email: emailNormalized,
      password,
      role: 'renter_user',
      contactNumber
    });

    res.status(201).json({
      success: true,
      message: 'Renter registered successfully',
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        contactNumber: user.contactNumber
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const registerActivityProvider = async (req, res) => {
  try {
    const { fullName, email, password, contactNumber } = req.body;

    const emailNormalized = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: emailNormalized });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const username = await generateUsername(emailNormalized);

    const user = await User.create({
      fullName,
      username,
      email: emailNormalized,
      password,
      role: 'activityprovider_user',
      contactNumber
    });

    res.status(201).json({
      success: true,
      message: 'Activity Provider registered successfully',
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        contactNumber: user.contactNumber
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const registerGovernment = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const emailNormalized = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: emailNormalized });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const username = await generateUsername(emailNormalized);
    const fullName = `${firstName} ${lastName}`.trim();

    const user = await User.create({
      fullName,
      username,
      email: emailNormalized,
      password,
      role: 'government_user',
      firstName,
      lastName
    });

    res.status(201).json({
      success: true,
      message: 'Government representative registered successfully',
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const registerDriver = async (req, res) => {
  try {
    const { fullName, email, password, vehicleType, vehicleNumber, licenseNumber, contactNumber } = req.body;

    const emailNormalized = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: emailNormalized });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const username = await generateUsername(emailNormalized);

    // Extract image URLs from Multer (Cloudinary)
    const licenseImages = req.files?.licenseImages?.map(file => file.path) || [];
    const regBookImages = req.files?.regBookImages?.map(file => file.path) || [];
    const vehicleImages = req.files?.vehicleImages?.map(file => file.path) || [];

    const user = await User.create({
      fullName,
      username,
      email: emailNormalized,
      password,
      role: 'driver_user',
      vehicleType,
      vehicleNumber,
      licenseNumber,
      contactNumber,
      licenseImages,
      regBookImages,
      vehicleImages,
    });

    res.status(201).json({
      success: true,
      message: 'Driver registered successfully',
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        vehicleType: user.vehicleType,
        vehicleNumber: user.vehicleNumber,
        licenseNumber: user.licenseNumber,
        contactNumber: user.contactNumber,
        licenseImages: user.licenseImages,
        regBookImages: user.regBookImages,
        vehicleImages: user.vehicleImages,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const identifierTrimmed = identifier.trim();
    const user = await User.findOne({
      $or: [{ email: identifierTrimmed.toLowerCase() }, { username: identifierTrimmed }]
    });

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        user: {
          _id: user._id,
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          role: user.role,
          hotels: user.hotels || [],
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide an email address' });
    }

    // Check if the user email exists in the database
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: 'User with this email does not exist' });
    }

    // Generate a temporary JWT reset token valid for 30 minutes
    const resetToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendUrl}/create-password?token=${resetToken}`;
    
    // Log the reset link for development and testing verification
    console.log(`[PASS_RESET] Reset Link generated: ${resetLink}`);

    // Compose rich premium HTML email matching user design mockup
    const emailHtml = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #e8f1fd; padding: 40px 20px; text-align: center; min-height: 100%;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.06); border: 1px solid #e1ebf7; text-align: left; position: relative;">
          <!-- Top Decorative Wave Area (Simulated via CSS gradients) -->
          <div style="background: linear-gradient(135deg, #f0f7ff 0%, #e0f0ff 100%); padding: 30px; border-bottom: 1px solid #e8f2fc; position: relative;">
            <!-- Logo Title -->
            <div style="margin-bottom: 15px;">
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #7f8c8d; display: block; font-weight: bold; margin-bottom: 2px;">Smart Virtual Tourist Guide</span>
              <span style="font-size: 24px; font-weight: 800; letter-spacing: 2px;">
                <span style="color: #006600;">Sri</span> <span style="color: #cc0000;">Lanka</span>
              </span>
            </div>
            <div style="font-size: 18px; font-weight: bold; color: #2c3e50; margin-top: 10px; display: flex; align-items: center;">
              🔑 Reset Your Password - Smart Virtual Tourist Guide
            </div>
          </div>
          
          <!-- Content Body -->
          <div style="padding: 40px 30px; color: #34495e; font-size: 15px; line-height: 1.6;">
            <p style="font-size: 17px; font-weight: bold; color: #2c3e50; margin-top: 0; margin-bottom: 20px;">Hello Traveler 👏,</p>
            
            <p>We received a request to reset your password for your Smart Virtual Tourist Guide account.</p>
            <p style="margin-bottom: 25px;">If this was you, click the button below to reset your password:</p>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="display: inline-block; padding: 12px 40px; background-color: #aae0ff; color: #0a2540; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(170, 224, 255, 0.5); transition: all 0.2s ease;">Click Here!</a>
            </div>
            
            <p style="font-size: 13px; color: #7f8c8d; margin-top: 25px;">This link will expire in 30 minutes for security reasons.</p>
            
            <!-- Security Callout Box -->
            <div style="background-color: #fcf8e3; border-left: 4px solid #f0ad4e; padding: 15px; border-radius: 8px; margin: 25px 0; color: #8a6d3b; font-size: 14px;">
              <strong style="display: block; margin-bottom: 5px;">🔒 Security Note:</strong>
              Never share this link with anyone. Our team will never ask for your password.
            </div>
            
            <div style="margin-top: 35px; border-top: 1px solid #f1f2f6; padding-top: 20px;">
              <p style="margin: 0 0 5px 0; font-weight: bold; color: #2c3e50;">Thanks,</p>
              <p style="margin: 0 0 5px 0; font-weight: bold; color: #2c3e50;">Smart Virtual Tourist Guide Team 🇱🇰</p>
              <p style="margin: 0;"><a href="https://www.svtg.com" style="color: #3498db; text-decoration: none; font-weight: bold;">www.svtg.com</a></p>
            </div>
          </div>
        </div>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: 'Reset Your Password - Smart Virtual Tourist Guide',
      html: emailHtml
    });

    res.json({ message: 'Reset link sent to your inbox. Please check.' });
  } catch (error) {
    console.error('[PASS_RESET_ERROR]', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: 'Password reset link is invalid or has expired' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update password (pre-save hook will automatically hash it)
    user.password = password;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateTravelInfo = async (req, res) => {
  try {
    const { travelPreferences, healthInfo, emergencyContact } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.travelPreferences = travelPreferences;
    user.healthInfo = healthInfo;
    user.emergencyContact = emergencyContact;

    await user.save();

    res.json({
      success: true,
      message: 'Travel safety information updated successfully',
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        travelPreferences: user.travelPreferences,
        healthInfo: user.healthInfo,
        emergencyContact: user.emergencyContact
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const googleAuth = async (req, res) => {
  try {
    if (!firebaseInitialized) {
      return res.status(500).json({ 
        success: false, 
        message: 'Google Auth is not configured on this server. Please provide valid Firebase credentials in the backend .env file.' 
      });
    }

    const { idToken, role } = req.body;

    if (!idToken) {
      return res.status(400).json({ success: false, message: 'ID token is required' });
    }

    // Verify the Firebase ID token
    const decoded = await auth.verifyIdToken(idToken);
    const { email, name, uid } = decoded;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email not available from Google account' });
    }

    const emailNormalized = email.toLowerCase().trim();
    let user = await User.findOne({ email: emailNormalized });

    if (user) {
      // Existing user — login
      return res.json({
        success: true,
        user: { _id: user._id, fullName: user.fullName, email: user.email, role: user.role, hotels: user.hotels || [] },
        token: generateToken(user._id),
      });
    }

    // New user — register with provided role (or default tourist_user)
    const assignedRole = role || 'tourist_user';
    const username = await generateUsername(emailNormalized);

    user = await User.create({
      fullName: name || emailNormalized.split('@')[0],
      username,
      email: emailNormalized,
      password: uid,
      role: assignedRole,
      googleId: uid,
      contactNumber: '',
      hotels: [],
    });

    res.status(201).json({
      success: true,
      user: { _id: user._id, fullName: user.fullName, email: user.email, role: user.role, hotels: [] },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ success: false, message: 'Invalid or expired Google token' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export {
  loginUser,
  registerTourist,
  registerHotelOwner,
  registerGuide,
  registerRestaurant,
  registerRenter,
  registerActivityProvider,
  registerGovernment,
  registerDriver,
  forgotPassword,
  resetPassword,
  updateTravelInfo,
  addHotelInfo,
  googleAuth,
  getMe
};
