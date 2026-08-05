import mongoose from 'mongoose';

const guideProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    profilePhoto: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Male',
    },
    dateOfBirth: {
      type: Date,
    },
    contactNumber: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    guideIdNumber: {
      type: String,
      unique: true,
      required: true,
    },
    yearsOfExperience: {
      type: Number,
      default: 0,
      min: 0,
    },
    languagesSpoken: [
      {
        type: String,
        trim: true,
      },
    ],
    areasOfExpertise: [
      {
        type: String,
        enum: ['Cultural', 'Adventure', 'Wildlife', 'Culinary'],
      },
    ],
    shortBio: {
      type: String,
      trim: true,
      default: '',
    },
    specialSkills: {
      type: String,
      trim: true,
      default: '',
    },
    identityProof: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
      fileName: { type: String, default: '' },
      mimeType: { type: String, default: '' },
      uploadedAt: { type: Date },
      verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending',
      },
    },
    certifications: [
      {
        url: { type: String, required: true },
        publicId: { type: String, default: '' },
        fileName: { type: String, default: '' },
        mimeType: { type: String, default: '' },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    profileCompletionPercent: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to calculate completion percentage (async style for Mongoose 9 compatibility)
guideProfileSchema.pre('save', async function () {
  const fields = [
    this.fullName,
    this.gender,
    this.dateOfBirth,
    this.contactNumber,
    this.email,
    this.yearsOfExperience,
    this.languagesSpoken && this.languagesSpoken.length > 0,
    this.areasOfExpertise && this.areasOfExpertise.length > 0,
    this.shortBio,
    this.specialSkills,
    this.identityProof && this.identityProof.url,
  ];

  const completed = fields.filter(Boolean).length;
  this.profileCompletionPercent = Math.round((completed / fields.length) * 100);
});

const GuideProfile = mongoose.model('GuideProfile', guideProfileSchema);

// Safely drop legacy 'user_1' index if present in MongoDB to prevent duplicate key errors on 'user: null'
GuideProfile.on('index', async (err) => {
  if (err) {
    console.error('GuideProfile index build error:', err);
  }
  try {
    const indexes = await GuideProfile.collection.indexes();
    if (indexes.some((idx) => idx.name === 'user_1')) {
      await GuideProfile.collection.dropIndex('user_1');
      console.log('Dropped legacy index user_1 from guideprofiles collection');
    }
  } catch (e) {
    // Ignore error if collection does not exist yet
  }
});

export default GuideProfile;
