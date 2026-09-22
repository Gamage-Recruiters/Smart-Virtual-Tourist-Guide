import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Import Redux actions and API calls (Adjust paths if necessary)
import { toggleNotificationModal, markAsReadLocal } from "../store/slices/notificationSlice";
import { selectAuthToken } from "../store/selectors/authSelectors";
import { markAsReadApi } from "../api/notificationApi";

/**
 * CUSTOM HOOK: useNotificationNavigation
 * 
 * WHAT THIS DOES:
 * This hook handles exactly what happens when a user clicks on a Notification Toast or Card.
 * It closes the UI, marks the message as read in the database, and sends the user to the correct page.
 */
export const useNotificationNavigation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const token = useSelector(selectAuthToken);

  // 1. React Query Mutation to update the database in the background
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId) => markAsReadApi(notificationId, token),
    onSuccess: () => {
      // Refresh notification queries & unread count cache
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
    },
  });

  // 2. The Main Function triggered by the "View Details" click
  const handleNotificationClick = (notification) => {
    if (!notification) return;

    const { _id, actionUrl, actionData, isRead } = notification;

    // Step 1: Close the notification modal if open
    dispatch(toggleNotificationModal(false));

    // Step 2: If message not read yet, update local state & trigger API
    if (!isRead && _id) {
      dispatch(markAsReadLocal());
      markAsReadMutation.mutate(_id);
    }

    // Step 3: Deep-Linking (Page Navigation)
    if (actionUrl) {
      navigate(actionUrl, { state: actionData || {} });
    } else {
      console.warn("Deep-linking skipped: No actionUrl provided for this notification.");
    }
  };

  return { handleNotificationClick };
};