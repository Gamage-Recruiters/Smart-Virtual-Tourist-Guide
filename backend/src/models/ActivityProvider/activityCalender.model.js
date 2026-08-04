import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema({
  label: { type: String, required: true },   // e.g. "08:00 AM – 12:00 PM"
  startTime: { type: String, required: true }, // "08:00"
  endTime: { type: String, required: true },   // "12:00"
  capacity: { type: Number, required: true },  // total seats e.g. 15
  booked: { type: Number, default: 0 },        // confirmed bookings
  isActive: { type: Boolean, default: true },  // provider can toggle on/off
}, { _id: true });

const calendarSchema = new mongoose.Schema(
  {
    activityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity',
      required: true,
    },
    date: {
      type: String,          // stored as "YYYY-MM-DD" for easy querying
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'pending', 'fully_booked', 'unavailable'],
      default: 'available',
    },
    timeSlots: [timeSlotSchema],
    isUnavailable: { type: Boolean, default: false },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

// One calendar entry per activity per date
calendarSchema.index({ activityId: 1, date: 1 }, { unique: true });
calendarSchema.index({ activityId: 1, date: 1, status: 1 });

// Auto-calculate status before save
calendarSchema.pre('save', function (next) {
  if (this.isUnavailable) { this.status = 'unavailable'; return next(); }
  const activeSlots = this.timeSlots.filter((s) => s.isActive);
  if (activeSlots.length === 0) { this.status = 'unavailable'; return next(); }
  const totalCapacity = activeSlots.reduce((sum, s) => sum + s.capacity, 0);
  const totalBooked   = activeSlots.reduce((sum, s) => sum + s.booked, 0);
  if (totalBooked === 0)               this.status = 'available';
  else if (totalBooked < totalCapacity) this.status = 'pending';
  else                                  this.status = 'fully_booked';
  next();
});

export default mongoose.model('Calendar', calendarSchema);
