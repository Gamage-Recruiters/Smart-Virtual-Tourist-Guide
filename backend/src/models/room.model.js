const mongoose = require('mongoose');

const datePeriodSchema = new mongoose.Schema(
    {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
    },
    { _id: true }
);

const bookingDateSchema = new mongoose.Schema(
    {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        note: { type: String, default: '' },
    },
    { _id: true }
);

const roomSchema = new mongoose.Schema({
    hotelId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    roomNumber: {
        type: String,
    },
    roomName: {
        type: String,
        required: true,
    },
    roomType: {
        type: String,
        enum: [
            'Single Room',
            'Double Room',
            'Twin Room',
            'Queen Room',
            'King Room',
            'Deluxe Double Room',
            'Family Room / Quad Room',
        ],
        required: true,
    },
    roomSize: {
        type: Number,
        required: true,
    },
    measureType: {
        type: String,
        enum: ['sqm', 'sqft'],
        required: true,
    },
    capacity: {
        adults: {
            type: Number,
            required: true,
            min: 0,
        },
        children: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    amenities: {
        type: [String],
        default: [],
    },
    description: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        default: [],
    },
    contactInfo: {
        contactName: { type: String, required: true },
        contactNumber: { type: String, required: true },
        email: { type: String, required: true },
    },
    locationAndPricing: [
        {
            aboutLocation: { type: String, default: '' },
            basePrice: { type: Number, required: true },
            paymentMethods: {
                type: [String],
                enum: ['Card Payment', 'Online Payment', 'Cash Payment(Pay at Hotel)'],
                required: true,
            },
        },
    ],
    roomStatus: {
        type: String,
        enum: ['Available', 'Blocked', 'Maintenance'],
        default: 'Available',
    },
    blockedDates: {
        type: [datePeriodSchema],
        default: [],
    },
    maintenanceDates: {
        type: [datePeriodSchema],
        default: [],
    },
    bookingDates: {
        type: [bookingDateSchema],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Compound unique indexes — scoped per hotel
roomSchema.index({ hotelId: 1, roomName: 1 }, { unique: true });
roomSchema.index({ hotelId: 1, roomNumber: 1 }, { unique: true });

module.exports = mongoose.model('Room', roomSchema);