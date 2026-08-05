const API_BASE_URL = 'http://localhost:5000/api/email';

export const sendEmailReport = async (email, targetUrl) => {
    try {
        const response = await fetch(`${API_BASE_URL}/send-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, targetUrl }),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Email Service Error:", error);
        return { success: false, message: "Email service connection failed." };
    }
};