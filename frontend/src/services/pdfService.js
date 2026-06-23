const API_BASE_URL = 'http://localhost:5000/api/export';

// Trigger direct browser download for PDF reports using Puppeteer
export const downloadReportPDF = (targetUrl) => {
    if (!targetUrl) return;

    // 1. Generate the secure download URL with the target URL as a parameter
    const downloadUrl = `${API_BASE_URL}/download?targetUrl=${encodeURIComponent(targetUrl)}`;

    // 2. Force browser to download the file using window.location.href
    window.location.href = downloadUrl;
};