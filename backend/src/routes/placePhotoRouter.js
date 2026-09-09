import express from 'express';
import { getPlacePhoto, createPlacePhoto } from '../controllers/placePhotoController.js';

const router = express.Router();
router.get('/', getPlacePhoto);
router.post('/', createPlacePhoto);
export default router;
