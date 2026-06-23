// controllers/pdfController.js
const puppeteer = require('puppeteer');

// Generate and handle PDF download
const downloadPDF = async (req, res) => {
    try {
        const { targetUrl } = req.query; // Get the target React page URL from query

        if (!targetUrl) {
            return res.status(400).json({ 
                success: false, 
                message: "Target URL is required" 
            });
        }

        // 1. Launch a headless browser instance
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // Safe flags for linux/hosting servers
        });

        const page = await browser.newPage();

        // 2. Navigate to the React page and wait until all network requests are complete
        await page.goto(targetUrl, {
            waitUntil: 'networkidle0' // Waits until all API calls and images are loaded
        });

        await page.emulateMediaType('print');

        // 3. Generate A4 size PDF buffer
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true, // Forces background colors and gradients to print
            margin: {
                top: '15mm',
                bottom: '15mm',
                left: '20mm',
                right: '20mm'
            }
        });

        await browser.close();

        // 4. Send the PDF buffer as a direct attachment download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="Exported_Report.pdf"');
        res.send(Buffer.from(pdfBuffer)); 

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

module.exports = { downloadPDF };