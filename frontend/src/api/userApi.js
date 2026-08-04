import axios from "axios";
const API_URL = "http://localhost:5000/api/user";

export const updateFCMTokenApi = async (userId, fcmToken) => {
  const response = await axios.patch(
    `${API_URL}/${userId}/fcm-token`, 
    { fcmToken: fcmToken }, 
  );
  return response.data;
};
