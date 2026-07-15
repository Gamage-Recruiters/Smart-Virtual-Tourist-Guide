import mongoose from 'mongoose';

const roomAvailabilitySchema = new mongoose.Schema(
    {
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
            required: true,
        },
        date: {
            type: Date, // always normalized to midnight UTC for that calendar day
            required: true,
        },
        status: {
            type: String,
            enum: ['Available', 'Non Available', 'Maintenance'],
            default: 'Available',
        },
        note: {
            type: String,
            default: '', // e.g. "Booked - John Doe" or "AC repair"
        },
    },
    { timestamps: true },
);

// Only one status record per room per date
roomAvailabilitySchema.index({ room: 1, date: 1 }, { unique: true });

export default mongoose.model('RoomAvailability', roomAvailabilitySchema);
