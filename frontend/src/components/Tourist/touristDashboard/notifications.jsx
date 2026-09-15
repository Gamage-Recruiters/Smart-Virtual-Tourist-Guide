import { CloudRain, Calendar, ShieldCheck } from "lucide-react";

const NotificationItem = ({ icon: Icon, title, message, time, type }) => {
  const typeStyles = {
    warning: "border-amber-400 bg-amber-50",
    info: "border-blue-900 bg-blue-50",
    safety: "border-green-700 bg-green-50",
  };

  const iconColors = {
    warning: "bg-amber-500",
    info: "bg-blue-900",
    safety: "bg-green-700",
  };

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border-l-4 ${typeStyles[type]} transition-all hover:translate-x-1`}
    >
      <div
        className={`${iconColors[type]} p-2.5 rounded-lg text-white shadow-sm`}
      >
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <div>
            <h5 className="font-bold text-slate-800 text-sm">{title}</h5>
            <p className="text-xs text-slate-500 leading-relaxed pr-4">
              {message}
            </p>
          </div>
          <div className="flex flex-col gap-1.5 items-center">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">
              {time}
            </span>
            <button className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AlertsNotifications = () => {
  return (
    <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100 flex-1">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold text-slate-800">
          Alerts & Notifications
        </h3>
        <button className="text-blue-900 text-sm font-semibold hover:underline">
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        <NotificationItem
          type="warning"
          icon={CloudRain}
          title="Weather Alert"
          message="Heavy rain expected in Ella tomorrow"
          time="2 hours ago"
        />
        <NotificationItem
          type="info"
          icon={Calendar}
          title="Booking Reminder"
          message="Hotel check-in tomorrow at 3:00 PM"
          time="5 hours ago"
        />
        <NotificationItem
          type="safety"
          icon={ShieldCheck}
          title="Safety Tip"
          message="Keep valuables secure in crowded areas"
          time="1 day ago"
        />
      </div>
    </div>
  );
};

export default AlertsNotifications;
