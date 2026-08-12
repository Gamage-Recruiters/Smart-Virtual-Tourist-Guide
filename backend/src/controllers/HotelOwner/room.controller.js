import mongoose from 'mongoose';
import getTestDb from '../../configs/HotelOwner/testDb.js';
import roomModelSchema from '../../models/HotelOwner/room.model.js';

const getRoomModel = async () => {
  const conn = await getTestDb();
  return conn.models.Room || conn.model('Room', roomModelSchema.schema);
};

const getDuplicateMessage = () => 'Room with this name or number already exists';

const handleError = (res, error) => {
    if (error?.code === 11000) {
        return res.status(409).json({ message: getDuplicateMessage() });
    }

    if (error?.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Validation failed',
            details: Object.values(error.errors).map((item) => `${item.path}: ${item.message}`),
        });
    }

    return res.status(500).json({ message: 'Internal server error' });
};

export const createRoom = async (req, res) => {
    try {
        const Room = await getRoomModel();

        const body = { ...req.body };
        if (typeof body.capacity === 'string')           body.capacity = JSON.parse(body.capacity);
        if (typeof body.amenities === 'string')          body.amenities = JSON.parse(body.amenities);
        if (typeof body.contactInfo === 'string')        body.contactInfo = JSON.parse(body.contactInfo);
        if (typeof body.locationAndPricing === 'string') body.locationAndPricing = JSON.parse(body.locationAndPricing);

        const hotelId = body.hotelId;
        if (!hotelId) return res.status(400).json({ message: 'hotelId is required' });

        const count = await Room.countDocuments({ hotelId });
        const roomNumber = `R${count + 1}`;

        const images = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];
        const room = await Room.create({ ...body, roomNumber, images, roomStatus: 'Available', blockedDates: [], maintenanceDates: [], bookingDates: [] });

        return res.status(201).json({ message: 'Room created successfully', room });
    } catch (error) {
        return handleError(res, error);
    }
};

/**
 * Get rooms with advanced searching, filtering & capacity matchmaking
 * Query Params Example: /api/rooms?status=Available&roomType=Deluxe Double Room&adults=2
 */
