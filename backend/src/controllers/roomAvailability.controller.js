import mongoose from 'mongoose';
import Room from '../models/room.model.js';

const allowedStatuses = ['Available', 'Booked', 'Under Maintenance'];

const handleError = (res, error) => {
	if (error?.name === 'ValidationError') {
		return res.status(400).json({
			message: 'Validation failed',
			details: Object.values(error.errors).map((item) => item.message),
		});
	}

	return res.status(500).json({ message: 'Internal server error' });
};

const normalizeAvailabilityStatus = (value) => {
	if (typeof value !== 'string') {
		return null;
	}

	const normalizedValue = value.trim().toLowerCase();

	if (normalizedValue === 'available') {
		return 'Available';
	}

	if (normalizedValue === 'booked') {
		return 'Booked';
	}

	if (normalizedValue === 'under maintenance' || normalizedValue === 'maintenance') {
		return 'Under Maintenance';
	}

	return null;
};

export const getRoomAvailability = async (req, res) => {
	try {
		const { id } = req.params;

		if (!mongoose.isValidObjectId(id)) {
			return res.status(400).json({ message: 'Invalid room id' });
		}

		const room = await Room.findById(id).select('roomName availabilityStatus createdAt');

		if (!room) {
			return res.status(404).json({ message: 'Room not found' });
		}

		return res.status(200).json({
			message: 'Room availability fetched successfully',
			room,
		});
	} catch (error) {
		return res.status(500).json({ message: 'Internal server error' });
	}
};

export const updateRoomAvailability = async (req, res) => {
	try {
		const { id } = req.params;
		const availabilityStatus = normalizeAvailabilityStatus(
			req.body.availabilityStatus ?? req.body.status,
		);

		if (!mongoose.isValidObjectId(id)) {
			return res.status(400).json({ message: 'Invalid room id' });
		}

		if (!availabilityStatus || !allowedStatuses.includes(availabilityStatus)) {
			return res.status(400).json({
				message: 'Invalid availability status',
				allowedStatuses,
			});
		}

		const room = await Room.findByIdAndUpdate(
			id,
			{ availabilityStatus },
			{ new: true, runValidators: true },
		);

		if (!room) {
			return res.status(404).json({ message: 'Room not found' });
		}

		return res.status(200).json({
			message: 'Room availability updated successfully',
			room,
		});
	} catch (error) {
		return handleError(res, error);
	}
};

export const getRoomsByAvailability = async (req, res) => {
	try {
		const availabilityStatus = normalizeAvailabilityStatus(
			req.query.status ?? req.params.status,
		);

		if (!availabilityStatus || !allowedStatuses.includes(availabilityStatus)) {
			return res.status(400).json({
				message: 'Invalid availability status',
				allowedStatuses,
			});
		}

		const rooms = await Room.find({ availabilityStatus }).sort({ createdAt: -1 });

		return res.status(200).json({
			message: 'Rooms fetched successfully',
			availabilityStatus,
			rooms,
		});
	} catch (error) {
		return res.status(500).json({ message: 'Internal server error' });
	}
};

export default {
	getRoomAvailability,
	updateRoomAvailability,
	getRoomsByAvailability,
};
