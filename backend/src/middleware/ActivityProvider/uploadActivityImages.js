import multer from "multer";
import { cloudinary } from "../../configs/ActivityProvider/cloudinary.js";
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

    const hasCloudinaryConfig = Boolean(
      process.env.CLOUDINARY_URL ||
      (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
    );

    if (!hasCloudinaryConfig) {
      req.cloudinaryImages = (req.files || []).map((file) => ({
        url: `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
        public_id: null,
      }));

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
    const fallbackImages = (req.files || []).map((file) => ({
      url: `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
      public_id: null,
    }));

    console.warn("Cloudinary upload unavailable, storing images inline.");
    req.cloudinaryImages = fallbackImages;
    next();
  }
};