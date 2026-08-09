import Restaurant from '../models/Restaurant.js';

// Get all restaurants
export const getRestaurants = async (req, res, next) => {
    try {
        const restaurants = await Restaurant.find();
        res.status(200).json({ success: true, count: restaurants.length, data: restaurants });
    } catch (error) {
        next(error);
    }
};
