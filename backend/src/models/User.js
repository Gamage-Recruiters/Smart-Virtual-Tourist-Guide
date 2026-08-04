import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    username: { type: String, trim: true, unique: true, sparse: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: false, minlength: 6 },
    googleId: { type: String, trim: true, sparse: true },

    role: {
      type: String,
      enum: [
        "tourist_user",
        "guide_user",
        "hotelowner_user",
        "restaurant_user",
        "government_user",
        "renter_user",
        "driver_user",
        "activityprovider_user",
        "admin",
      ],
      required: true,
    },

    contactNumber: { type: String, trim: true },

    country: { type: String, trim: true },
    travelType: { type: String, trim: true },
    travelPreferences: {
      travelStart: { type: Date },
      travelEnd: { type: Date },
      budgetRange: {
        min: { type: Number },
        max: { type: Number },
        currency: { type: String, default: "LKR" },
      },
      travelStyle: [String],
      accommodationType: { type: String },
    },
    healthInfo: {
      bloodType: { type: String },
      medicalCondition: { type: String },
    },
    emergencyContact: {
      name: { type: String },
      relationship: { type: String },
      country: { type: String },
      phone: String,
    },
    hotels: [
      {
        hotelName: { type: String, trim: true },
        hotelRegistrationNo: { type: String, trim: true },
        hotelEmail: { type: String, trim: true, lowercase: true },
        hotelRegisteredYear: { type: String, trim: true },
        hotelContactNumber: { type: String, trim: true },
      },
    ],
    guideId: { type: String, trim: true },
    dob: { type: String, trim: true },
    gender: { type: String, trim: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },

    vehicleType: { type: String, trim: true },
    vehicleNumber: { type: String, trim: true },
    licenseNumber: { type: String, trim: true },
    vehicleColor: { type: String, trim: true },
    licenseImages: [{ type: String }],
    regBookImages: [{ type: String }],
    vehicleImages: [{ type: String }],
    availability: { type: Boolean, default: false },
    rating: { type: Number, default: 5 },

    currentLocation: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
    fcmToken: { type: String, default: null },
    showCurrentLocation: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: "users",
  },
);

userSchema.index({ currentLocation: "2dsphere" });

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  if (!this.password.startsWith("$2")) return enteredPassword === this.password;
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model("User", userSchema);