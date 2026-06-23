const mongoose = require('mongoose');

const TripFeedbackSchema = new mongoose.Schema({
    
    touristId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tourist',
        required: true,
        index: true
    },

    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true,
        index: true
    },

    overallRating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },

    feedbackText: {
        type: String,
        required: false,
        trim: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TripFeedback', TripFeedbackSchema);