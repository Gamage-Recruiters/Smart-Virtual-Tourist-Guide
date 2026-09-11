import React from "react";
import { useSelector } from "react-redux";
import { selectAuthToken } from "../../../store/selectors/authSelectors"; 
import { useNotifications } from "../../../hooks/useNotification";
import { useNotificationNavigation } from "../../../hooks/useNotificationNavigation";
import { 
  getCategoryIcon, 
  getIconColor, 
  getLeftBorderColor 
} from "../../../utils/notificationHelpers";
import { timeAgo } from "../../../utils/timeHelper";

const NotificationItem = ({ notification, onClick }) => {
  const Icon = getCategoryIcon(notification.category);
  const leftBorder = getLeftBorderColor(notification.priority);
  const iconBg = getIconColor(notification.priority);

  return (
    <div
      onClick={() => onClick(notification)}
      className={`flex items-center gap-4 p-4 rounded-xl border-l-4 ${leftBorder} bg-slate-50 transition-all hover:translate-x-1 cursor-pointer`}
    >
      <div className={`${iconBg} p-2.5 rounded-lg text-white shadow-sm`}>
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h5 className="flex items-center gap-2 text-sm font-bold text-slate-800">
              {notification.title}
              {!notification.isRead && (
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </h5>
            <p className="pr-4 text-xs leading-relaxed text-slate-500 line-clamp-1">
              {notification.message}
            </p>
          </div>
          <div className="flex flex-col gap-1.5 items-center">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">
              {timeAgo(notification.createdAt)}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation(); 
                onClick(notification);
              }}
              className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AlertsNotifications = () => {
  const token = useSelector(selectAuthToken); 
  
  const { data, isLoading } = useNotifications(token); 
  const { handleNotificationClick } = useNotificationNavigation();

  const recentNotifications = data?.pages?.[0]?.data?.slice(0, 3) || [];

  return (
    <div className="flex-1 p-8 bg-white border shadow-sm rounded-4xl border-slate-100">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-slate-800">
          Alerts & Notifications
        </h3>
        <button className="text-sm font-semibold text-blue-900 hover:underline">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <p className="py-4 text-sm text-center text-slate-500">Loading notifications...</p>
        ) : recentNotifications.length > 0 ? (
          recentNotifications.map((notif) => (
            <NotificationItem
              key={notif._id}
              notification={notif}
              onClick={handleNotificationClick}
            />
          ))
        ) : (
          <p className="py-4 text-sm text-center text-slate-500">No new notifications.</p>
        )}
      </div>
    </div>
  );
};

export default AlertsNotifications;