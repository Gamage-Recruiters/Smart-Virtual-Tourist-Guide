import express from 'express';
import {
	getRevenueSummariesByHotel,
	syncRevenueSummariesForHotel,
} from '../../controllers/HotelOwner/hotelRevenueSummary.controller.js';

const router = express.Router();

router.get('/hotel/:hotelId', getRevenueSummariesByHotel);
router.post('/hotel/:hotelId/sync', syncRevenueSummariesForHotel);

export default router;