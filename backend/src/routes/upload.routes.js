import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const diskUpload = multer({ storage: diskStorage });

// Standardized single file upload endpoint under '/api/upload'
router.post('/', protect, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.warn('Cloudinary upload warning, fallback to local disk upload:', err.message);
      return diskUpload.single('image')(req, res, (diskErr) => {
        if (diskErr) {
          console.error('Disk upload error details:', diskErr);
          return res.status(400).json({ success: false, message: diskErr.message, error: diskErr });
        }
        if (!req.file) {
          return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        const relativePath = `/uploads/${req.file.filename}`;
        return res.status(200).json({
          success: true,
          imageUrl: relativePath
        });
      });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }
      return res.status(200).json({
        success: true,
        imageUrl: req.file.path, // Cloudinary secure URL
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });
});

export default router;
