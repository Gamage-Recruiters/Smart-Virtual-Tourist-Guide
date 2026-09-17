import React from "react";
import Header from "../../components/Header";
import LocationSelector from "../../components/notifications/LocationSelector";

const DriverDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="p-6 mt-4">
        <h1 className="text-2xl font-bold text-gray-800">Driver Dashboard</h1>
        <p className="mt-2 text-gray-600">Waiting for transport requests...</p>
      </div>

      <div className="mb-6">
        <LocationSelector />
      </div>
    </div>
  );
};

export default DriverDashboard;
