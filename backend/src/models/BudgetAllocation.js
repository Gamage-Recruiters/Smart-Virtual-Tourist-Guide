import mongoose from 'mongoose';

const BudgetAllocationSchema = new mongoose.Schema({
  touristId: {
    type: String, 
    required: true,
    unique: true
  },
  tripStyle: { type: String, required: true },
  totalBudgetLKR: { type: Number, required: true },
  numDays: { type: Number, required: true },
  dailyBudgetLKR: { type: Number, required: true },
  tripTotalLKR: { type: Number, required: true },
  remainingLKR: { type: Number, required: true },
  dailyAllocation: { type: Map, of: Number },
  totalAllocation: { type: Map, of: Number },
  weightsUsed: { type: Map, of: Number },
  warnings: [{ type: String }],
  meta: {
    budget_usd: Number,
    start_date: String,
    end_date: String,
    preferences: [String],
    usd_to_lkr: Number
  }
}, { timestamps: true });

export default mongoose.model('BudgetAllocation', BudgetAllocationSchema);