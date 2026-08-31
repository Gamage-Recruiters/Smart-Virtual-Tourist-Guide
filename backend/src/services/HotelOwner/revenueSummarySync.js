import mongoose from 'mongoose';
import getTestDb from '../../configs/HotelOwner/testDb.js';
import tempHotBookSchema from '../../models/HotelOwner/TempHotBook.js';
import roomModelSchema from '../../models/HotelOwner/room.model.js';
import revenueSummarySchema from '../../models/HotelOwner/hotelRevenueSummar.js';

const getModels = async () => {
  const conn = await getTestDb();
  return {
    TempHotBook: conn.models.TempHotBook || conn.model('TempHotBook', tempHotBookSchema.schema),
    Room: conn.models.Room || conn.model('Room', roomModelSchema.schema),
    RevenueSummary: conn.models.hotelRevenueSummary
      || conn.model('hotelRevenueSummary', revenueSummarySchema.schema),
  };
};

const monthKey = (date) => `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;

const parseDate = (value) => {
  if (!value) return null;
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const startOfMonth = (date) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
const addMonths = (date, count) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + count, 1));

const overlapNights = (checkIn, checkOut, monthStart) => {
  const monthEnd = addMonths(monthStart, 1);
  const start = Math.max(checkIn.getTime(), monthStart.getTime());
  const end = Math.min(checkOut.getTime(), monthEnd.getTime());
  return end > start ? (end - start) / 86400000 : 0;
};

const emptySummary = (hotelId, month) => ({
  hotelId,
  month,
  metrics: { totalRevenue: 0, occupancyRate: 0, avgDailyRate: 0, revPAR: 0 },
  revenue: { revenue: 0 },
  revenueByRoomType: [],
  refunds: [],
});

export const syncRevenueSummaries = async () => {
  const { TempHotBook, Room, RevenueSummary } = await getModels();
  const currentMonth = startOfMonth(new Date());
  const firstMonth = addMonths(currentMonth, -5);
  const months = Array.from({ length: 6 }, (_, index) => addMonths(firstMonth, index));
  const monthKeys = months.map(monthKey);

  const bookings = await TempHotBook.find({
    'payment.paymentStatus': 'paid',
    'payment.payherePaymentId': { $exists: true, $ne: '' },
  }).lean();
  const hotelIds = [...new Set(bookings.map((booking) => booking.hotelId?.toString()).filter(Boolean))];
  const rooms = await Room.find({ hotelId: { $in: hotelIds.map((id) => new mongoose.Types.ObjectId(id)) } })
    .select('hotelId')
    .lean();
  const roomCounts = new Map();
  rooms.forEach((room) => {
    const id = room.hotelId.toString();
    roomCounts.set(id, (roomCounts.get(id) || 0) + 1);
  });

  const summaries = new Map();
  hotelIds.forEach((hotelId) => months.forEach((month) => {
    summaries.set(`${hotelId}:${monthKey(month)}`, emptySummary(hotelId, monthKey(month)));
  }));

  bookings.forEach((booking) => {
    const hotelId = booking.hotelId?.toString();
    const checkIn = parseDate(booking.checkIn);
    const checkOut = parseDate(booking.checkOut);
    if (!hotelId || !checkIn || !checkOut || checkOut <= checkIn) return;

    const grossAmount = Number(booking.bookingPrice ?? booking.pricing?.total) || 0;
    const refundAmount = Number(booking.payment?.refundAmount) || 0;
    const netAmount = grossAmount - refundAmount;
    const totalNights = (checkOut.getTime() - checkIn.getTime()) / 86400000;
    const netAmountPerNight = netAmount / totalNights;
    const roomCount = Number(booking.roomsCount) || 1;
    const roomType = booking.roomType || booking.roomName || 'Unknown';
    const refund = booking.payment?.refundTransactionId ? {
      refundTransactionId: booking.payment.refundTransactionId,
      amount: refundAmount,
      reason: booking.payment.refundReason || '',
      date: booking.payment.refundDate || null,
    } : null;

    months.forEach((month) => {
      const key = `${hotelId}:${monthKey(month)}`;
      const summary = summaries.get(key);
      const nights = overlapNights(checkIn, checkOut, month);
      if (!summary || nights <= 0) return;

      const monthlyRevenue = netAmountPerNight * nights;
      summary.revenue.revenue += monthlyRevenue;
      summary.metrics.totalRevenue += monthlyRevenue;
      summary._occupiedRoomNights = (summary._occupiedRoomNights || 0) + (nights * roomCount);
      const roomRevenue = summary.revenueByRoomType.find((entry) => entry.roomType === roomType);
      if (roomRevenue) roomRevenue.total += monthlyRevenue;
      else summary.revenueByRoomType.push({ roomType, total: monthlyRevenue });
      if (refund) summary.refunds.push(refund);
    });
  });

  const operations = [...summaries.values()].map((summary) => {
    const availableRoomNights = (roomCounts.get(summary.hotelId.toString()) || 0)
      * new Date(Date.UTC(Number(summary.month.slice(0, 4)), Number(summary.month.slice(5), 10), 0)).getUTCDate();
    const occupiedRoomNights = summary._occupiedRoomNights || 0;
    summary.metrics.occupancyRate = availableRoomNights
      ? (occupiedRoomNights / availableRoomNights) * 100 : 0;
    summary.metrics.avgDailyRate = occupiedRoomNights
      ? summary.metrics.totalRevenue / occupiedRoomNights : 0;
    summary.metrics.revPAR = availableRoomNights
      ? summary.metrics.totalRevenue / availableRoomNights : 0;
    delete summary._occupiedRoomNights;

    return {
      updateOne: {
        filter: { hotelId: summary.hotelId, month: summary.month },
        update: { $set: summary },
        upsert: true,
      },
    };
  });

  if (operations.length) await RevenueSummary.bulkWrite(operations);
  return { hotels: hotelIds.length, months: monthKeys.length, summaries: operations.length };
};
