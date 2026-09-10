import React from 'react';
import { ShoppingBag } from 'lucide-react';

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <ShoppingBag size={28} className="text-emerald-600" />
          <h1 className="text-3xl font-extrabold text-slate-800">Marketplace</h1>
        </div>
        <p className="text-slate-500 text-sm">
          Marketplace content will be added here soon.
        </p>
      </div>
    </div>
  );
}
