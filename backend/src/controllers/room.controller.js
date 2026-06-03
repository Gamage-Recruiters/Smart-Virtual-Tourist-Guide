import mongoose from 'mongoose';
import Room from '../models/room.model.js';

const getDuplicateMessage = () => 'Room with this name already exists';

const handleError = (res, error) => {
	if (error?.code === 11000) {
		return res.status(409).json({ message: getDuplicateMessage() });
	}

	if (error?.name === 'ValidationError') {
		return res.status(400).json({
			message: 'Validation failed',
			details: Object.values(error.errors).map((item) => item.message),
		});
	}

	return res.status(500).json({ message: 'Internal server error' });
};

export const createRoom = async (req, res) => {
	try {
		const room = await Room.create(req.body);
		return res.status(201).json({
			message: 'Room created successfully',
			room,
		});
	} catch (error) {
		return handleError(res, error);
	}
};

export const getAllRooms = async (_req, res) => {
	try {
		const rooms = await Room.find().sort({ createdAt: -1 });
		return res.status(200).json({
			message: 'Rooms fetched successfully',
			rooms,
		});
	} catch (error) {
		return res.status(500).json({ message: 'Internal server error' });
	}
};

export const getRoomById = async (req, res) => {
	try {
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

export const updateRoom = async (req, res) => {
	try {
		const { id } = req.params;

		if (!mongoose.isValidObjectId(id)) {
			return res.status(400).json({ message: 'Invalid room id' });
		}

		const room = await Room.findByIdAndUpdate(id, req.body, {
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

export const deleteRoom = async (req, res) => {
	try {
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
	deleteRoom,
};
