import mongoose from 'mongoose';
import getTestDb from '../../configs/HotelOwner/testDb.js';
import specialPackageBase from '../../models/HotelOwner/specialPackage.model.js';
import { sendNotification } from '../../services/NotificationService.js';
import {
  NOTIFICATION_SCOPES,
  RECIPIENT_ROLES,
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_PRIORITIES,
} from '../../constants/notificationConstants.js';

const getPackageModel = async () => {
  const conn = await getTestDb();
  return conn.models.SpecialPackage || conn.model('SpecialPackage', specialPackageBase.schema);
};

const handleError = (res, error) => {
    if (error?.code === 11000) {
        return res.status(409).json({ message: 'A package with this name already exists' });
    }
    if (error?.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Validation failed',
            details: Object.values(error.errors).map((item) => `${item.path}: ${item.message}`),
        });
    }
    return res.status(500).json({ message: 'Internal server error' });
};

const parseBody = (raw) => {
    const body = { ...raw };
    if (typeof body.capacity === 'string')           body.capacity = JSON.parse(body.capacity);
    if (typeof body.amenities === 'string')          body.amenities = JSON.parse(body.amenities);
    if (typeof body.contactInfo === 'string')        body.contactInfo = JSON.parse(body.contactInfo);
    if (typeof body.locationAndPricing === 'string') body.locationAndPricing = JSON.parse(body.locationAndPricing);
    if (typeof body.discount === 'string')           body.discount = JSON.parse(body.discount);
    return body;
};

export const createPackage = async (req, res) => {
    try {
        const SpecialPackage = await getPackageModel();
        const body = parseBody(req.body);
        const images = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];
        const pkg = await SpecialPackage.create({ ...body, images });

        // --- Notification: MULTICAST to all Administrators ---
        // Alerts admins that a new hotel special package requires their review and approval.
        try {
            const io = req.app.get('io');
            await sendNotification(io, {
                scope: NOTIFICATION_SCOPES.MULTICAST,
                recipientRole: RECIPIENT_ROLES.ADMIN,
                title: '🏨 New Hotel Package Awaiting Approval',
                message: `A new special package "${pkg.packageName || pkg.name || 'Unnamed Package'}" has been submitted and requires your review.`,
                category: NOTIFICATION_CATEGORIES.SYSTEM,
                priority: NOTIFICATION_PRIORITIES.MEDIUM,
                actionUrl: `/admin/hotel-packages/${pkg._id}`,
            });
        } catch (notifError) {
            console.error('[Notification Error] createPackage:', notifError.message);
        }

        return res.status(201).json({ message: 'Special package created successfully', package: pkg });
    } catch (error) {
        return handleError(res, error);
    }
};

export const getAllPackages = async (req, res) => {
    try {
        const SpecialPackage = await getPackageModel();
        const filter = req.query.hotelId ? { hotelId: req.query.hotelId } : {};
        const packages = await SpecialPackage.find(filter).sort({ createdAt: -1 });
        return res.status(200).json({ message: 'Packages fetched successfully', count: packages.length, packages });
    } catch {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getPackageById = async (req, res) => {
    try {
        const SpecialPackage = await getPackageModel();
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid package id' });
        const pkg = await SpecialPackage.findById(id);
        if (!pkg) return res.status(404).json({ message: 'Package not found' });
        return res.status(200).json({ message: 'Package fetched successfully', package: pkg });
    } catch {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const updatePackage = async (req, res) => {
    try {
        const SpecialPackage = await getPackageModel();
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid package id' });

        const body = parseBody(req.body);
        const keptImages = body.keptImages ? JSON.parse(body.keptImages) : [];
        delete body.keptImages;
        const newImages = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];
        body.images = [...keptImages.map(url => url.replace('http://localhost:5000', '')), ...newImages];

        const pkg = await SpecialPackage.findByIdAndUpdate(id, body, { returnDocument: 'after', runValidators: true });
        if (!pkg) return res.status(404).json({ message: 'Package not found' });
        return res.status(200).json({ message: 'Package updated successfully', package: pkg });
    } catch (error) {
        return handleError(res, error);
    }
};

export const deletePackage = async (req, res) => {
    try {
        const SpecialPackage = await getPackageModel();
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid package id' });
        const pkg = await SpecialPackage.findByIdAndDelete(id);
        if (!pkg) return res.status(404).json({ message: 'Package not found' });
        return res.status(200).json({ message: 'Package deleted successfully', package: pkg });
    } catch {
        return res.status(500).json({ message: 'Internal server error' });
    }
};
