import express from 'express';
import { getBidsByTrip, submitBid, hireBid } from '../controllers/bidController.js';

const router = express.Router();

// GET /api/bids - fetch all bids
router.get('/', getBidsByTrip);

// GET /api/bids/:tripId - fetch bids for specific trip
router.get('/:tripId', getBidsByTrip);

// POST /api/bids - submit new bid
router.post('/', submitBid);

// PUT /api/bids/hire/:bidId - hire driver bid
router.put('/hire/:bidId', hireBid);

export default router;
