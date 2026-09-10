import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';

const BudgetTracker = () => {
  const [budget, setBudget] = useState(5000);
  const [spent, setSpent] = useState(0);

  useEffect(() => {
    const tripData = localStorage.getItem("tripInfo");
    if (tripData) {
      const parsed = JSON.parse(tripData);
      const userBudget = Number(parsed.budgetLKR || parsed.budgetUSD) || 5000;
      setBudget(userBudget);
      setSpent(0);
    }
  }, []);

  const remaining = budget - spent;
  const percentage = Math.round((spent / budget) * 100) || 0;

  return (
    <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100 flex-1">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold text-slate-800">Budget Tracker</h3>
        <TrendingUp className="text-blue-900" size={20} />
      </div>

      <div className="space-y-6">
        {/* Progress Bar Area */}
        <div className="space-y-3">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Budget vs Spent</span>
            <span className="text-slate-800">{percentage}% Used</span>
          </div>
          <div className="relative w-full bg-slate-100 h-10 rounded-full flex items-center overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-700"
              style={{ width: `${percentage}%` }}
            ></div>
            <span className="absolute left-1/2 -translate-x-1/2 text-xs font-bold text-slate-700">
            LKR {spent} / LKR {budget}
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex justify-between pt-4">
          <div className="text-center">
            <p className="text-xs font-semibold text-slate-400 mb-1">Budget</p>
            <p className="text-xl font-bold text-slate-900">LKR {budget.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold text-slate-400 mb-1">Spent</p>
            <p className="text-xl font-bold text-blue-900">LKR {spent.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold text-slate-400 mb-1">Remaining</p>
            <p className="text-xl font-bold text-green-600">LKR {remaining.toLocaleString()}</p>
          </div>
        </div>

        <button className="w-full mt-4 border border-blue-900 text-blue-900 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors">
          Update Expenses
        </button>
      </div>
    </div>
  );
};

export default BudgetTracker;