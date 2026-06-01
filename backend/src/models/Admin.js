const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    fullName: { type: String, required: [true, 'Please add a full name'], trim: true },
    email: { type: String, required: [true, 'Please add an email'], unique: true, lowercase: true, trim: true },
    phoneNumber: { type: String, required: [true, 'Please add a phone number'] },
    location: { type: String, default: '' },
    username: { type: String, required: [true, 'Please add a username'], unique: true, trim: true },
    password: { type: String, required: [true, 'Please add a password'], minlength: 8, select: false },
    role: { 
        type: String, 
        enum: ['Administrator', 'Moderator', 'Editor'], 
        default: 'Administrator' 
    },
    permissions: { type: [String], default: [] },
    status: { 
        // Changed from isActive to match the User model architecture
        type: String,
        enum: ['Active', 'Suspended'],
        default: 'Active'
    }
}, { timestamps: true });

// Encrypt password using bcrypt before saving to database
adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password in database
adminSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);