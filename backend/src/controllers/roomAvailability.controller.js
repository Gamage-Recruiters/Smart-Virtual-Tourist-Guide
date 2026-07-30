import mongoose from 'mongoose';
import getTestDb from '../configs/testDb.js';
import RoomBase from '../models/room.model.js';

const getRoomModel = async () => {
  const conn = await getTestDb();
  return conn.models.Room || conn.model('Room', RoomBase.schema);
};

const handleError = (res, error) => {
    if (error?.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Validation failed',
            details: Object.values(error.errors).map((i) => i.message),
        });
    }
    return res.status(500).json({ message: 'Internal server error' });
};

const normalizeDate = (dateInput) => {
    const d = new Date(dateInput);
    d.setUTCHours(0, 0, 0, 0);
    return d;
};

// Returns a UTC-midnight Date whose calendar date matches today in Sri Lanka (UTC+5:30)
const todaySL = () => {
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Colombo', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
    const get = (t) => Number(parts.find((p) => p.type === t).value);
    return new Date(Date.UTC(get('year'), get('month') - 1, get('day')));
};

const daysInMonth = (month, year) => new Date(year, month, 0).getDate();



/**
 * Build a day-keyed lookup for a given month from blockedDates + maintenanceDates.
 * Returns: { [dayNumber]: { status: 'Non Available'|'Maintenance', periodId } }
 */
const buildDayLookup = (blockedDates, maintenanceDates, monthNum, yearNum, totalDays) => {
    const lookup = {};
    const monthStart = normalizeDate(new Date(yearNum, monthNum - 1, 1));
    const monthEnd   = normalizeDate(new Date(yearNum, monthNum - 1, totalDays));

    const applyPeriods = (periods, status) => {
        for (const period of periods) {
            const pStart = normalizeDate(period.startDate);
            const pEnd   = normalizeDate(period.endDate);
            if (pEnd < monthStart || pStart > monthEnd) continue;
            const cursor = new Date(Math.max(pStart.getTime(), monthStart.getTime()));
            const end    = new Date(Math.min(pEnd.getTime(), monthEnd.getTime()));
            while (cursor <= end) {
                lookup[cursor.getUTCDate()] = { status, periodId: period._id };
                cursor.setUTCDate(cursor.getUTCDate() + 1);
            }
        }
    };

    applyPeriods(blockedDates,     'Non Available');
    applyPeriods(maintenanceDates, 'Maintenance');
    return lookup;
};

/**
 * @route GET /api/room-availability/calendar?roomType=...&month=...&year=...
 */
export const getMonthlyCalendar = async (req, res) => {
    try {
        const { roomType, month, year } = req.query;
        if (!roomType || !month || !year)
            return res.status(400).json({ message: 'roomType, month and year are required' });

        const monthNum  = Number(month);
        const yearNum   = Number(year);
        const totalDays = daysInMonth(monthNum, yearNum);

        const Room = await getRoomModel();
        const rooms = await Room.find({ roomType }).sort({ roomNumber: 1 });
        if (rooms.length === 0) {
            return res.status(200).json({
                message: 'No rooms found for this room type',
                roomType, totalRooms: 0, capacity: { adults: 0, children: 0 },
                month: monthNum, year: yearNum, totalDays, rooms: [],
            });
        }

        const todayMs = todaySL().getTime();
        const isInPeriod = (periods) => periods.some((p) =>
            normalizeDate(p.startDate).getTime() <= todayMs && todayMs <= normalizeDate(p.endDate).getTime()
        );

        const roomsCalendar = rooms.map((room) => {
            const blocked = room.blockedDates     || [];
            const maint   = room.maintenanceDates || [];
            const lookup  = buildDayLookup(blocked, maint, monthNum, yearNum, totalDays);

            let currentStatus = 'Available';
            if (isInPeriod(maint))        currentStatus = 'Maintenance';
            else if (isInPeriod(blocked)) currentStatus = 'Non Available';

            const days = [];
            for (let day = 1; day <= totalDays; day++) {
                const override = lookup[day];
                const status   = override ? override.status : 'Available';
                days.push({ day, date: normalizeDate(new Date(yearNum, monthNum - 1, day)), status, periodId: override?.periodId || null });
            }

            return {
                roomId: room._id,
                roomNumber: room.roomNumber,
                roomName: room.roomName,
                currentStatus,
                blockedDates:     blocked,
                maintenanceDates: maint,
                days,
            };
        });

        return res.status(200).json({
            message: 'Room availability calendar fetched successfully',
            roomType, totalRooms: rooms.length,
            capacity: rooms[0].capacity || { adults: 0, children: 0 },
            month: monthNum, year: yearNum, totalDays,
            rooms: roomsCalendar,
        });
    } catch (error) {
        return handleError(res, error);
    }
};

/**
 * @route GET /api/room-availability/room/:roomId?month=...&year=...
 */
