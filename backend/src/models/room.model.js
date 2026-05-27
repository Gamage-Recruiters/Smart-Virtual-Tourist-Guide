import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: true,
        unique: true,
    },
    roomType: {
        type: String,
        enum: ['Standard Room', 'Deluxe Room', 'Family Suite', 'Conference Room', 'Event Space'],
        default: 'Standard Room',
    },
    roomSize: {
        type: Number,
        required: true,
    },
    roomCapacity: {
        adults: {
            type: Number,
            required: true,
        },
        children: {
            type: Number,
            required: true,
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
    contactInfo: {
        contactName: {
            type: String,
            required: true,
        },
        contactNumber: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        }
    },
    aboutLocation: {
        type: String,
        required: true,
    },
    pricingInfo: {
        basePrice: {
            type: Number,
            required: true,
        },
        paymentMethods: {
            type: String,
            enum: ["Cash", "Card", "Online"],
            default: "Online",
        },
    },
    specialPackagesInfo: {
        packageName: {
            type: String,
        },
        specialDiscounts: {
            promotionCode: {
                type: String,
            },
            discountPercentage: {
                type: Number,
            },
        },
        validityPeriod: {
            startDate: {
                type: Date,
            },
            endDate: {
                type: Date,
            },
        },
    },
    availabilityStatus: {
        type: String,
        enum: ['Available', 'Booked', 'Under Maintenance'],
        default: 'Available',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Room', roomSchema);