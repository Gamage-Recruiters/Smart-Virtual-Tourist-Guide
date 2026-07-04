const multer = require('multer');
const CloudinaryStorage = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Profile photo upload
const profilePhotoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'profiles/photos',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [
      { width: 500, height: 500, crop: 'fill', gravity: 'face' },
      { quality: 'auto:good' }
    ]
  }
});

// Gallery image upload
const galleryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'profiles/gallery',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [
      { width: 1200, height: 800, crop: 'limit' },
      { quality: 'auto:good' }
    ]
  }
});

// Document upload
const documentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'profiles/documents',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf']
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed.'), false);
  }
};

const uploadProfilePhoto = multer({
  storage: profilePhotoStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter
});

const uploadGallery = multer({
  storage: galleryStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter
});

const uploadDocument = multer({
  storage: documentStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter
});

module.exports = { uploadProfilePhoto, uploadGallery, uploadDocument };
