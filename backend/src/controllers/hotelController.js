import Room from '../models/Room.js';
import SpecialPackage from '../models/SpecialPackage.js';
import User from '../models/User.js';

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
            const userRooms = allRooms.filter(r => r.hotelId && r.hotelId.toString() === user._id.toString());
            const userObj = user.toObject();
            const primaryHotel = (userObj.hotels && userObj.hotels.length > 0) ? userObj.hotels[0] : {};

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
                _id: user._id,
                ownerId: user._id,
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
            rooms = await Room.find({
                $or: [
                    { hotelId: hotelId },
                    { _id: hotelId }
                ]
            }).populate({ path: 'hotelId', model: User, select: 'fullName contactNumber email hotels' });
        } else {
            rooms = await Room.find().populate({ path: 'hotelId', model: User, select: 'fullName contactNumber email hotels' });
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
            pkgs = await SpecialPackage.find({
                $or: [
                    { hotelId: hotelId },
                    { _id: hotelId }
                ]
            }).populate({ path: 'hotelId', model: User, select: 'fullName contactNumber email hotels' });
        } else {
            pkgs = await SpecialPackage.find().populate({ path: 'hotelId', model: User, select: 'fullName contactNumber email hotels' });
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
