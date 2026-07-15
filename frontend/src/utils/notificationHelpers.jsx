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
      return "bg-[#E53935]/10 text-[#E53935] border border-[#E53935]/20";
    case "high":
      return "bg-[#F4F9FF] text-[#111111] border border-[#F4F9FF]";
    case "medium":
      return "bg-[#F4F9FF] text-[#111111] border border-[#F4F9FF]";
    case "low":
      return "bg-[#4CAF50]/10 text-[#4CAF50] border border-[#4CAF50]/20";
    default:
      return "bg-[#F4F9FF] text-[#111111] border border-[#F4F9FF]";
  }
};

export const getLeftBorderColor = (priority) => {
  const p = priority?.toLowerCase();

  switch (p) {
    case "critical":
      return "border-l-[#E53935]";
    case "high":
      return "border-l-[#111111]";
    case "medium":
      return "border-l-[#F4F9FF]";
    case "low":
      return "border-l-[#4CAF50]";
    default:
      return "border-l-[#F4F9FF]";
  }
};
