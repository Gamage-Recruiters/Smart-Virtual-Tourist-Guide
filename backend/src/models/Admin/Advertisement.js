import mongoose from 'mongoose';

const advertisementSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, default: 'Banner Ad' },
    targetUrl: { type: String, required: true },
    budget: { type: Number, required: true },
    status: { type: String, enum: ['Active', 'Paused', 'Expired'], default: 'Active' },
    clicks: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model('Advertisement', advertisementSchema);