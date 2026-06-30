const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

// Standardized single file upload endpoint under '/api/upload'
router.post('/', protect, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Cloudinary multer upload error details:', err);
      return res.status(400).json({ success: false, message: err.message, error: err });
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

module.exports = router;

