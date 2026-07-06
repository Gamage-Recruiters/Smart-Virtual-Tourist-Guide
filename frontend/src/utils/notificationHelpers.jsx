import React from "react";
import {
  AlertTriangle,
  CalendarCheck,
  Gavel,
  CreditCard,
  UserCircle,
  Star,
  HelpCircle,
  Wallet,
  Settings,
  Bell,
} from "lucide-react";

export const getCategoryIcon = (category) => {
  const iconProps = { className: "w-5 h-5" };

  switch (category) {
    case "SAFETY":
      return <AlertTriangle {...iconProps} />;
    case "BOOKING":
      return <CalendarCheck {...iconProps} />;
    case "BID":
      return <Gavel {...iconProps} />;
    case "PAYMENT":
      return <CreditCard {...iconProps} />;
    case "ACCOUNT":
      return <UserCircle {...iconProps} />;
    case "REVIEW":
      return <Star {...iconProps} />;
    case "INQUIRY":
      return <HelpCircle {...iconProps} />;
    case "BUDGET":
      return <Wallet {...iconProps} />;
    case "SYSTEM":
      return <Settings {...iconProps} />;
    default:
      return <Bell {...iconProps} />;
  }
};

export const getIconColor = (priority) => {
  const p = priority?.toLowerCase();

  switch (p) {
    case "critical":
      return "bg-red-100 text-red-600 border-red-200";
    case "high":
      return "bg-orange-100 text-orange-600 border-orange-200";
    case "medium":
      return "bg-blue-100 text-blue-600 border-blue-200";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
};

export const getLeftBorderColor = (priority) => {
  const p = priority?.toLowerCase();

  switch (p) {
    case "critical":
      return "border-l-[#E53935]"; // Custom Red
    case "high":
      return "border-l-[#FF6D00]"; // Custom Orange
    case "medium":
      return "border-l-[#1A73E8]"; // Custom Blue
    case "low":
      return "border-l-[#43A047]"; // Custom Green
    default:
      return "border-l-gray-300"; // Default / Read messages
  }
};
