import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronRight } from "lucide-react";

// Actions & Selectors
import { markAsReadLocal } from "../../store/slices/notificationSlice";
import { selectAuthToken } from "../../store/selectors/authSelectors";

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
  const token = useSelector(selectAuthToken);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useNotifications(token);

  const list = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId) => markAsReadApi(notificationId, token),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: ["notifications", token] });
      const previousNotifications = queryClient.getQueryData(["notifications", token]);

      queryClient.setQueryData(["notifications", token], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((notif) =>
              notif._id === notificationId ? { ...notif, isRead: true } : notif,
            ),
          })),
        };
      });

      dispatch(markAsReadLocal());
      return { previousNotifications };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(["notifications", token], context.previousNotifications);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", token] });
    },
  });

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isAtBottom = scrollHeight - scrollTop <= clientHeight + 10;

    if (isAtBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleNotificationClick = (notification) => {
    setExpandedId(expandedId === notification._id ? null : notification._id);

    if (!notification.isRead) {
      markAsReadMutation.mutate(notification._id);
    }
  };

  if (isError) {
    return (
      <div className="p-6 text-rose-500 font-medium text-center text-sm bg-rose-50/50 rounded-2xl m-4 border border-rose-100">
        Oops! Error loading notifications.
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4 overflow-y-auto custom-scrollbar" onScroll={handleScroll}>
      {isLoading && (
        <div className="flex flex-col gap-3">
          {[...Array(6)].map((_, i) => (
            <NotificationSkeleton key={i} />
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {list.map((notification) => {
          const isExpanded = expandedId === notification._id;
          const Icon = getCategoryIcon(notification.category);

          return (
            <div
              key={notification._id}
              onClick={() => handleNotificationClick(notification)}
              // 🎨 Glassmorphism, soft shadows, and clean hover states
              className={`group relative flex flex-col p-4 cursor-pointer rounded-2xl transition-all duration-300 border backdrop-blur-sm ${
                notification.isRead
                  ? "bg-white/80 border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-blue-100 hover:bg-white"
                  : `bg-blue-50/60 border-blue-100 shadow-sm hover:shadow-md hover:bg-blue-50/90 ${getLeftBorderColor(notification.priority)}`
              } ${isExpanded ? "ring-2 ring-[#00aaff]/30 bg-white scale-[1.01] shadow-lg" : ""}`}
            >
              <div className="flex items-start">
                {/* Icon Container with a soft ring */}
                <div className={`shrink-0 p-2.5 rounded-full mr-4 ring-4 ring-white shadow-sm ${getIconColor(notification.priority)}`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-start justify-between mb-1">
                    <h4
                      className={`text-sm pr-2 transition-all truncate ${
                        isExpanded || !notification.isRead
                          ? "text-slate-800 font-extrabold"
                          : "font-semibold text-slate-600"
                      }`}
                    >
                      {notification.title}
                    </h4>

                    <div className="flex items-center gap-2 shrink-0 pt-0.5">
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {timeAgo(notification.createdAt)}
                      </span>
                      {/* 🎨 Updated pinging dot to a vibrant blue instead of red */}
                      {!notification.isRead && (
                        <span className="relative flex w-2.5 h-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00aaff] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00aaff]"></span>
                        </span>
                      )}
                    </div>
                  </div>

                  <p
                    className={`text-xs leading-relaxed transition-all duration-300 ${
                      isExpanded ? "text-slate-700" : "text-slate-500 line-clamp-2 font-medium"
                    }`}
                  >
                    {notification.message}
                  </p>

                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-slate-100/80 flex justify-between items-center">
                      <span className="px-2.5 py-1 text-[9px] font-extrabold tracking-wider rounded-md text-blue-600 bg-blue-50 uppercase border border-blue-100/50">
                        {notification.scope}
                      </span>
                      {notification.actionUrl && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(notification.actionUrl);
                          }}
                          // 🎨 Pill-shaped gradient button to match "Start Your Journey"
                          className="flex items-center gap-1.5 bg-gradient-to-r from-[#00bfff] to-[#007bff] text-white text-[11px] font-bold px-4 py-2 rounded-full hover:shadow-[0_4px_12px_rgba(0,123,255,0.3)] active:scale-95 transition-all transform hover:-translate-y-0.5"
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

      {isFetchingNextPage && (
        <div className="mt-3">
          <NotificationSkeleton />
        </div>
      )}

      {!hasNextPage && list.length > 0 && (
        <div className="py-8 text-center">
          <span className="px-5 py-2 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-400 tracking-widest uppercase shadow-sm">
            You're all caught up ✨
          </span>
        </div>
      )}

      {!isLoading && list.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="p-5 bg-slate-50 rounded-full mb-4 ring-8 ring-slate-50/50">
            <Bell className="w-10 h-10 text-slate-300" />
          </div>
          <p className="text-sm font-bold text-slate-500">
            No notifications yet
          </p>
          <p className="text-xs font-medium text-slate-400 mt-1">
            We'll let you know when something happens.
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationList;