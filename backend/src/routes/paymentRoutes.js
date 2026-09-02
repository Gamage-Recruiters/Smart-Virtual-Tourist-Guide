import express from 'express';
import * as paymentController from '../controllers/paymentController.js';

const router = express.Router();

// Frontend calls this to get hash before opening PayHere popup
router.post('/generate-hash', paymentController.generateHash);

// PayHere server-to-server notification
router.post('/notify', paymentController.handleNotification);

// Confirm payment status by orderId
router.post('/confirm', paymentController.confirmPaymentByOrderId);

// Fetch booking by PayHere orderId
router.get('/booking/:orderId', paymentController.getBookingByOrderId);

export default router;

