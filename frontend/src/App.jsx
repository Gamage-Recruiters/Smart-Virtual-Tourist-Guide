import React from 'react';
import ReviewSection from './pages/reviews/ReviewSection';

function App() {
  // Api Backend eke test karapu "Driver" ge ID eka
  const testProviderId = "64b5f8e2c3e1a2b3c4d5e6f8"; 
  const testProviderType = "Driver";

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Review Component Test Environment
          </h1>
        </div>

        {/* Oyage Component eka methanin load wenawa */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <ReviewSection 
            targetType={testProviderType} 
            targetProviderId={testProviderId} 
          />
        </div>

      </div>
    </div>
  );
}

export default App;