import axios from "axios";
const API_URL = "http://localhost:5000/api/user";

export const updateFCMTokenApi = async (userId, fcmToken) => {
  const token = localStorage.getItem("token");

  const response = await axios.patch(
    `${API_URL}/fcm-token`,
    {
      fcmToken: fcmToken,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
