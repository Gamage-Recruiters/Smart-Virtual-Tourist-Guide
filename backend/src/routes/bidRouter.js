import express from 'express';
const router = express.Router();
import { submitBid, getBidsByTrip, getBidsByUser, getBidsByDriver, getLowestBidByTrip } from '../controllers/bidController.js';


router.post('/', submitBid);

router.get('/:tripId', getBidsByTrip);

router.get('/user/:userId', getBidsByUser);

router.get('/driver/:driverName', getBidsByDriver);

router.get('/lowest/:tripId', getLowestBidByTrip);

export default router;