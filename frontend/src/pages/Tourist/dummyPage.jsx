import React from 'react';
import Header from '../../components/Tourist/Header';
import Footer from '../../components/Tourist/Footer';

const DummyPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="text-6xl">✨</div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Homepage Coming Soon</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            We are curating a premium, personalized journey planner for your ultimate Sri Lankan travel experience. Stay tuned!
          </p>
          <div className="pt-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              Under Active Development
            </span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DummyPage;