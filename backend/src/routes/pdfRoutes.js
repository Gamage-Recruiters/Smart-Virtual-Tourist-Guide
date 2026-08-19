// routes/pdfRoutes.js
import express from 'express';
import { downloadPDF } from '../controllers/pdfController.js';

const router = express.Router();

// GET /api/export/download
router.get('/download', downloadPDF);

export default router;