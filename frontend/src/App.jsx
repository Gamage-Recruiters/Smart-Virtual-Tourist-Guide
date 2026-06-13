import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home_Page from "./pages/Home_Page";
import Drivers_Card from "./components/marketplace/Drivers_Card";
import Vehicles_Card from "./components/marketplace/Vehicles_Card";
import Submit_Bids from "./components/bidding/Submit_Bids";
import Driver_Details from "./components/bidding/Driver_Deatils";
import Ride_Details from "./components/bidding/Ride_Details";
import Driver_Bids from "./components/bidding/Driver_Bids";
import Guides_Card from "./components/marketplace/Guides_Card";
import Hotels_Card from "./components/marketplace/Hotels_Card";
import Restaurants_Card from "./components/marketplace/Restaurants_Card";
import Activities_Card from "./components/marketplace/Activities_Card";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>  
        <Route path="/" element={<Home_Page />}>
          <Route index element={<Navigate to="/drivers" replace />} />
            {/* Booking Marketplace URL */}
            <Route path="drivers" element={<Drivers_Card />} />
            <Route path="vehicles" element={<Vehicles_Card />} />
            <Route path="guides" element={<Guides_Card />} />
            <Route path="hotels" element={<Hotels_Card />} />
            <Route path="restaurants" element={<Restaurants_Card />} />
            <Route path="activities" element={<Activities_Card />} />
          </Route>
            <Route path="/driver-details" element={<Driver_Details />} />
            <Route path="/other-drivers" element={<Submit_Bids />} />
            <Route path="/ride-details" element={<Ride_Details />} />
            <Route path="/submit-bids" element={<Driver_Bids />} />
      </Routes>
    </BrowserRouter>
  );
}