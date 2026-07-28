const API_BASE_URL = 'http://localhost:5000/api/budget';

export const fetchBudgetAllocation = async (touristId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/allocation/${touristId}`);
        const result = await response.json();
        
        return result; 
    } catch (error) {
        console.error("fetchBudgetAllocation Error:", error);
        return { success: false, message: "Server connection failed." };
    }
};