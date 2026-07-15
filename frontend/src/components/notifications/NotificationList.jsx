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

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId) => markAsReadApi(notificationId, userId),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: ["notifications", userId] });
      const previousNotifications = queryClient.getQueryData(["notifications", userId]);

      queryClient.setQueryData(["notifications", userId], (oldData) => {
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
        queryClient.setQueryData(["notifications", userId], context.previousNotifications);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
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
      <div className="p-4 text-[#E53935] text-center text-xs">
        Error loading notifications.
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto p-4 custom-scrollbar" onScroll={handleScroll}>
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
          return (
            <div
              key={notification._id}
              onClick={() => handleNotificationClick(notification)}
              className={`group relative flex flex-col p-4 cursor-pointer rounded-[12px] transition-all duration-300 border border-[#F4F9FF] shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] ${
                notification.isRead
                  ? "bg-[#FFFFFF] border-[#F4F9FF]"
                  : `bg-[#F4F9FF] ${getLeftBorderColor(notification.priority)}`
              } ${isExpanded ? "ring-1 ring-[#F4F9FF]" : ""}`}
            >
              <div className="flex items-start">
                <div className={`shrink-0 p-2.5 rounded-full mr-4 ${getIconColor(notification.priority)}`}>
                  {getCategoryIcon(notification.category)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4
                      className={`text-sm pr-2 transition-all truncate ${
                        isExpanded
                          ? "text-[#111111] font-semibold"
                          : notification.isRead
                            ? "font-semibold text-[#111111]"
                            : "font-semibold text-[#111111]"
                      }`}
                    >
                      {notification.title}
                    </h4>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-[#111111]/70 font-medium">
                        {timeAgo(notification.createdAt)}
                      </span>
                      {!notification.isRead && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E53935] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E53935]"></span>
                        </span>
                      )}
                    </div>
                  </div>

                  <p
                    className={`text-xs leading-relaxed transition-all duration-300 ${
                      isExpanded ? "text-[#111111]" : "text-[#111111]/70 line-clamp-2"
                    }`}
                  >
                    {notification.message}
                  </p>

                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-[#F4F9FF] flex justify-between items-center">
                      <span className="px-2 py-0.5 text-[9px] font-bold tracking-wider rounded text-[#111111]/70 bg-[#FFFFFF] uppercase">
                        {notification.scope}
                      </span>
                      {notification.actionUrl && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(notification.actionUrl);
                          }}
                          className="flex items-center gap-1 bg-[#111111] text-[#FFFFFF] text-[11px] font-semibold px-4 py-1.5 rounded-[12px] hover:bg-[#E53935] active:scale-95 transition-all"
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
        <div className="text-center py-8">
          <span className="px-4 py-1.5 rounded-full bg-[#F4F9FF] text-[10px] font-semibold text-[#111111]/70 tracking-widest uppercase">
            End of updates
          </span>
        </div>
      )}

      {!isLoading && list.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-[#111111]/60">
          <Bell className="w-12 h-12 mb-3 opacity-10" />
          <p className="text-sm font-semibold italic text-[#111111]/60">
            No notifications found.
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
