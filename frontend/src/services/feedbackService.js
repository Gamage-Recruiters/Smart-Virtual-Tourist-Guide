
const API_BASE_URL = 'http://localhost:5000/api/feedback/';

export const submitTripFeedback = async (feedbackData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(feedbackData),
        });
        const result = await response.json();
        return result; 
    } catch (error) {
        console.error("feedbackService Error:", error);
        return { success: false, message: "Server connection failed." };
    }
};

export const fetchTripFeedback = async (touristId, tripId) => {

    try {
        const response = await fetch(`${API_BASE_URL}/${touristId}/${tripId}`);
        const result = await response.json();
        return result; 
    } catch (error) {
        console.error("fetchTripFeedback Error:", error);
        return { success: false, message: "Server connection failed." };
    }
};