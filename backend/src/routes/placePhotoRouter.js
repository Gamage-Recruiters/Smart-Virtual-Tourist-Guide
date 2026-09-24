import express from 'express';
import { getPlacePhoto, createPlacePhoto, getSuggestions } from '../controllers/placePhotoController.js';

const router = express.Router();
router.get('/', getPlacePhoto);
router.post('/', createPlacePhoto);
router.post('/suggestions', getSuggestions);
export default router;
