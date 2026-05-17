import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home_Page from "./pages/Home_Page";
import Drivers_Card from "./components/marketplace/Drivers_Card";
import Vehicles_Card from "./components/marketplace/Vehicles_Card";
import Submit_Bids from "./components/bidding/Submit_Bids";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>  
        <Route path="/" element={<Home_Page />}>
          <Route index element={<Navigate to="/drivers" replace />} />
          {/* Booking Marketplace URL */}
          <Route path="drivers" element={<Drivers_Card />} />
          <Route path="vehicles" element={<Vehicles_Card />} />
          <Route path="guides" element={<div className="p-10 bg-[#EBF1FF] rounded-b-2xl font-bold text-center">Guides Coming Soon...</div>} />
          <Route path="hotels" element={<div className="p-10 bg-[#EBF1FF] rounded-b-2xl font-bold text-center">Hotels Coming Soon...</div>} />
          <Route path="restaurants" element={<div className="p-10 bg-[#EBF1FF] rounded-b-2xl font-bold text-center">Restaurants Coming Soon...</div>} />
          <Route path="activities" element={<div className="p-10 bg-[#EBF1FF] rounded-b-2xl font-bold text-center">Activities Coming Soon...</div>} />
        </Route>
        <Route path="submit-bids" element={<Submit_Bids />} />
      </Routes>
    </BrowserRouter>
  );
}