const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    providerName: { type: String, required: true },
    providerInitial: { type: String }, 
    type: { 
        type: String, 
        enum: ['Hotel', 'Transport', 'Guide', 'Activity', 'Package'], 
        required: true 
    },
    description: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: String, required: true },
    rating: { type: String, default: "0.0" },
    verificationScore: { type: String, default: "0% Verified" },
    tags: [{ type: String }], 
    since: { type: String },
    status: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Rejected'], 
        default: 'Pending' 
    },
    imageUrl: { type: String },
    
    // --- අලුතින් එකතු කළ Tracking Fields ---
    approvedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Admin' 
    },
    approvedAt: { 
        type: Date 
    },
    rejectedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Admin' 
    },
    rejectedAt: { 
        type: Date 
    },
    rejectionReason: { 
        type: String 
    }
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);