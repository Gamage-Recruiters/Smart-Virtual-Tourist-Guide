import React from "react";
import { Routes, Route } from "react-router-dom";
import ToastContainer from "./components/notifications/ToastContainer";
import NotificationBell from "./components/notifications/NotificationBell";
import NotificationModal from "./components/notifications/NotificationModal";
import ConnectionStatusBanner from "./components/notifications/ConnectionStatusBanner";

function App() {
  return (
    <div className="p-8">
      <ConnectionStatusBanner />
      <ToastContainer />
      <NotificationModal />
      <div className="flex justify-end mb-8">
        <NotificationBell />
      </div>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route path="/map" element={<MapPage />} /> */}
      </Routes>
    </div>
  );
}

export default App;