export const getRoomCalendar = async (req, res) => {
    try {
        const { roomId } = req.params;
        const { month, year } = req.query;

        if (!mongoose.isValidObjectId(roomId))
            return res.status(400).json({ message: 'Invalid room id' });

        const monthNum  = Number(month);
        const yearNum   = Number(year);
        const totalDays = daysInMonth(monthNum, yearNum);

        const Room = await getRoomModel();
        const doc = await Room.findById(roomId);
        if (!doc) return res.status(404).json({ message: 'Room not found' });
        const blocked = doc.blockedDates     || [];
        const maint   = doc.maintenanceDates || [];
        const lookup  = buildDayLookup(blocked, maint, monthNum, yearNum, totalDays);

        const days = [];
        for (let day = 1; day <= totalDays; day++) {
            const override = lookup[day];
            days.push({
                day,
                date: normalizeDate(new Date(yearNum, monthNum - 1, day)),
                status: override ? override.status : 'Available',
                periodId: override?.periodId || null,
            });
        }

        return res.status(200).json({
            message: 'Room calendar fetched successfully',
            room: { id: doc._id, roomNumber: doc.roomNumber, roomName: doc.roomName, roomType: doc.roomType },
            month: monthNum, year: yearNum,
            blockedDates: blocked,
            maintenanceDates: maint,
            days,
        });
    } catch (error) {
        return handleError(res, error);
    }
};

/**
 * @desc  Save all blocked date ranges for a room (replaces existing blockedDates)
 * @route POST /api/room-availability/blocked
 * @body  { roomId, periods: [{ startDate, endDate, note }] }
 */
export const saveBlockedDates = async (req, res) => {
    try {
        const { roomId, periods } = req.body;

        if (!roomId || !Array.isArray(periods))
            return res.status(400).json({ message: 'roomId and periods array are required' });
        if (!mongoose.isValidObjectId(roomId))
            return res.status(400).json({ message: 'Invalid room id' });

        const normalized = periods.map((p) => ({
            startDate: normalizeDate(p.startDate),
            endDate:   normalizeDate(p.endDate),
        }));

        const Room = await getRoomModel();
        const doc = await Room.findByIdAndUpdate(
            roomId,
            { $set: { blockedDates: normalized } },
            { new: true }
        );
        if (!doc) return res.status(404).json({ message: 'Room not found' });

        return res.status(200).json({ message: 'Blocked dates saved', blockedDates: doc.blockedDates });
    } catch (error) {
        return handleError(res, error);
    }
};

/**
 * @desc  Save all maintenance date ranges for a room (replaces existing maintenanceDates)
 * @route POST /api/room-availability/maintenance
 * @body  { roomId, periods: [{ startDate, endDate, note }] }
 */
export const saveMaintenanceDates = async (req, res) => {
    try {
        const { roomId, periods } = req.body;

        if (!roomId || !Array.isArray(periods))
            return res.status(400).json({ message: 'roomId and periods array are required' });
        if (!mongoose.isValidObjectId(roomId))
            return res.status(400).json({ message: 'Invalid room id' });

        const normalized = periods.map((p) => ({
            startDate: normalizeDate(p.startDate),
            endDate:   normalizeDate(p.endDate),
        }));

        const Room = await getRoomModel();
        const doc = await Room.findByIdAndUpdate(
            roomId,
            { $set: { maintenanceDates: normalized } },
            { new: true }
        );
        if (!doc) return res.status(404).json({ message: 'Room not found' });

        return res.status(200).json({ message: 'Maintenance dates saved', maintenanceDates: doc.maintenanceDates });
    } catch (error) {
        return handleError(res, error);
    }
};

export const updateBlockedPeriod = async (req, res) => {
    try {
        const { roomId, periodId } = req.params;
        if (!mongoose.isValidObjectId(roomId) || !mongoose.isValidObjectId(periodId))
            return res.status(400).json({ message: 'Invalid id' });
        const { startDate, endDate } = req.body;
        const Room = await getRoomModel();
        const doc = await Room.findOneAndUpdate(
            { _id: roomId, 'blockedDates._id': periodId },
            { $set: { 'blockedDates.$.startDate': normalizeDate(startDate), 'blockedDates.$.endDate': normalizeDate(endDate) } },
            { new: true }
        );
        if (!doc) return res.status(404).json({ message: 'Period not found' });
        return res.status(200).json({ message: 'Blocked period updated', blockedDates: doc.blockedDates });
    } catch (error) { return handleError(res, error); }
};

export const updateMaintenancePeriod = async (req, res) => {
    try {
        const { roomId, periodId } = req.params;
        if (!mongoose.isValidObjectId(roomId) || !mongoose.isValidObjectId(periodId))
            return res.status(400).json({ message: 'Invalid id' });
        const { startDate, endDate } = req.body;
        const Room = await getRoomModel();
        const doc = await Room.findOneAndUpdate(
            { _id: roomId, 'maintenanceDates._id': periodId },
            { $set: { 'maintenanceDates.$.startDate': normalizeDate(startDate), 'maintenanceDates.$.endDate': normalizeDate(endDate) } },
            { new: true }
        );
        if (!doc) return res.status(404).json({ message: 'Period not found' });
        return res.status(200).json({ message: 'Maintenance period updated', maintenanceDates: doc.maintenanceDates });
    } catch (error) { return handleError(res, error); }
};

export default { getMonthlyCalendar, getRoomCalendar, saveBlockedDates, saveMaintenanceDates, updateBlockedPeriod, updateMaintenancePeriod };
