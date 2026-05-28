import multer from "multer";
import { cloudinary } from "../config/cloudinary.js";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];

  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Only JPG, PNG, and WEBP images are allowed"), false);
  }

  cb(null, true);
};

export const uploadActivityImages = multer({
  storage,
  fileFilter,
  limits: {
    files: 5,
    fileSize: 5 * 1024 * 1024,
  },
});

export const uploadActivityImagesToCloudinary = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      req.cloudinaryImages = [];
      return next();
    }

    const uploadOne = (file) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "activities",
            resource_type: "image",
          },
          (err, result) => {
            if (err) return reject(err);

            resolve({
              url: result.secure_url,
              public_id: result.public_id,
            });
          }
        );

        stream.end(file.buffer);
      });

    const results = await Promise.all(req.files.map(uploadOne));
    req.cloudinaryImages = results;

    next();
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    next(err);
  }
};