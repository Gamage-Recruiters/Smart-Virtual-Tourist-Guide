import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchNotificationsApi } from "../api/notificationApi";

export const useNotifications = (userId, token) => {
  return useInfiniteQuery({
    queryKey: ["notifications", userId],

    queryFn: ({ pageParam }) => fetchNotificationsApi(pageParam, 10, token),

    getNextPageParam: (lastPage) => {
      if (lastPage.results === 10) {
        return lastPage.page + 1;
      }
      return undefined;
    },

    enabled: !!userId && !!token,
    staleTime: 1000 * 60 * 5,
  });
};
