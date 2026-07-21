// controllers/pdfController.js
import puppeteer from 'puppeteer';


export const generatePDFBuffer = async (targetUrl) => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(targetUrl, { waitUntil: 'networkidle0' });
    await page.emulateMediaType('print');
    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '15mm', bottom: '15mm', left: '20mm', right: '20mm' }
    });
    await browser.close();
    return pdfBuffer;
}

export const downloadPDF = async (req, res) => {
    try {
        const { targetUrl } = req.query;
        if (!targetUrl) return res.status(400).json({ success: false, message: "Target URL required" });

        const pdfBuffer = await generatePDFBuffer(targetUrl);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="Exported_Report.pdf"');
        res.send(Buffer.from(pdfBuffer));
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
