import Room from '../models/Room.js';
import SpecialPackage from '../models/SpecialPackage.js';
import User from '../models/User.js';

// --- Global Hotel Controllers ---

export const getAllHotels = async (req, res, next) => {
    try {
        const hotelOwners = await User.find({ role: 'hotelowner_user', 'hotels.0': { $exists: true } });
        const allHotels = hotelOwners.reduce((acc, user) => {
            return acc.concat(user.hotels.map(h => ({
                ...h.toObject(),
                ownerId: user._id,
                ownerName: user.fullName
            })));
        }, []);
        res.status(200).json({ success: true, count: allHotels.length, data: allHotels });
    } catch (error) {
        next(error);
    }
};

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
        const rooms = await Room.find();
        res.status(200).json({ success: true, count: rooms.length, data: rooms });
    } catch (error) {
        next(error);
    }
};

export const getRoomById = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ success: false, message: 'Room not found' });
        }
        res.status(200).json({ success: true, data: room });
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
