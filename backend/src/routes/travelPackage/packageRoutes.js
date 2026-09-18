import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { createPackage, getPackage, updatePackage, searchPackages, getAllPackages, getPackagesCount, deletePackage } from '../../controllers/travelPackage/packageController.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const router = express.Router();
const upload = multer({ dest: path.join(__dirname, '../../uploads/travelPackage') });

router.post('/', upload.array('images', 50), createPackage);
router.get('/search', searchPackages);
router.get('/count', getPackagesCount);
router.get('/:id', getPackage);
router.put('/:id', upload.array('images', 50), updatePackage);
router.delete('/:id', deletePackage);

// This must be AFTER /:id to avoid conflicts
router.get('/', getAllPackages);

export default router;
