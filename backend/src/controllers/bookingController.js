import ActivityBooking from '../models/ActivityBooking.js';
import HotelBooking from '../models/HotelBooking.js';
import VehicleBooking from '../models/VehicleBooking.js';

export const getBookingsByTourist = async (req, res) => {
    try {
        const { email } = req.params; 

        const [activities, hotels, vehicles] = await Promise.all([
            ActivityBooking.find({ "customer.email": email, status: 'confirmed' }),
            HotelBooking.find({ "customer.email": email, status: 'confirmed' }),
            VehicleBooking.find({ "customer.email": email, status: 'confirmed' })
        ]);

        if (!activities || !hotels || !vehicles) {
            return res.status(404).json({ success: false, message: 'Bookings not found' });
        }

        res.status(200).json({
            success: true,
            data: { activities, hotels, vehicles }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};