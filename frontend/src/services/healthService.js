const API_BASE_URL = 'http://localhost:5000/api/health'; 

export const fetchVaccinations = async (touristId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/vaccinations/${touristId}`);
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("Error in fetchVaccinations service:", error);
        return { success: false, message: "Server connection failed." };
    }
};

export const fetchIncidentCount = async (touristId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/incidents/count/${touristId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error in fetchIncidentCount service:", error);
        return { success: false, message: "Server connection failed." };
    }
};