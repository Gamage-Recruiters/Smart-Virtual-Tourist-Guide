import ActivityBooking from '../models/ActivityBooking.js';
import HotelBooking from '../models/HotelBooking.js';
import VehicleBooking from '../models/VehicleBooking.js';
import GuideBooking from '../models/GuideBooking.js';
import DriverBooking from '../models/DriverBooking.js';
import RestaurantBooking from '../models/RestaurantBooking.js';

export const getBookingsByTourist = async (req, res) => {
    try {
        const { email } = req.params; 

        const [activities, hotels, vehicles, guides, drivers, restaurants] = await Promise.all([
            ActivityBooking.find({ "customer.email": email, status: 'confirmed' }),
            HotelBooking.find({ "customer.email": email, status: 'confirmed' }),
            VehicleBooking.find({ "customer.email": email, status: 'confirmed' }),
            GuideBooking.find({ "customer.email": email, status: 'confirmed' }),
            DriverBooking.find({ "customer.email": email, status: 'confirmed' }),
            RestaurantBooking.find({ "customer.email": email, status: 'confirmed' })
        ]);

        if (!activities || !hotels || !vehicles || !guides || !drivers || !restaurants) {
            return res.status(404).json({ success: false, message: 'Bookings not found' });
        }

        res.status(200).json({
            success: true,
            data: { activities, hotels, vehicles, guides, drivers, restaurants }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};