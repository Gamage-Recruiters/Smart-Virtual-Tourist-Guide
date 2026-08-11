const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
    tripId: 
    { 
        type: String, 
        required: true 
    },
    driverName: 
    { 
        type: String, 
        required: true 
    },
    bidAmount: 
    { 
        type: Number, 
        required: true 
    },
    createdAt: 
    {
         type: Date, 
         default: Date.now 
    }
});

module.exports = mongoose.model('Bid', bidSchema);