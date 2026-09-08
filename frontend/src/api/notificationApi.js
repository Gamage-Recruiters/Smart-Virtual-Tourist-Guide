import axios from "axios";

const API_URL = "http://localhost:5000/api/notifications";

// Helper to build the Authorization header from a JWT token
const authHeader = (token) => ({
  Authorization: `Bearer ${token}`,
});

export const fetchNotificationsApi = async (page, limit, token) => {
  const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}`, {
    headers: authHeader(token),
  });
  return response.data;
};

export const fetchUnreadCountApi = async (token) => {
  const response = await axios.get(`${API_URL}/unread-count`, {
    headers: authHeader(token),
  });
  return response.data;
};

export const markAsReadApi = async (notificationId, token) => {
  const response = await axios.patch(
    `${API_URL}/${notificationId}/read`,
    {},
    {
      headers: authHeader(token),
    },
  );
  return response.data;
};

export const markAllAsReadApi = async (token) => {
  const response = await axios.patch(
    `${API_URL}/mark-all-read`,
    {},
    { headers: authHeader(token) },
  );
  return response.data;
};

export const clearAllNotifications = async (token) => {
  const response = await axios.delete(`${API_URL}/clear-all-notifications`, {
    headers: authHeader(token),
  });
  return response.data;
};