export const getAllRooms = async (req, res) => {
    try {
        const Room = await getRoomModel();
        const { status, roomType, adults, children, hotelId } = req.query;
        const query = {};

        // Dynamic Filtering
        if (hotelId) query.hotelId = hotelId;
        if (status) query.status = status;
        if (roomType) query.roomType = roomType;
        
        // Match minimum room capacity if provided
        if (adults) query['capacity.adults'] = { $gte: parseInt(adults, 10) };
        if (children) query['capacity.children'] = { $gte: parseInt(children, 10) };

        const rooms = await Room.find(query).sort({ createdAt: -1 });
        
        return res.status(200).json({
            message: 'Rooms fetched successfully',
            count: rooms.length,
            rooms,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Fetch a single room profile by its Object ID
 */
export const getRoomById = async (req, res) => {
    try {
        const Room = await getRoomModel();
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid room id' });
        }

        const room = await Room.findById(id);

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        return res.status(200).json({
            message: 'Room fetched successfully',
            room,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Full structural update of room properties
 */
export const updateRoom = async (req, res) => {
    try {
        const Room = await getRoomModel();
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid room id' });
        }

        // Parse JSON-stringified nested fields sent via FormData
        const body = { ...req.body };
        if (typeof body.capacity === 'string')           body.capacity = JSON.parse(body.capacity);
        if (typeof body.amenities === 'string')          body.amenities = JSON.parse(body.amenities);
        if (typeof body.contactInfo === 'string')        body.contactInfo = JSON.parse(body.contactInfo);
        if (typeof body.locationAndPricing === 'string') body.locationAndPricing = JSON.parse(body.locationAndPricing);

        // Merge kept existing images with any newly uploaded ones
        const keptImages = body.keptImages ? JSON.parse(body.keptImages) : [];
        delete body.keptImages;
        const newImages = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];
        body.images = [...keptImages.map(url => url.replace('http://localhost:5000', '')), ...newImages];

        const room = await Room.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        return res.status(200).json({
            message: 'Room updated successfully',
            room,
        });
    } catch (error) {
        return handleError(res, error);
    }
};

/**
 * PATCH: Quick-toggle single room status (Available, Non Available, Maintenance)
 * Body parameter layout: { "status": "Maintenance" }
 */
export const updateRoomStatus = async (req, res) => {
    try {
        const Room = await getRoomModel();
        const { id } = req.params;
        const { status } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid room id' });
        }

        if (!status) {
            return res.status(400).json({ message: 'Status field is required' });
        }

        const room = await Room.findByIdAndUpdate(
            id, 
            { $set: { status } }, 
            { new: true, runValidators: true }
        );

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        return res.status(200).json({
            message: `Room status changed to ${status} successfully`,
            room,
        });
    } catch (error) {
        return handleError(res, error);
    }
};

/**
 * Bulk updates operational statuses for multiple rooms simultaneously
 * Body parameter layout: { "roomIds": ["id1", "id2"], "status": "Maintenance" }
 */
export const bulkUpdateRoomStatuses = async (req, res) => {
    try {
        const Room = await getRoomModel();
        const { roomIds, status } = req.body;

        if (!Array.isArray(roomIds) || roomIds.length === 0 || !status) {
            return res.status(400).json({ message: 'Invalid payload elements' });
        }

        // Verify array contents match MongoDB formats
        const validIds = roomIds.every(id => mongoose.isValidObjectId(id));
        if (!validIds) {
            return res.status(400).json({ message: 'One or more room IDs are invalid' });
        }

        const result = await Room.updateMany(
            { _id: { $in: roomIds } },
            { $set: { status } }
        );

        return res.status(200).json({
            message: `Successfully modified ${result.modifiedCount} rooms status indicators`,
            details: result
        });
    } catch (error) {
        return handleError(res, error);
    }
};

/**
 * POST /:id/bookings — push a new booking date range into bookingDates
 * Body: { startDate, endDate, note? }
 */
export const addBookingDate = async (req, res) => {
    try {
        const Room = await getRoomModel();
        const { id } = req.params;
        const { startDate, endDate, note } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid room id' });
        }
        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'startDate and endDate are required' });
        }

        const room = await Room.findByIdAndUpdate(
            id,
            { $push: { bookingDates: { startDate, endDate, note: note || '' } } },
            { new: true, runValidators: true }
        );

        if (!room) return res.status(404).json({ message: 'Room not found' });

        return res.status(201).json({ message: 'Booking date added', bookingDates: room.bookingDates });
    } catch (error) {
        return handleError(res, error);
    }
};

/**
 * PATCH /:id/bookings/:bookingId — update an existing booking entry
 * Body: { startDate?, endDate?, note? }
 */
export const updateBookingDate = async (req, res) => {
    try {
        const Room = await getRoomModel();
        const { id, bookingId } = req.params;
        const { startDate, endDate, note } = req.body;

        if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(bookingId)) {
            return res.status(400).json({ message: 'Invalid id' });
        }

        const update = {};
        if (startDate) update['bookingDates.$.startDate'] = startDate;
        if (endDate)   update['bookingDates.$.endDate']   = endDate;
        if (note !== undefined) update['bookingDates.$.note'] = note;

        const room = await Room.findOneAndUpdate(
            { _id: id, 'bookingDates._id': bookingId },
            { $set: update },
            { new: true, runValidators: true }
        );

        if (!room) return res.status(404).json({ message: 'Room or booking not found' });

        return res.status(200).json({ message: 'Booking date updated', bookingDates: room.bookingDates });
    } catch (error) {
        return handleError(res, error);
    }
};

/**
 * Delete a room from inventory data records
 */
export const deleteRoom = async (req, res) => {
    try {
        const Room = await getRoomModel();
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid room id' });
        }

        const room = await Room.findByIdAndDelete(id);

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        return res.status(200).json({
            message: 'Room deleted successfully',
            room,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default {
    createRoom,
    getAllRooms,
    getRoomById,
    updateRoom,
    updateRoomStatus,
    bulkUpdateRoomStatuses,
    deleteRoom,
    addBookingDate,
    updateBookingDate,
};