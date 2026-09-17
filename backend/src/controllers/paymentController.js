import { generatePaymentHash, verifyNotification } from '../services/paymentService.js';
import { getBookingModel } from './bookingController.js';
import TouristDashboardBooking from '../models/TouristDashboard/Booking.js';

/**
 * POST /api/payments/generate-hash
 * Frontend calls this to get the hash before opening PayHere popup.
 */
export const generateHash = async (req, res, next) => {
  try {
    const { bookingId, serviceType } = req.body;

    if (!bookingId) {
      return res.status(400).json({ success: false, message: 'bookingId is required.' });
    }

    let booking = null;
    if (serviceType) {
      const Model = getBookingModel(serviceType);
      booking = await Model.findById(bookingId).catch(() => null);
    }

    if (!booking) {
      const allTypes = ['activity', 'driver', 'guide', 'hotel', 'restaurant', 'vehicle'];
      for (const type of allTypes) {
        const Model = getBookingModel(type);
        booking = await Model.findById(bookingId).catch(() => null);
        if (booking) break;
      }
    }

    if (!booking && String(bookingId).match(/^[0-9a-fA-F]{24}$/)) {
      booking = await TouristDashboardBooking.findById(bookingId).catch(() => null);
    }

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    const rawAmount = booking.pricing?.total || booking.priceUSD || req.body.amount || 0;
    const amountNum = Number(rawAmount);
    const amount = amountNum.toFixed(2);
    const currency = String(booking.pricing?.currency || 'LKR').trim();
    const orderId = booking._id.toString().trim();

    const hash = generatePaymentHash({ orderId, amount: amountNum, currency });

    // Update the booking to link the PayHere order ID if payment object exists
    if (booking.payment) {
      booking.payment.payhereOrderId = orderId;
      await booking.save();
    }

    res.json({
      success: true,
      merchant_id: String(process.env.PAYHERE_MERCHANT_ID || '').trim(),
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
 * POST /api/payments/confirm
 * Client-side fallback to confirm booking payment when window.payhere.onCompleted fires.
 */
export const confirmPayment = async (req, res, next) => {
  try {
    const { orderId, paymentId } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'orderId is required' });
    }

    const allTypes = ['activity', 'driver', 'guide', 'hotel', 'restaurant', 'vehicle'];
    let bookingFound = false;

    for (const type of allTypes) {
      const Model = getBookingModel(type);
      let booking = await Model.findOne({ 'payment.payhereOrderId': orderId }).catch(() => null);
      if (!booking && String(orderId).match(/^[0-9a-fA-F]{24}$/)) {
        booking = await Model.findById(orderId).catch(() => null);
      }

      if (booking) {
        bookingFound = true;
        booking.status = 'confirmed';
        if (!booking.payment) booking.payment = {};
        booking.payment.method = 'payhere';
        booking.payment.payhereOrderId = orderId;
        if (paymentId) booking.payment.payherePaymentId = paymentId;
        booking.payment.paidAt = new Date();
        await booking.save();
        return res.json({ success: true, booking });
      }
    }

    if (!bookingFound && String(orderId).match(/^[0-9a-fA-F]{24}$/)) {
      const tdBooking = await TouristDashboardBooking.findById(orderId).catch(() => null);
      if (tdBooking) {
        tdBooking.status = 'Confirmed';
        await tdBooking.save();
        return res.json({ success: true, booking: tdBooking });
      }
    }

    if (!bookingFound) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
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
        let booking = await Model.findOne({ 'payment.payhereOrderId': order_id });
        if (!booking && String(order_id).match(/^[0-9a-fA-F]{24}$/)) {
          booking = await Model.findById(order_id);
        }

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
