import express from 'express';
const router = express.Router();
import { submitBid, getBidsByTrip } from '../controllers/bidController.js';


router.post('/', submitBid);

router.get('/:tripId', getBidsByTrip);

export default router;