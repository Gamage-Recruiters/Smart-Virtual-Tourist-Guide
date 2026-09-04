import mongoose from 'mongoose';
import Room from '../models/Room.js';
import SpecialPackage from '../models/SpecialPackage.js';
import User from '../models/User.js';

// Helper function to find a hotel owner in tourismGuideDB by user ID or hotel sub-document ID
const findOwnerByAnyId = async (idStr) => {
    if (!idStr || !mongoose.Types.ObjectId.isValid(idStr)) return null;
    return await User.findOne({
        $or: [
            { _id: idStr },
            { 'hotels._id': idStr }
        ]
    });
};

// --- Global Hotel Controllers ---

export const getAllHotels = async (req, res, next) => {
    try {
        const hotelOwners = await User.find({
            $or: [
                { role: 'hotelowner_user' },
                { 'hotels.0': { $exists: true } }
            ]
        });

        const allRooms = await Room.find();

        const ownerHotels = await Promise.all(hotelOwners.map(async (user) => {
            const validIds = [
                user._id.toString(),
                ...(user.hotels || []).map(h => h._id ? h._id.toString() : null)
            ].filter(Boolean);

            const userEmails = [
                user.email,
                ...(user.hotels || []).map(h => h.hotelEmail)
            ].filter(Boolean).map(e => e.toLowerCase());

            const userNames = [user.fullName].filter(Boolean).map(n => n.toLowerCase());

            const userRooms = allRooms.filter(r => {
                if (r.hotelId && validIds.includes(r.hotelId.toString())) return true;
                if (r.contactInfo?.email && userEmails.includes(r.contactInfo.email.toLowerCase())) return true;
                if (r.contactInfo?.contactName && userNames.includes(r.contactInfo.contactName.toLowerCase())) return true;
                return false;
            });

            const userObj = user.toObject();
            const primaryHotel = (userObj.hotels && userObj.hotels.length > 0) ? userObj.hotels[0] : {};
            const hotelId = (primaryHotel && primaryHotel._id) ? primaryHotel._id.toString() : user._id.toString();

            let minPrice = null;
            const allAmenities = new Set();
            const allImages = [];

            userRooms.forEach(room => {
                if (Array.isArray(room.locationAndPricing)) {
                    room.locationAndPricing.forEach(lp => {
                        if (lp.basePrice !== undefined && lp.basePrice !== null) {
                            if (minPrice === null || lp.basePrice < minPrice) {
                                minPrice = lp.basePrice;
                            }
                        }
                    });
                }
                if (Array.isArray(room.amenities)) {
                    room.amenities.forEach(a => allAmenities.add(a));
                }
                if (Array.isArray(room.images)) {
                    room.images.forEach(img => { if (img) allImages.push(img); });
                }
            });

            return {
                _id: hotelId,
                hotelId: hotelId,
                ownerId: user._id.toString(),
                ownerName: user.fullName,
                hotelName: primaryHotel.hotelName || `${user.fullName}'s Hotel`,
                hotelAddress: primaryHotel.hotelAddress || 'Sri Lanka',
                hotelEmail: primaryHotel.hotelEmail || user.email,
                hotelContactNumber: primaryHotel.hotelContactNumber || user.contactNumber,
                hotelRegistrationNo: primaryHotel.hotelRegistrationNo || '',
                hotelRegisteredYear: primaryHotel.hotelRegisteredYear || '',
                minPrice: minPrice !== null ? minPrice : 15000,
                amenities: Array.from(allAmenities).length > 0 ? Array.from(allAmenities) : ['wifi', 'ac', 'pool'],
                images: allImages.length > 0 ? allImages : ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600'],
                starRating: primaryHotel.starRating || 4,
                userRating: primaryHotel.userRating || 4.8,
                reviews: primaryHotel.reviews || 120,
                description: primaryHotel.description || (userRooms.length > 0 ? userRooms[0].description : 'Luxury hotel in Sri Lanka offering world-class service, comfort, and premium amenities.'),
                roomsCount: userRooms.length,
                rooms: userRooms
            };
        }));

        res.status(200).json({ success: true, count: ownerHotels.length, data: ownerHotels });
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
        const { hotelId } = req.query;
        let rooms = [];

        if (hotelId) {
            const owner = await findOwnerByAnyId(hotelId);

            const validIds = [hotelId.toString()];
            const validEmails = [];
            const validNames = [];

            if (owner) {
                validIds.push(owner._id.toString());
                if (Array.isArray(owner.hotels)) {
                    owner.hotels.forEach(h => {
                        if (h._id) validIds.push(h._id.toString());
                        if (h.hotelEmail) validEmails.push(h.hotelEmail);
                    });
                }
                if (owner.email) validEmails.push(owner.email);
                if (owner.fullName) validNames.push(owner.fullName);
            }

            const queryConditions = [
                { hotelId: { $in: validIds } },
                { _id: { $in: validIds } }
            ];

            validEmails.filter(Boolean).forEach(email => {
                queryConditions.push({
                    'contactInfo.email': { $regex: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
                });
            });

            validNames.filter(Boolean).forEach(name => {
                queryConditions.push({
                    'contactInfo.contactName': { $regex: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
                });
            });

            rooms = await Room.find({ $or: queryConditions })
                .populate({ path: 'hotelId', model: User, select: 'fullName contactNumber email hotels' });
        } else {
            rooms = await Room.find()
                .populate({ path: 'hotelId', model: User, select: 'fullName contactNumber email hotels' });
        }

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
            .populate({ path: 'hotelId', model: User, select: 'fullName contactNumber email hotels' });
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

export const checkRoomAvailability = async (req, res, next) => {
    try {
        const { roomId, checkIn, checkOut } = req.body;

        if (!roomId || !checkIn || !checkOut) {
            return res.status(400).json({ 
                success: false, 
                message: 'Room ID, check-in date, and check-out date are required.' 
            });
        }

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ success: false, message: 'Room not found.' });
        }

        if (room.roomStatus && room.roomStatus !== 'Available') {
            return res.status(200).json({ 
                success: true, 
                available: false, 
                reason: `Room is currently marked as ${room.roomStatus}.` 
            });
        }

        const start = new Date(checkIn);
        const end = new Date(checkOut);

        if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid date range. Check-out date must be after check-in date.' 
            });
        }

        const isOverlapping = (periods) => {
            if (!Array.isArray(periods)) return false;
            return periods.some(period => {
                const pStart = new Date(period.startDate);
                const pEnd = new Date(period.endDate);
                return start < pEnd && end > pStart;
            });
        };

        if (isOverlapping(room.blockedDates)) {
            return res.status(200).json({ 
                success: true, 
                available: false, 
                reason: 'Selected dates overlap with blocked dates for this room.' 
            });
        }

        if (isOverlapping(room.maintenanceDates)) {
            return res.status(200).json({ 
                success: true, 
                available: false, 
                reason: 'Selected dates overlap with scheduled maintenance for this room.' 
            });
        }

        if (isOverlapping(room.bookingDates)) {
            return res.status(200).json({ 
                success: true, 
                available: false, 
                reason: 'Selected dates overlap with an existing booking for this room.' 
            });
        }

        return res.status(200).json({ 
            success: true, 
            available: true, 
            message: 'Room is available for the selected dates!' 
        });
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
        const { hotelId } = req.query;
        let pkgs = [];

        if (hotelId) {
            const owner = await findOwnerByAnyId(hotelId);

            const validIds = [hotelId.toString()];
            const validEmails = [];
            const validNames = [];

            if (owner) {
                validIds.push(owner._id.toString());
                if (Array.isArray(owner.hotels)) {
                    owner.hotels.forEach(h => {
                        if (h._id) validIds.push(h._id.toString());
                        if (h.hotelEmail) validEmails.push(h.hotelEmail);
                    });
                }
                if (owner.email) validEmails.push(owner.email);
                if (owner.fullName) validNames.push(owner.fullName);
            }

            const queryConditions = [
                { hotelId: { $in: validIds } },
                { _id: { $in: validIds } }
            ];

            validEmails.filter(Boolean).forEach(email => {
                queryConditions.push({
                    'contactInfo.email': { $regex: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
                });
            });

            validNames.filter(Boolean).forEach(name => {
                queryConditions.push({
                    'contactInfo.contactName': { $regex: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
                });
            });

            pkgs = await SpecialPackage.find({ $or: queryConditions })
                .populate({ path: 'hotelId', model: User, select: 'fullName contactNumber email hotels' });
        } else {
            pkgs = await SpecialPackage.find()
                .populate({ path: 'hotelId', model: User, select: 'fullName contactNumber email hotels' });
        }

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
