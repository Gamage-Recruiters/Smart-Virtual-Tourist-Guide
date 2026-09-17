import React from "react";
import Header from "../../components/Header"; // 🚀 UPDATE: Added Header component
import LocationSelector from "../../components/notifications/LocationSelector"; // 🚀 UPDATE: Added LocationSelector

const DummyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content Section */}
      <div className="p-6 mt-4">
        <h1 className="text-2xl font-bold text-gray-800">Dummy Page Guide</h1>
        <p className="mt-2 text-gray-600">
          This is a dummy page to test UI components and notifications...
        </p>
      </div>

      {/* Location Selector Section */}
      <div className="mb-6">
        <LocationSelector />
      </div>
    </div>
  );
};

export default DummyPage;