const API_BASE_URL = 'http://localhost:5000/api/export';

// Trigger direct browser download for PDF reports using Puppeteer
export const downloadReportPDF = async (targetUrl) => {
    try {
        const downloadUrl = `${API_BASE_URL}/download?targetUrl=${encodeURIComponent(targetUrl)}`;
        const response = await fetch(downloadUrl);
        const blob = await response.blob();
        
        return { success: true, blob };
    } catch (error) {
        console.error("fetchPDFBlob Error:", error);
        return { success: false, message: "Server connection failed." };
    }
};