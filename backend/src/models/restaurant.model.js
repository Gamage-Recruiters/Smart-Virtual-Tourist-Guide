const mongoose = require("mongoose");

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

const restaurantSchema = new mongoose.Schema(
  {
    restaurantName: { type: String, required: true, trim: true },
    registrationNo: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    address: { type: String, trim: true },
    bannerImage: { type: String, trim: true },
    businessType: {
      type: String,
      enum: ["Restaurant", "Home Based"],
      required: true,
    },
    socialLinks: socialLinksSchema,
    operatingHours: [operatingHourSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
