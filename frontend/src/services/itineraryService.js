// src/services/itineraryService.js

const API_BASE_URL = 'http://localhost:5000/api/itinerary';

export const fetchItinerary = async (touristId, tripId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${touristId}/${tripId}`);
        const result = await response.json();
        return result; 
    } catch (error) {
        console.error("itineraryService Error:", error);
        return { success: false, message: "Server connection failed." };
    }
};

export const fetchTripStats = async (touristId, tripId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/trip-stats/${touristId}/${tripId}`);
        const result = await response.json();
        return result; 
    } catch (error) {
        console.error("fetchTripStats Error:", error);
        return { success: false, message: "Server connection failed." };
    }
};