import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronRight } from "lucide-react";

// Actions & Selectors
import { markAsReadLocal } from "../../store/slices/notificationSlice";
import { selectUserId } from "../../store/selectors/authSelectors";

// Helpers & Components
import { timeAgo } from "../../utils/timeHelper";
import {
  getCategoryIcon,
  getIconColor,
  getLeftBorderColor,
} from "../../utils/notificationHelpers";
import NotificationSkeleton from "./NotificationSkeleton";

// React Query Hook & API
import { useNotifications } from "../../hooks/useNotification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAsReadApi } from "../../api/notificationApi";

const NotificationList = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);
  const userId = useSelector(selectUserId);

  // --- React Query: Fetching Notifications ---
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useNotifications(userId);

  const list = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);

  // --- React Query: Mutation (Mark as Read) ---
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId) => markAsReadApi(notificationId, userId),
  });

  // --- Infinite Scroll Logic ---
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isAtBottom = scrollHeight - scrollTop <= clientHeight + 10;

    if (isAtBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // --- Notification Click Handler ---
  const handleNotificationClick = (notification) => {
    setExpandedId(expandedId === notification._id ? null : notification._id);

    if (!notification.isRead) {
      dispatch(markAsReadLocal());

      queryClient.setQueryData(["notifications", userId], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((notif) =>
              notif._id === notification._id
                ? { ...notif, isRead: true }
                : notif,
            ),
          })),
        };
      });

      markAsReadMutation.mutate(notification._id);
    }
  };

  if (isError) {
    return (
      <div className="p-4 text-red-500 text-center text-xs">
        Error loading notifications.
      </div>
    );
  }

  return (
    <div
      className="h-full w-full overflow-y-auto p-4 custom-scrollbar"
      onScroll={handleScroll}
    >
      {/* --- 1. SKELETON LOADING (Initial Load) --- */}
      {isLoading && (
        <div className="flex flex-col gap-3">
          {[...Array(6)].map((_, i) => (
            <NotificationSkeleton key={i} />
          ))}
        </div>
      )}

      {/* --- 2. NOTIFICATION LIST --- */}
      <div className="flex flex-col gap-3">
        {list.map((notification) => {
          const isExpanded = expandedId === notification._id;
          return (
            <div
              key={notification._id}
              onClick={() => handleNotificationClick(notification)}
              // 🔴 UI/UX Audit Fixes Applied Here!
              className={`group relative flex flex-col p-4 cursor-pointer rounded-xl transition-all duration-300 border-y border-r border-gray-100 border-l-[3px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] ${
                notification.isRead
                  ? "bg-white border-l-transparent hover:bg-gray-50"
                  : `bg-[#F4F9FF] ${getLeftBorderColor(notification.priority)}`
              } ${isExpanded ? "ring-1 ring-blue-400" : ""}`}
            >
              <div className="flex items-start">
                <div
                  className={`flex-shrink-0 p-2.5 rounded-full mr-4 ${getIconColor(notification.priority)}`}
                >
                  {getCategoryIcon(notification.category)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4
                      className={`text-sm pr-2 transition-all truncate ${
                        isExpanded
                          ? "text-blue-700 font-bold"
                          : notification.isRead
                            ? "font-semibold text-gray-700"
                            : "font-bold text-gray-900"
                      }`}
                    >
                      {notification.title}
                    </h4>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] text-gray-400 font-medium">
                        {timeAgo(notification.createdAt)}
                      </span>
                      {!notification.isRead && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                        </span>
                      )}
                    </div>
                  </div>

                  <p
                    className={`text-xs leading-relaxed transition-all duration-300 ${
                      isExpanded
                        ? "text-gray-800"
                        : "text-gray-500 line-clamp-2"
                    }`}
                  >
                    {notification.message}
                  </p>

                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                      <span className="px-2 py-0.5 text-[9px] font-bold tracking-wider rounded text-gray-400 bg-gray-100 uppercase">
                        {notification.scope}
                      </span>
                      {notification.actionUrl && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(notification.actionUrl);
                          }}
                          className="flex items-center gap-1 bg-blue-600 text-white text-[11px] font-bold px-4 py-1.5 rounded-lg hover:bg-blue-700 shadow-md active:scale-95 transition-all"
                        >
                          View Details <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- 3. LOADING MORE SKELETON --- */}
      {isFetchingNextPage && (
        <div className="mt-3">
          <NotificationSkeleton />
        </div>
      )}

      {/* --- 4. END OF LIST --- */}
      {!hasNextPage && list.length > 0 && (
        <div className="text-center py-8">
          <span className="px-4 py-1.5 rounded-full bg-gray-50 text-[10px] font-bold text-gray-400 tracking-widest uppercase">
            End of updates
          </span>
        </div>
      )}

      {/* --- 5. EMPTY STATE --- */}
      {!isLoading && list.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Bell className="w-12 h-12 mb-3 opacity-10" />
          <p className="text-sm font-semibold italic text-gray-300">
            No notifications found.
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
