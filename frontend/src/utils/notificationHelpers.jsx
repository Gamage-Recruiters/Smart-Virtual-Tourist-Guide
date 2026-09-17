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

// Returns the corresponding icon for the notification category
export const getCategoryIcon = (category) => {
  switch (category) {
    case "SAFETY":
      return AlertTriangle;
    case "BOOKING":
      return CalendarCheck;
    case "BID":
      return Gavel;
    case "PAYMENT":
      return CreditCard;
    case "ACCOUNT":
      return UserCircle;
    case "REVIEW":
      return Star;
    case "INQUIRY":
      return HelpCircle;
    case "BUDGET":
      return Wallet;
    case "SYSTEM":
      return Settings;
    default:
      return Bell;
  }
};

// Returns the background, text, and border colors for the icon container based on priority
export const getIconColor = (priority) => {
  const p = priority?.toLowerCase();

  switch (p) {
    case "critical":
      return "bg-rose-50 text-rose-500 border border-rose-100";
    case "high":
      return "bg-amber-50 text-amber-500 border border-amber-100";
    case "medium":
      return "bg-blue-50 text-[#00aaff] border border-blue-100";
    case "low":
      return "bg-emerald-50 text-emerald-500 border border-emerald-100";
    default:
      return "bg-slate-50 text-slate-400 border border-slate-100";
  }
};

// Returns the left border color for the toast/list item based on priority
export const getLeftBorderColor = (priority) => {
  const p = priority?.toLowerCase();

  switch (p) {
    case "critical":
      return "border-l-rose-500";
    case "high":
      return "border-l-amber-500";
    case "medium":
      return "border-l-[#00aaff]";
    case "low":
      return "border-l-emerald-500";
    default:
      return "border-l-slate-300";
  }
};

export const playNotificationSound = (priority) => {
  const isMuted = localStorage.getItem("mute_alerts") === "true";
  if (isMuted) return;

  let audioFile = "/assets/sounds/notification-chime.mp3"; 
  const p = priority?.toLowerCase();

  if (p === "critical") {
    audioFile = "/assets/sounds/emergency-alert.mp3";
  } else if (p === "high") {
    audioFile = "/assets/sounds/emergency-alert.mp3";
  } else if (p === "medium") {
    audioFile = "/assets/sounds/notification-chime.mp3";
  } else if (p === "low") {
    audioFile = "/assets/sounds/notification-chime.mp3";
  }

  const audio = new Audio(audioFile);
  audio.volume = 0.8; 
  
  audio.play().catch((error) => {
    console.warn("⚠️ Browser blocked the notification sound (User interaction needed):", error);
  });
};