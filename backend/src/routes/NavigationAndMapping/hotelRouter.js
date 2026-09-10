import express from 'express';
import { getHotels } from '../../controllers/NavigationAndMapping/hotelController.js';

const router = express.Router();

router.get('/', getHotels);

export default router;
