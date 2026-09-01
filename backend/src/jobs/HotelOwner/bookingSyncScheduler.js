import cron from 'node-cron';
import { syncAllBookingsToRooms } from '../../services/HotelOwner/bookingSync.js';
import getTestDb from '../../configs/HotelOwner/testDb.js';
import tempHotBookSchema from '../../models/HotelOwner/TempHotBook.js';
import { syncRevenueSummaries } from '../../services/HotelOwner/revenueSummarySync.js';

const getTempHotBookModel = async () => {
    const conn = await getTestDb();
    return conn.models.TempHotBook || conn.model('TempHotBook', tempHotBookSchema.schema);
};

const getToday = () => new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Colombo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
}).format(new Date());

const updateBookingStatusesByDate = async () => {
    const TempHotBook = await getTempHotBookModel();
    const today = getToday();
    const bookings = await TempHotBook.find({ status: { $nin: ['cancelled', 'no-show', 'checked-out'] } });
    let updated = 0;

    for (const booking of bookings) {
        const checkOut = booking.checkOut?.slice(0, 10);
        const nextStatus = checkOut && today >= checkOut ? 'checked-out' : null;

        if (nextStatus && booking.status !== nextStatus) {
            booking.status = nextStatus;
            await booking.save();
            updated += 1;
        }
    }

    return updated;
};

// Runs every 15 minutes as a safety net — catches any bookings inserted
// directly into tempHotBook that bypassed the API
const startBookingSyncScheduler = () => {
    cron.schedule('*/15 * * * *', async () => {
        try {
            const updated = await updateBookingStatusesByDate();
            const result = await syncAllBookingsToRooms();
            const revenueResult = await syncRevenueSummaries();
            console.log(`[BookingSync] Scheduled sync: ${updated} statuses updated, ${result.synced} synced, ${result.failed} failed, ${result.total} total, ${revenueResult.summaries} revenue summaries updated`);
        } catch (error) {
            console.error('[BookingSync] Scheduled sync failed:', error.message);
        }
    });

    console.log('[BookingSync] Scheduler started — runs every 15 minutes');
};

export default startBookingSyncScheduler;
