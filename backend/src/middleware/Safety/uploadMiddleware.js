import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dvnqb7osc',
  api_key: process.env.CLOUDINARY_API_KEY || '732949338888659',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'Oz4hzhHDewIpkEdj5DiuwlMBVk0',
});

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tourist-guide-incidents',
    allowed_formats: ['jpeg', 'jpg', 'png', 'gif', 'webp'],
  },
});

// File filter (optional, as allowed_formats handles extension filtering)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
});

export default upload;

