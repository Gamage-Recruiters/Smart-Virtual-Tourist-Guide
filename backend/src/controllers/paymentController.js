import { generatePaymentHash, verifyNotification } from '../services/paymentService.js';
import { getBookingModel } from './bookingController.js';

/**
 * POST /api/payments/generate-hash
 * Frontend calls this to get the hash before opening PayHere popup.
 */
export const generateHash = async (req, res, next) => {
  try {
    const { orderId, amount, currency } = req.body;

    if (!orderId || !amount || !currency) {
      return res.status(400).json({ success: false, message: 'orderId, amount, and currency are required.' });
    }

    const hash = generatePaymentHash({ orderId, amount, currency });

    res.json({
      success: true,
      merchant_id: process.env.PAYHERE_MERCHANT_ID,
      hash,
      order_id: orderId,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/payments/notify
 * PayHere sends server-to-server POST when payment completes.
 */
export const handleNotification = async (req, res) => {
  try {
    const {
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
    } = req.body;

    // Verify signature
    const isValid = verifyNotification({
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
    });

    if (!isValid) {
      console.error('PayHere notification: invalid signature for order', order_id);
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // status_code 2 = success
    if (status_code === '2') {
      // Try to find and update booking across all models
      const allTypes = ['activity', 'driver', 'guide', 'hotel', 'restaurant', 'vehicle'];

      for (const type of allTypes) {
        const Model = getBookingModel(type);
        const booking = await Model.findOne({ 'payment.payhereOrderId': order_id });

        if (booking) {
          booking.status = 'confirmed';
          booking.payment.method = 'payhere';
          booking.payment.payherePaymentId = req.body.payment_id || null;
          booking.payment.paidAt = new Date();
          await booking.save();
          console.log(`PayHere notify: Booking ${booking._id} confirmed via server notification.`);
          break;
        }
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('PayHere notification error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * POST /api/payments/confirm
 * Client calls this when PayHere payment completes to mark booking confirmed.
 */
export const confirmPaymentByOrderId = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'orderId is required.' });
    }

    const allTypes = ['activity', 'driver', 'guide', 'hotel', 'restaurant', 'vehicle'];
    for (const type of allTypes) {
      const Model = getBookingModel(type);
      const booking = await Model.findOne({ 'payment.payhereOrderId': orderId });
      if (booking) {
        booking.status = 'confirmed';
        booking.payment.method = 'payhere';
        booking.payment.paidAt = new Date();
        await booking.save();
        return res.json({ success: true, booking, serviceType: type });
      }
    }

    return res.status(404).json({ success: false, message: 'Booking not found for orderId: ' + orderId });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/payments/booking/:orderId
 * Fetch booking details by PayHere orderId.
 */
export const getBookingByOrderId = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const allTypes = ['activity', 'driver', 'guide', 'hotel', 'restaurant', 'vehicle'];

    for (const type of allTypes) {
      const Model = getBookingModel(type);
      const booking = await Model.findOne({ 'payment.payhereOrderId': orderId });
      if (booking) {
        return res.json({ success: true, booking, serviceType: type });
      }
    }

    return res.status(404).json({ success: false, message: 'Booking not found for orderId: ' + orderId });
  } catch (error) {
    next(error);
  }
};

