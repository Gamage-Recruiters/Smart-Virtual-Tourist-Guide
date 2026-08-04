import axios from "axios";

const API_URL = "http://localhost:5000/api/notifications";

const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const fetchNotificationsApi = async (page, limit, token) => {
  const response = await axios.get(
    `${API_URL}?page=${page}&limit=${limit}`,
    authHeaders(token),
  );
  return response.data;
};

export const fetchUnreadCountApi = async (token) => {
  const response = await axios.get(
    `${API_URL}/unread-count`,
    authHeaders(token),
  );
  return response.data;
};

export const markAsReadApi = async (notificationId, token) => {
  const response = await axios.patch(
    `${API_URL}/${notificationId}/read`,
    {},
    authHeaders(token),
  );
  return response.data;
};

export const markAllAsReadApi = async (token) => {
  const response = await axios.patch(
    `${API_URL}/mark-all-read`,
    {},
    authHeaders(token),
  );
  return response.data;
};

export const clearAllNotifications = async (token) => {
  const response = await axios.delete(
    `${API_URL}/clear-all-notifications`,
    authHeaders(token),
  );
  return response.data;
};
