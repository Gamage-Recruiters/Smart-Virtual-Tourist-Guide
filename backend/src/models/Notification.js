import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, required: true, trim: true, maxlength: 80 },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    message: { type: String, required: true, trim: true, maxlength: 500 },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    dedupeKey: { type: String, trim: true, maxlength: 240 },
    readAt: Date,
  },
  { timestamps: true },
);

notificationSchema.index({ dedupeKey: 1 }, { unique: true, sparse: true });
notificationSchema.index({ userId: 1, readAt: 1, createdAt: -1 });

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
