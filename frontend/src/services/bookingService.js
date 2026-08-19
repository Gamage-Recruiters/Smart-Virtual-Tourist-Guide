const API_BASE_URL = 'http://localhost:5000/api/booking';

export const fetchMyBookings = async (email) => {
    try {
        const response = await fetch(`${API_BASE_URL}/my-bookings/${encodeURIComponent(email)}`);
        return await response.json();
    } catch (error) {
        console.error("fetchMyBookings Error:", error);
        return { success: false, message: "Connection failed." };
    }
};