import React from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// Notification Components
import ToastContainer from "./ToastContainer";
import NotificationBell from "./NotificationBell";
import NotificationModal from "./NotificationModal";
import ConnectionStatusBanner from "./ConnectionStatusBanner";

const GlobalNotificationUI = () => {
  const location = useLocation();
  const token = useSelector((state) => state.auth?.token);

  const publicPaths = [
    "/",
    "/about",
    "/destinations",
    "/how-it-works",
    "/contact",
    "/login",
    "/forgot-password",
    "/create-password",
    "/tourist",
    "/travel-safety",
    "/hotel-owner",
    "/hotel-info",
    "/guide",
    "/renter",
    "/government",
    "/activity-provider",
    "/admin",
    "/driver-signup1",
    "/driver-signup2",
    "/driver-signup3",
    "/resturent/login",
    "/resturent/register",
  ];

  if (!token || publicPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-[100]">
        <ConnectionStatusBanner />
      </div>

      <ToastContainer />
      <NotificationModal />
    </>
  );
};

export default GlobalNotificationUI;
