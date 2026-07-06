import axios from "axios";

const API_URL = "http://localhost:5000/api/notifications";

export const fetchNotificationsApi = async (page, limit, userId) => {
  const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}`, {
    headers: { "user-id": userId },
  });
  return response.data;
};

export const fetchUnreadCountApi = async (userId) => {
  const response = await axios.get(`${API_URL}/unread-count`, {
    headers: { "user-id": userId },
  });
  return response.data;
};

export const markAsReadApi = async (notificationId, userId) => {
  const response = await axios.patch(
    `${API_URL}/${notificationId}/read`,
    {},
    {
      headers: { "user-id": userId },
    },
  );
  return response.data;
};

export const markAllAsReadApi = async (userId) => {
  const response = await axios.patch(
    `${API_URL}/mark-all-read`,
    {},
    { headers: { "user-id": userId } },
  );
  return response.data;
};

export const clearAllNotifications = async (userId) => {
  const response = await axios.delete(`${API_URL}/clear-all-notifications`, {
    headers: { "user-id": userId },
  });
  return response.data;
};
