import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  toggleNotificationModal,
  setInitialUnreadCount,
} from "../../store/slices/notificationSlice";
import { selectUnreadCount } from "../../store/selectors/notificationSelectors";
import { selectAuthToken } from "../../store/selectors/authSelectors";
import { fetchUnreadCountApi } from "../../api/notificationApi";

/**
 * NotificationBell — Header icon button that displays the live unread notification count.
 *
 * On mount, fetches the authoritative unread count from the server and seeds the Redux store.
 * Subsequently, the count is kept in sync in real-time via socket events dispatched to the store.
 *
 * Triggers a bounce animation whenever the unread count increases (i.e., a new notification arrives).
 * Clicking the bell opens the {@link NotificationModal}.
 *
 * @component
 * @returns {React.ReactElement}
 */
const NotificationBell = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectAuthToken);
  const unreadCount = useSelector(selectUnreadCount);

  // Controls the CSS bounce animation that plays when a new notification arrives.
  const [isBouncing, setIsBouncing] = useState(false);

  // Tracks the previous count to determine if the count increased (new notification)
  // vs decreased (mark-as-read). Only an increase should trigger the bounce.
  const prevCountRef = useRef(0);

  // Fetch the server-side unread count on mount to seed the Redux store accurately.
  // staleTime of 5 minutes avoids redundant refetches; real-time updates come via socket.
  const { data: dbResponse } = useQuery({
    queryKey: ["unreadCount", token],
    queryFn: () => fetchUnreadCountApi(token),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });

  // Seed the Redux unread count from the server response on initial load.
  useEffect(() => {
    const actualCount = dbResponse?.data?.unreadCount;
    if (actualCount !== undefined) {
      dispatch(setInitialUnreadCount(actualCount));
    }
  }, [dbResponse, dispatch]);

  // Trigger a short bounce animation when the count increases (new real-time notification).
  // Using a ref for the previous count avoids adding `unreadCount` as a dep for cleanup.
  useEffect(() => {
    if (unreadCount > prevCountRef.current) {
      setIsBouncing(true);
      const timer = window.setTimeout(() => setIsBouncing(false), 300);
      return () => window.clearTimeout(timer);
    }

    prevCountRef.current = unreadCount;
  }, [unreadCount]);

  return (
    <button
      onClick={() => {
        dispatch(toggleNotificationModal(true));
      }}
      aria-label={`Notifications, ${unreadCount} unread`}
      className="relative p-2 text-[#111111] hover:bg-[#F4F9FF] hover:text-[#111111] rounded-[12px] transition-colors duration-200 focus:outline-none"
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
        <span className="absolute top-0 right-0 flex items-center justify-center min-w-5 h-5 px-1 text-[10px] font-bold text-[#FFFFFF] bg-[#E53935] border-2 border-[#FFFFFF] rounded-full transform translate-x-1/4 -translate-y-1/4 shadow-sm">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
