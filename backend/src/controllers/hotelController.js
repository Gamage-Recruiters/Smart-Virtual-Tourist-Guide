import Room from '../models/Room.js';
import SpecialPackage from '../models/SpecialPackage.js';

// --- Room Controllers ---

export const createRoom = async (req, res, next) => {
    try {
        const room = new Room(req.body);
        const savedRoom = await room.save();
        res.status(201).json({ success: true, data: savedRoom });
    } catch (error) {
        next(error);
    }
};

export const getRooms = async (req, res, next) => {
    try {
        const rooms = await Room.find()
            .populate({ path: 'hotelId', select: 'fullName contactNumber email hotels' });

        const enrichedRooms = rooms.map((room) => {
            const roomObj = room.toObject({ getters: true, virtuals: false });
            const hotelOwner = roomObj.hotelId;
            const hotelInfo = Array.isArray(hotelOwner?.hotels) ? hotelOwner.hotels[0] : {};

            return {
                ...roomObj,
                hotel: {
                    id: hotelOwner?._id,
                    ownerName: hotelOwner?.fullName,
                    contactNumber: hotelOwner?.contactNumber,
                    email: hotelOwner?.email,
                    hotelName: hotelInfo?.hotelName || roomObj.roomName,
                    hotelAddress: hotelInfo?.hotelAddress || roomObj.locationAndPricing?.[0]?.aboutLocation || '',
                    hotelEmail: hotelInfo?.hotelEmail,
                    hotelRegistrationNo: hotelInfo?.hotelRegistrationNo,
                    hotelRegisteredYear: hotelInfo?.hotelRegisteredYear
                }
            };
        });

        res.status(200).json({ success: true, count: enrichedRooms.length, data: enrichedRooms });
    } catch (error) {
        next(error);
    }
};

export const getRoomById = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.id)
            .populate({ path: 'hotelId', select: 'fullName contactNumber email hotels' });
        if (!room) {
            return res.status(404).json({ success: false, message: 'Room not found' });
        }

        const roomObj = room.toObject({ getters: true, virtuals: false });
        const hotelOwner = roomObj.hotelId;
        const hotelInfo = Array.isArray(hotelOwner?.hotels) ? hotelOwner.hotels[0] : {};

        const enrichedRoom = {
            ...roomObj,
            hotel: {
                id: hotelOwner?._id,
                ownerName: hotelOwner?.fullName,
                contactNumber: hotelOwner?.contactNumber,
                email: hotelOwner?.email,
                hotelName: hotelInfo?.hotelName || roomObj.roomName,
                hotelAddress: hotelInfo?.hotelAddress || roomObj.locationAndPricing?.[0]?.aboutLocation || '',
                hotelEmail: hotelInfo?.hotelEmail,
                hotelRegistrationNo: hotelInfo?.hotelRegistrationNo,
                hotelRegisteredYear: hotelInfo?.hotelRegisteredYear
            }
        };

        res.status(200).json({ success: true, data: enrichedRoom });
    } catch (error) {
        next(error);
    }
};

export const updateRoom = async (req, res, next) => {
    try {
        const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!room) {
            return res.status(404).json({ success: false, message: 'Room not found' });
        }
        res.status(200).json({ success: true, data: room });
    } catch (error) {
        next(error);
    }
};

export const deleteRoom = async (req, res, next) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);
        if (!room) {
            return res.status(404).json({ success: false, message: 'Room not found' });
        }
        res.status(200).json({ success: true, message: 'Room deleted' });
    } catch (error) {
        next(error);
    }
};

// --- Special Package Controllers ---

export const createSpecialPackage = async (req, res, next) => {
    try {
        const pkg = new SpecialPackage(req.body);
        const savedPkg = await pkg.save();
        res.status(201).json({ success: true, data: savedPkg });
    } catch (error) {
        next(error);
    }
};

export const getSpecialPackages = async (req, res, next) => {
    try {
        const pkgs = await SpecialPackage.find();
        res.status(200).json({ success: true, count: pkgs.length, data: pkgs });
    } catch (error) {
        next(error);
    }
};

export const getSpecialPackageById = async (req, res, next) => {
    try {
        const pkg = await SpecialPackage.findById(req.params.id);
        if (!pkg) {
            return res.status(404).json({ success: false, message: 'Special Package not found' });
        }
        res.status(200).json({ success: true, data: pkg });
    } catch (error) {
        next(error);
    }
};

export const updateSpecialPackage = async (req, res, next) => {
    try {
        const pkg = await SpecialPackage.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!pkg) {
            return res.status(404).json({ success: false, message: 'Special Package not found' });
        }
        res.status(200).json({ success: true, data: pkg });
    } catch (error) {
        next(error);
    }
};

export const deleteSpecialPackage = async (req, res, next) => {
    try {
        const pkg = await SpecialPackage.findByIdAndDelete(req.params.id);
        if (!pkg) {
            return res.status(404).json({ success: false, message: 'Special Package not found' });
        }
        res.status(200).json({ success: true, message: 'Special Package deleted' });
    } catch (error) {
        next(error);
    }
};
