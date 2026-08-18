import express from 'express';
import {
  createRentalRequest,
  getRentalRequests,
  submitVehicleBid,
  getVehicleBidsByRequest
} from '../controllers/vehicleRentalBidController.js';

const router = express.Router();

// Rental Requests Routes
router.post('/requests', createRentalRequest);
router.get('/requests', getRentalRequests);

// Bids Routes
router.post('/bids', submitVehicleBid);
router.get('/bids/:requestId', getVehicleBidsByRequest);

export default router;
