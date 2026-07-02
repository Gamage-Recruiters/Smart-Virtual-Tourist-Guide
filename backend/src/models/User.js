const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: false
  },
  googleId: {
    type: String,
    trim: true,
    sparse: true
  },
  role: {
    type: String,
    enum: ['tourist_user', 'guide_user', 'hotelowner_user', 'restaurant_user', 'government_user', 'renter_user', 'driver_user', 'admin'],
    required: true
  },
  contactNumber: {
    type: String,
    trim: true
  },
  // Tourist specific fields
  country: {
    type: String,
    trim: true
  },
  travelType: {
    type: String,
    trim: true
  },
  travelPreferences: {
    travelStart: { type: Date },
    travelEnd: { type: Date },
    budgetRange: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: 'LKR' }
    },
    travelStyle: [String],
    accommodationType: { type: String }
  },
  healthInfo: {
    bloodType: { type: String },
    medicalCondition: { type: String }
  },
  emergencyContact: {
    name: { type: String },
    relationship: { type: String },
    country: { type: String }
  },
  // Hotel Owner specific fields — array to support multiple hotels per owner
  hotels: {
    type: [
      {
        hotelName: { type: String, trim: true },
        hotelRegistrationNo: { type: String, trim: true },
        hotelEmail: { type: String, trim: true, lowercase: true },
        hotelRegisteredYear: { type: String, trim: true },
        hotelContactNumber: { type: String, trim: true },
      }
    ],
    default: undefined
  },
  // Guide specific fields
  guideId: {
    type: String,
    trim: true
  },
  dob: {
    type: String,
    trim: true
  },
  gender: {
    type: String,
    trim: true
  },
  // Government specific fields
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  // Driver specific fields
  vehicleType: {
    type: String,
    trim: true
  },
  vehicleNumber: {
    type: String,
    trim: true
  },
  licenseNumber: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'users'
});

// Method to check password
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password.startsWith('$2')) {
    // Fallback for plain text passwords
    return enteredPassword === this.password;
  }
  
  // Standard bcrypt comparison
  return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save hook to hash password if it's modified
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;
