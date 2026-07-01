const API_BASE_URL = 'http://localhost:5000/api/safety/incidents'; 

export const fetchIncidentCount = async (touristId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/count?touristId=${touristId}`);
        const data = await response.json();
        
        return data; 
    } catch (error) {
        console.error("Error in fetchIncidentCount service:", error);
        return { success: false, message: "Server connection failed." };
    }
};