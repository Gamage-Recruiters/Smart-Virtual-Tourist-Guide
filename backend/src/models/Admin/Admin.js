import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please add a full name'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please add a valid email',
      ],
    },

    phoneNumber: {
      type: String,
      required: [true, 'Please add a phone number'],
      trim: true,
    },

    location: {
      type: String,
      default: '',
      trim: true,
    },

    username: {
      type: String,
      required: [true, 'Please add a username'],
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 8,
      maxlength: 128,
      select: false,
    },

    role: {
      type: String,
      enum: [
        'Administrator',
        'Moderator',
        'Editor',
      ],
      default: 'Administrator',
    },

    status: {
      type: String,
      enum: [
        'Active',
        'Suspended',
      ],
      default: 'Active',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

adminSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(12);

  this.password = await bcrypt.hash(
    this.password,
    salt
  );
});

adminSchema.methods.matchPassword =
  async function (enteredPassword) {
    return bcrypt.compare(
      enteredPassword,
      this.password
    );
  };

export default mongoose.model('Admin', adminSchema);