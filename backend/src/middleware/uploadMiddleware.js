import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary using generic/standard env variable names if provided,
// or fallback to placeholders. We recommend the user sets these in backend/.env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ddu7x0vyi',
  api_key: process.env.CLOUDINARY_API_KEY || '868267962453535',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'gqFm0V1EPlXp4jT_L766yYc_c1M',
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'svtg_restaurants',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

const upload = multer({ storage: storage });

export default upload;
