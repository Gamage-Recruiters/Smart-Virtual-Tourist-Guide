import mongoose from 'mongoose';
import getTestDb from '../../configs/HotelOwner/testDb.js';
import roomModelSchema from '../../models/HotelOwner/room.model.js';
import tempHotBookSchema from '../../models/HotelOwner/TempHotBook.js';

const getRoomModel = async () => {
  const conn = await getTestDb();
  return conn.models.Room || conn.model('Room', roomModelSchema.schema);
};

const getTempHotBookModel = async () => {
  const conn = await getTestDb();
  return conn.models.TempHotBook || conn.model('TempHotBook', tempHotBookSchema.schema);
};

const normalizeDate = (value) => {
  const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
};

/**
 * Sync a single booking into the matching room's bookingDates.
 * Join keys: hotelId + roomNo → roomNumber
 * Uses bookingNo as the note key to prevent duplicates and handle updates.
 */
export const syncBookingToRoom = async (booking) => {
  const { hotelId, roomNo, checkIn, checkOut, bookingNo } = booking;
  if (!hotelId || !roomNo) return;

  const Room = await getRoomModel();

  // Both rooms and tempHotBook now store hotelId as ObjectId
  const hotelIdObj = new mongoose.Types.ObjectId(hotelId.toString());
  const filter = { hotelId: hotelIdObj, roomNumber: roomNo };

  // Remove stale entry for this bookingNo first (handles updates)
  await Room.updateOne(filter, { $pull: { bookingDates: { note: bookingNo || '' } } });

  // Terminal bookings stay in tempHotBook but release all room nights.
  if (['cancelled', 'checked-out'].includes(booking.status)) return;

  if (!checkIn || !checkOut) return;
  const startDate = normalizeDate(checkIn);
  const endDate   = normalizeDate(checkOut);
  if (!startDate || !endDate || endDate <= startDate) return;

  // Push the fresh entry
  await Room.updateOne(filter, { $push: { bookingDates: { startDate, endDate, note: bookingNo || '' } } });
};

/**
 * Full sync — iterates all tempHotBook documents and upserts their
 * checkIn/checkOut into the corresponding room's bookingDates.
 */
export const syncAllBookingsToRooms = async () => {
  const TempHotBook = await getTempHotBookModel();
  const bookings = await TempHotBook.find();

  let synced = 0;
  let failed = 0;

  for (const booking of bookings) {
    try {
      await syncBookingToRoom(booking);
      synced++;
    } catch {
      failed++;
    }
  }

  return { synced, failed, total: bookings.length };
};
