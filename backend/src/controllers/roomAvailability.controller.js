import mongoose from 'mongoose';
import Room from '../models/room.model.js';
import RoomAvailability from '../models/roomAvailability.model.js';

const ALLOWED_STATUSES = ['Available', 'Non Available', 'Maintenance'];

const handleError = (res, error) => {
    if (error?.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Validation failed',
            details: Object.values(error.errors).map((item) => item.message),
        });
    }
    return res.status(500).json({ message: 'Internal server error' });
};

// Normalize any date input to midnight UTC so "date" always represents just the day
const normalizeDate = (dateInput) => {
    const d = new Date(dateInput);
    d.setUTCHours(0, 0, 0, 0);
    return d;
};

const daysInMonth = (month, year) => new Date(year, month, 0).getDate();

/**
 * @desc  Get the full availability calendar for every room of a given room type, for one month
 *        Powers: "Total Rooms", "Room Capacity", "Visual Availability" grid and the
 *        25-mini-calendar grid on the ViewRoomAvailabilityCalendar page
 * @route GET /api/room-availability/calendar?roomType=Deluxe Double Room&month=7&year=2026
 */
export const getMonthlyCalendar = async (req, res) => {
    try {
        const { roomType, month, year } = req.query;

        if (!roomType || !month || !year) {
            return res.status(400).json({ message: 'roomType, month and year are required' });
        }

        const monthNum = Number(month);
        const yearNum = Number(year);
        const totalDays = daysInMonth(monthNum, yearNum);

        // All rooms belonging to this room type (each is its own document, e.g. R1, R2 ...)
        const rooms = await Room.find({ roomType }).sort({ roomNumber: 1 });

        if (rooms.length === 0) {
            return res.status(200).json({
                message: 'No rooms found for this room type',
                roomType,
                totalRooms: 0,
                capacity: { adults: 0, children: 0 },
                month: monthNum,
                year: yearNum,
                totalDays,
                rooms: [],
            });
        }

        const rangeStart = normalizeDate(new Date(yearNum, monthNum - 1, 1));
        const rangeEnd = normalizeDate(new Date(yearNum, monthNum - 1, totalDays));
        const roomIds = rooms.map((r) => r._id);

        // Fetch every override record for this month, for these rooms, in one query
        const records = await RoomAvailability.find({
            room: { $in: roomIds },
            date: { $gte: rangeStart, $lte: rangeEnd },
        });

        // Quick lookup: "roomId_dayNumber" -> { status, note }
        const statusLookup = {};
        records.forEach((rec) => {
            const day = new Date(rec.date).getUTCDate();
            statusLookup[`${rec.room.toString()}_${day}`] = { status: rec.status, note: rec.note };
        });

        const todayKey = normalizeDate(new Date()).getTime();

        const roomsCalendar = rooms.map((room) => {
            const days = [];
            let currentStatus = 'Available'; // status "right now" - used for the visual grid snapshot

            for (let day = 1; day <= totalDays; day++) {
                const cellDate = normalizeDate(new Date(yearNum, monthNum - 1, day));
                const override = statusLookup[`${room._id.toString()}_${day}`];
                const status = override ? override.status : 'Available';

                days.push({
                    day,
                    date: cellDate,
                    status,
                    note: override ? override.note : '',
                });

                if (cellDate.getTime() === todayKey) {
                    currentStatus = status;
                }
            }

            return {
                roomId: room._id,
                roomNumber: room.roomNumber,
                roomName: room.roomName,
                currentStatus,
                days,
            };
        });

        // Room type "level" info - Room Capacity currently lives on each room document,
        // so we surface the capacity of the first room as representative of the type.
        const capacity = rooms[0].capacity || { adults: 0, children: 0 };

        res.status(200).json({
            message: 'Room availability calendar fetched successfully',
            roomType,
            totalRooms: rooms.length,
            capacity,
            month: monthNum,
            year: yearNum,
            totalDays,
            rooms: roomsCalendar,
        });
    } catch (error) {
        return handleError(res, error);
    }
};

/**
 * @desc  Get a single room's full month calendar (used by the popup modal)
 * @route GET /api/room-availability/room/:roomId?month=7&year=2026
 */
