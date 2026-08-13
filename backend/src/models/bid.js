import mongoose from 'mongoose';

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

export default mongoose.model('Bid', bidSchema);