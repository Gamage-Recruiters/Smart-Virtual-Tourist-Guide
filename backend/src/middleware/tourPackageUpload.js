import multer from 'multer';

// Memory storage so files are available in req.files as Buffers for Cloudinary streaming
const memStorage = multer.memoryStorage();

export const uploadTourPhotos = multer({
  storage: memStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file limit
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Only JPEG, JPG, PNG, and WEBP images are allowed'), false);
    }
  },
});
