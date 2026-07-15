import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Import Redux actions and API calls (Adjust paths if necessary)
import { toggleNotificationModal } from "../store/slices/notificationSlice";
import { markAsReadApi } from "../api/notificationApi";

/**
 * CUSTOM HOOK: useNotificationNavigation
 * 
 * WHAT THIS DOES:
 * This hook handles exactly what happens when a user clicks on a Notification Toast or Card.
 * It closes the UI, marks the message as read in the database, and sends the user to the correct page.
 * 
 * ---------------------------------------------------------------------------
 * 🗺️ GUIDE FOR NAVIGATION & MAPPING TEAM (How to use this):
 * ---------------------------------------------------------------------------
 * When this hook navigates a user to your Map page (e.g., actionUrl: "/safety/map"),
 * it passes extra data like { lat: 6.9, lng: 79.8 } hidden in the Router State.
 * 
 * To catch this location data inside your Map component, write this code:
 * 
 *    import { useLocation } from "react-router-dom";
 * 
 *    const MyMapComponent = () => {
 *       const location = useLocation();
 *       const alertData = location.state; // This will contain { lat: ..., lng: ... }
 *       
 *       // Now you can use alertData.lat and alertData.lng to zoom your map!
 *    }
 * ---------------------------------------------------------------------------
 */
export const useNotificationNavigation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // 1. React Query Mutation to update the database in the background
  // This tells the backend that the user has read this specific notification.
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId) => markAsReadApi(notificationId),
    onSuccess: () => {
      // Refresh the cache to instantly remove the "Unread" blue dot from the UI
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // 2. The Main Function triggered by the "View Details" click
  const handleNotificationClick = (notification) => {
    // Safety check: Do nothing if the notification object is empty
    if (!notification) return;

    // Extract necessary data from the notification payload
    const { _id, actionUrl, actionData, isRead } = notification;

    // Step 1: Close the notification modal if it's currently open
    dispatch(toggleNotificationModal(false));

    // Step 2: If the message has not been read yet, trigger the API to mark it as read
    if (!isRead && _id) {
      markAsReadMutation.mutate(_id);
    }

    // Step 3: Deep-Linking (Page Navigation)
    // Send the user to the specific page and pass the actionData (like map coordinates) along with them
    if (actionUrl) {
      navigate(actionUrl, { state: actionData || {} });
    } else {
      console.warn("Deep-linking skipped: No actionUrl provided for this notification.");
    }
  };

  // Export the function so it can be used inside ToastItem and NotificationCard components
  return { handleNotificationClick };
};