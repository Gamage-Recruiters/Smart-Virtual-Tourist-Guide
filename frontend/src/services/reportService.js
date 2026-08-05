const API_BASE_URL = 'http://localhost:5000/api/reports';

export const fetchTouristArrivalStats = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/tourist-stats`);
        const result = await response.json();
        return result; 
    } catch (error) {
        console.error("Error in reportService:", error);
        return { success: false, message: "Server connection failed." };
    }
};