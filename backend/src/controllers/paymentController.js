import { generatePaymentHash, verifyNotification } from '../services/paymentService.js';
import { getBookingModel } from './bookingController.js';

/**
 * POST /api/payments/generate-hash
 * Frontend calls this to get the hash before opening PayHere popup.
 */
export const generateHash = async (req, res, next) => {
  try {
    const { bookingId, serviceType } = req.body;

    if (!bookingId || !serviceType) {
      return res.status(400).json({ success: false, message: 'bookingId and serviceType are required.' });
    }

    const Model = getBookingModel(serviceType);
    const booking = await Model.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    const amount = booking.pricing.total;
    const currency = booking.pricing.currency || 'LKR';
    const orderId = booking._id.toString();

    const hash = generatePaymentHash({ orderId, amount, currency });

    // Update the booking to link the PayHere order ID
    booking.payment.payhereOrderId = orderId;
    await booking.save();

    res.json({
      success: true,
      merchant_id: process.env.PAYHERE_MERCHANT_ID,
      hash,
      order_id: orderId,
      amount,
      currency
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
      let bookingFound = false;

      for (const type of allTypes) {
        const Model = getBookingModel(type);
        const booking = await Model.findOne({ 'payment.payhereOrderId': order_id });

        if (booking) {
          bookingFound = true;
          
          // ✅ IDEMPOTENCY CHECK: Prevent replay attacks
          if (booking.status === 'confirmed') {
            console.log(`PayHere notify: Booking ${booking._id} is already confirmed. Ignoring replay.`);
            return res.sendStatus(200); // Already processed
          }

          // ✅ SERVER-SIDE VALIDATION: Check if amount paid is sufficient
          if (parseFloat(payhere_amount) < booking.pricing.total) {
            console.error(`PayHere notify: Invalid amount paid for booking ${booking._id}. Expected: ${booking.pricing.total}, Paid: ${payhere_amount}`);
            booking.status = 'payment_failed';
            await booking.save();
            return res.status(400).json({ error: 'Invalid amount paid' });
          }

          booking.status = 'confirmed';
          booking.payment.method = 'payhere';
          booking.payment.payherePaymentId = req.body.payment_id || null;
          booking.payment.paidAt = new Date();
          await booking.save();
          console.log(`PayHere notify: Booking ${booking._id} confirmed via server notification.`);
          break;
        }
      }
      
      if (!bookingFound) {
        console.error(`PayHere notify: Booking not found for order_id ${order_id}`);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('PayHere notification error:', error.message);
    res.status(500).json({ error: error.message });
  }
};
