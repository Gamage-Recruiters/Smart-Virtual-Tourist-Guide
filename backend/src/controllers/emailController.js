require('dotenv').config();
const nodemailer = require('nodemailer');
const { generatePDFBuffer } = require('./pdfController');

const sendEmail = async (req, res) => {
    try {
        const { email, targetUrl } = req.body;

        const pdfBuffer = await generatePDFBuffer(targetUrl);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: `"SVTG Guide" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your Trip Report',
            text: 'Please find your trip report attached.',
            attachments: [{ filename: 'Trip_Report.pdf', content: pdfBuffer }]
        });

        res.json({ success: true, message: 'Email sent!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { sendEmail };