import mongoose from "mongoose";

const operatingHourSchema = new mongoose.Schema(
  {
    day: { type: String, required: true, trim: true },
    open: { type: String, required: true, trim: true },
    close: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const socialLinksSchema = new mongoose.Schema(
  {
    website: { type: String, trim: true },
    facebook: { type: String, trim: true },
    instagram: { type: String, trim: true },
    tiktok: { type: String, trim: true },
  },
  { _id: false }
);

const AMENITY_OPTIONS = [
  "Free WiFi",
  "Parking",
  "Outdoor Seating",
  "Live Music",
];

const restaurantSchema = new mongoose.Schema(
  {
    restaurantName: { type: String, required: true, trim: true },
    registrationNo: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    district: { 
      type: String, 
      required: true, 
      trim: true,
      enum: [
        "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya", 
        "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar", 
        "Mullaitivu", "Vavuniya", "Trincomalee", "Batticaloa", "Ampara", 
        "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla", 
        "Monaragala", "Ratnapura", "Kegalle"
      ]
    },
    amenities: {
      type: [String],
      enum: AMENITY_OPTIONS,
      default: [],
    },
    bannerImage: { type: String, trim: true },
    socialLinks: socialLinksSchema,
    operatingHours: [operatingHourSchema],
    tables: {
      ethereal: {
        name: { type: String, default: "The ethereal (full luxury experience)" },
        pricePerPerson: { type: Number, default: 285 },
        limit: { type: Number, default: 500 }
      },
      obsidian: {
        name: { type: String, default: "Obsidian terrace (open air sunset dinning)" },
        pricePerPerson: { type: Number, default: 195 },
        limit: { type: Number, default: 500 }
      }
    }
  },
  { timestamps: true }
);

const Restaurant =
  mongoose.models.Restaurant ||
  mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;

