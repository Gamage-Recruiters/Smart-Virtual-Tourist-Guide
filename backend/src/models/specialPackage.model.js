import mongoose from 'mongoose';

const specialPackageSchema = new mongoose.Schema({
    packageName: { type: String, required: true, unique: true },
    roomType: {
        type: String,
        enum: ['Single Room','Double Room','Twin Room','Queen Room','King Room','Deluxe Double Room','Family Room / Quad Room'],
        required: true,
    },
    roomSize:   { type: Number, required: true },
    measureType:{ type: String, enum: ['sqm','sqft'], required: true },
    capacity: {
        adults:   { type: Number, required: true, min: 0 },
        children: { type: Number, required: true, min: 0 },
    },
    amenities:   { type: [String], default: [] },
    description: { type: String, required: true },
    images:      { type: [String], default: [] },
    contactInfo: {
        contactName:   { type: String, required: true },
        contactNumber: { type: String, required: true },
        email:         { type: String, required: true },
    },
    locationAndPricing: [{
        aboutLocation:  { type: String, default: '' },
        basePrice:      { type: Number, required: true },
        paymentMethods: {
            type: [String],
            enum: ['Card Payment', 'Online Payment', 'Cash Payment(Pay at Hotel)'],
            required: true,
        },
    }],
    discount: {
        discountPercent: { type: Number, default: null },
        discountAmountPerNight: { type: Number, default: null },
        validFrom:       { type: String, default: null },
        validTo:         { type: String, default: null },
        promoCode:       { type: String, default: null },
    },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('SpecialPackage', specialPackageSchema);
