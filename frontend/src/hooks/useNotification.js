import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchNotificationsApi } from "../api/notificationApi";

export const useNotifications = (userId) => {
  return useInfiniteQuery({
    queryKey: ["notifications", userId],

    queryFn: ({ pageParam }) => fetchNotificationsApi(pageParam, 10, userId),

    getNextPageParam: (lastPage) => {
      if (lastPage.results === 10) {
        return lastPage.page + 1;
      }
      return undefined;
    },

    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};
