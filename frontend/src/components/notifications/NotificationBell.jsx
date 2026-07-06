import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  toggleNotificationModal,
  setInitialUnreadCount,
} from "../../store/slices/notificationSlice";
import { selectUnreadCount } from "../../store/selectors/notificationSelectors";
import { selectUserId } from "../../store/selectors/authSelectors";
import { fetchUnreadCountApi } from "../../api/notificationApi";

const NotificationBell = () => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const unreadCount = useSelector(selectUnreadCount);

  const [isBouncing, setIsBouncing] = useState(false);
  const prevCountRef = useRef(0);

  const { data: dbResponse } = useQuery({
    queryKey: ["unreadCount", userId],
    queryFn: () => fetchUnreadCountApi(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    const actualCount = dbResponse?.data?.unreadCount;
    if (actualCount !== undefined) {
      dispatch(setInitialUnreadCount(actualCount));
    }
  }, [dbResponse, dispatch]);

  useEffect(() => {
    if (unreadCount > prevCountRef.current) {
      setIsBouncing(true);

      const timer = setTimeout(() => setIsBouncing(false), 300);
      return () => clearTimeout(timer);
    }
    prevCountRef.current = unreadCount;
  }, [unreadCount]);

  return (
    <button
      onClick={() => dispatch(toggleNotificationModal(true))}
      aria-label={`Notifications, ${unreadCount} unread`}
      className="relative p-2 text-gray-500 hover:bg-[#F4F9FF] hover:text-[#1A73E8] rounded-full transition-colors duration-200 focus:outline-none"
    >
      <div
        className={`transition-transform duration-300 origin-top ${
          isBouncing
            ? "scale-125 rotate-12 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]"
            : "scale-100 rotate-0 ease-out"
        }`}
      >
        <Bell className="w-6 h-6" />
      </div>

      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 flex items-center justify-center min-w-[20px] h-5 px-1 text-[10px] font-bold text-white bg-[#E53935] border-2 border-white rounded-full transform translate-x-1/4 -translate-y-1/4 shadow-sm">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
