import { v2 as cloudinary } from 'cloudinary';
import CloudinaryStorage from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary with user-provided credentials
cloudinary.config({
  cloud_name: 'dvnqb7osc',
  api_key: '732949338888659',
  api_secret: 'Oz4hzhHDewIpkEdj5DiuwlMBVk0',
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'driver_documents',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

// Create upload middleware configured for driver documents
const uploadDriverDocs = multer({ storage: storage });

export {
  cloudinary,
  uploadDriverDocs,
};