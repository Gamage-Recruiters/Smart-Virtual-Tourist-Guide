// routes/pdfRoutes.js
const express = require('express');
const router = express.Router();
const { downloadPDF } = require('../controllers/pdfController');

// GET /api/export/download
router.get('/download', downloadPDF);

module.exports = router;