export const getRoomCalendar = async (req, res) => {
    try {
        const { roomId } = req.params;
        const { month, year } = req.query;

        if (!mongoose.isValidObjectId(roomId)) {
            return res.status(400).json({ message: 'Invalid room id' });
        }

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        const monthNum = Number(month);
        const yearNum = Number(year);
        const totalDays = daysInMonth(monthNum, yearNum);

        const rangeStart = normalizeDate(new Date(yearNum, monthNum - 1, 1));
        const rangeEnd = normalizeDate(new Date(yearNum, monthNum - 1, totalDays));

        const records = await RoomAvailability.find({
            room: roomId,
            date: { $gte: rangeStart, $lte: rangeEnd },
        });

        const statusByDay = {};
        records.forEach((rec) => {
            const day = new Date(rec.date).getUTCDate();
            statusByDay[day] = { status: rec.status, note: rec.note };
        });

        const days = [];
        for (let day = 1; day <= totalDays; day++) {
            const override = statusByDay[day];
            days.push({
                day,
                date: normalizeDate(new Date(yearNum, monthNum - 1, day)),
                status: override ? override.status : 'Available',
                note: override ? override.note : '',
            });
        }

        res.status(200).json({
            message: 'Room calendar fetched successfully',
            room: { id: room._id, roomNumber: room.roomNumber, roomName: room.roomName, roomType: room.roomType },
            month: monthNum,
            year: yearNum,
            days,
        });
    } catch (error) {
        return handleError(res, error);
    }
};

/**
 * @desc  Set/update a single day's status for a room (upsert)
 * @route PUT /api/room-availability
 * @body  { roomId, date, status, note }
 */
export const setDayStatus = async (req, res) => {
    try {
        const { roomId, date, status, note } = req.body;

        if (!roomId || !date || !status) {
            return res.status(400).json({ message: 'roomId, date and status are required' });
        }
        if (!mongoose.isValidObjectId(roomId)) {
            return res.status(400).json({ message: 'Invalid room id' });
        }
        if (!ALLOWED_STATUSES.includes(status)) {
            return res.status(400).json({ message: 'Invalid status', allowedStatuses: ALLOWED_STATUSES });
        }

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        const record = await RoomAvailability.findOneAndUpdate(
            { room: roomId, date: normalizeDate(date) },
            { status, note: note || '' },
            { new: true, upsert: true, runValidators: true },
        );

        return res.status(200).json({ message: 'Room status updated successfully', data: record });
    } catch (error) {
        return handleError(res, error);
    }
};

/**
 * @desc  Set a status across a date range for one room (e.g. block a week for maintenance)
 * @route POST /api/room-availability/bulk
 * @body  { roomId, startDate, endDate, status, note }
 */
export const bulkSetStatus = async (req, res) => {
    try {
        const { roomId, startDate, endDate, status, note } = req.body;

        if (!roomId || !startDate || !endDate || !status) {
            return res.status(400).json({ message: 'roomId, startDate, endDate and status are required' });
        }
        if (!mongoose.isValidObjectId(roomId)) {
            return res.status(400).json({ message: 'Invalid room id' });
        }
        if (!ALLOWED_STATUSES.includes(status)) {
            return res.status(400).json({ message: 'Invalid status', allowedStatuses: ALLOWED_STATUSES });
        }

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        const start = normalizeDate(startDate);
        const end = normalizeDate(endDate);
        if (start > end) {
            return res.status(400).json({ message: 'startDate must be before endDate' });
        }

        const bulkOps = [];
        const cursor = new Date(start);
        while (cursor <= end) {
            const day = normalizeDate(cursor);
            bulkOps.push({
                updateOne: {
                    filter: { room: roomId, date: day },
                    update: { $set: { status, note: note || '' } },
                    upsert: true,
                },
            });
            cursor.setUTCDate(cursor.getUTCDate() + 1);
        }

        await RoomAvailability.bulkWrite(bulkOps);

        return res.status(200).json({ message: `Updated ${bulkOps.length} day(s) to '${status}'` });
    } catch (error) {
        return handleError(res, error);
    }
};

/**
 * @desc  Reset a day back to default 'Available' (removes the override record)
 * @route DELETE /api/room-availability
 * @body  { roomId, date }
 */
export const resetDayStatus = async (req, res) => {
    try {
        const { roomId, date } = req.body;
        if (!roomId || !date) {
            return res.status(400).json({ message: 'roomId and date are required' });
        }
        if (!mongoose.isValidObjectId(roomId)) {
            return res.status(400).json({ message: 'Invalid room id' });
        }

        await RoomAvailability.findOneAndDelete({ room: roomId, date: normalizeDate(date) });
        return res.status(200).json({ message: 'Status reset to Available' });
    } catch (error) {
        return handleError(res, error);
    }
};

export default {
    getMonthlyCalendar,
    getRoomCalendar,
    setDayStatus,
    bulkSetStatus,
    resetDayStatus,
};
