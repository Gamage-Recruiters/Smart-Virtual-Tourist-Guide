import mongoose from 'mongoose';
import getTestDb from '../../configs/HotelOwner/testDb.js';
import tempHotBookSchema from '../../models/HotelOwner/TempHotBook.js';
import { syncBookingToRoom } from '../../services/HotelOwner/bookingSync.js';
import jwt from 'jsonwebtoken';

const getModel = async () => {
    const conn = await getTestDb();
    return conn.models.TempHotBook || conn.model('TempHotBook', tempHotBookSchema.schema);
};

const getUserIdFromToken = (req) => {
    const authorization = req.headers.authorization;
    if (!authorization?.startsWith('Bearer ')) return null;
    try {
        const decoded = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET);
        return decoded.id || decoded._id || decoded.userId;
    } catch {
        return null;
    }
};

export const createBooking = async (req, res) => {
    try {
        const TempHotBook = await getModel();
        const booking = await TempHotBook.create(req.body);
        await syncBookingToRoom(booking);
        return res.status(201).json({ message: 'Booking created', booking });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const updateBooking = async (req, res) => {
    try {
        const TempHotBook = await getModel();
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id))
            return res.status(400).json({ message: 'Invalid booking id' });

        const existingBooking = await TempHotBook.findById(id).select('status');
        if (!existingBooking) return res.status(404).json({ message: 'Booking not found' });
        if (existingBooking.status === 'cancelled' && req.body.status && req.body.status !== 'cancelled') {
            return res.status(409).json({ message: 'Cancelled bookings cannot change status' });
        }

        const booking = await TempHotBook.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        await syncBookingToRoom(booking);
        return res.status(200).json({ message: 'Booking updated', booking });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const cancelBooking = async (req, res) => {
    try {
        const userId = getUserIdFromToken(req);
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { id } = req.params;
        const { refundType = null, refundAmount = 0, refundReason, accountablePerson } = req.body;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid booking id' });
        }
        if (!accountablePerson?.trim()) {
            return res.status(400).json({ message: 'Accountable Person is required' });
        }
        if (!refundReason?.trim()) {
            return res.status(400).json({ message: 'Cancellation reason is required' });
        }

        const TempHotBook = await getModel();
        const booking = await TempHotBook.findById(id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        const fullAmount = Number(booking.bookingPrice) || 0;
        const amount = refundType ? Number(refundAmount) : 0;
        if (refundType && (!Number.isFinite(amount) || amount < 0 || amount > fullAmount)) {
            return res.status(400).json({ message: 'Refund amount must be between 0 and the booking amount' });
        }

        const refundDate = refundType ? new Date() : undefined;
        const refundEntry = refundType
            ? { amount, reason: refundReason.trim(), date: refundDate }
            : null;

        booking.status = 'cancelled';
        booking.payment.accountablePerson = accountablePerson.trim();
        booking.payment.refundAmount = amount;
        booking.payment.refundReason = refundReason.trim();
        booking.payment.refundDate = refundDate;
        if (refundEntry) booking.payment.refundHistory.push(refundEntry);
        if (refundType === 'full') booking.payment.paymentStatus = 'full-refunded';
        if (refundType === 'partial') booking.payment.paymentStatus = 'partial-refunded';

        await booking.save();
        await syncBookingToRoom(booking);
        return res.status(200).json({ message: 'Booking cancelled', booking });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const getBookingsByHotel = async (req, res) => {
    try {
        const TempHotBook = await getModel();
        const { hotelId } = req.params;
        const bookings = await TempHotBook.find({ hotelId }).sort({ bookedDate: -1 });
        return res.status(200).json({ message: 'Bookings fetched', count: bookings.length, bookings });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
