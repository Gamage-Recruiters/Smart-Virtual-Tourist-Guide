import express from 'express';
import {
    getAllHotels,
    createRoom,
    getRooms,
    getRoomById,
    updateRoom,
    deleteRoom,
    checkRoomAvailability,
    createSpecialPackage,
    getSpecialPackages,
    getSpecialPackageById,
    updateSpecialPackage,
    deleteSpecialPackage
} from '../controllers/hotelController.js';

const router = express.Router();

// --- Global Hotel Routes ---
router.get('/', getAllHotels);

// --- Room Routes ---
router.post('/rooms', createRoom);
router.post('/rooms/check-availability', checkRoomAvailability);
router.get('/rooms', getRooms);
router.get('/rooms/:id', getRoomById);
router.put('/rooms/:id', updateRoom);
router.delete('/rooms/:id', deleteRoom);

// --- Special Package Routes ---
router.post('/packages', createSpecialPackage);
router.get('/packages', getSpecialPackages);
router.get('/packages/:id', getSpecialPackageById);
router.put('/packages/:id', updateSpecialPackage);
router.delete('/packages/:id', deleteSpecialPackage);

export default router;
