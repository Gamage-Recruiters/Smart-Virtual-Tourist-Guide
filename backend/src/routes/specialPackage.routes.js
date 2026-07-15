import express from 'express';
import upload from '../middleware/upload.middleware.js';
import { createPackage, getAllPackages, getPackageById, updatePackage, deletePackage } from '../controllers/specialPackage.controller.js';

const router = express.Router();

router.route('/')
    .post(upload.array('images', 4), createPackage)
    .get(getAllPackages);

router.route('/:id')
    .get(getPackageById)
    .put(upload.array('images', 4), updatePackage)
    .delete(deletePackage);

export default router;
