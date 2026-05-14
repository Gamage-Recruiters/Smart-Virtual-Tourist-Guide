// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    location: { type: String },
    role: { 
        type: String, 
        enum: ['Tourist', 'Driver', 'Hotel Owner', 'Travel Agency', 'Admin'], 
        default: 'Tourist' 
    },
    status: { 
        type: String, 
        enum: ['Active', 'Suspended', 'Pending'], 
        default: 'Pending' 
    },
    joinedDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);