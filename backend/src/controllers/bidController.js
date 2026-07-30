import Bid from '../models/bid.js';

const submitBid = async (req, res, next) => {
    try {
        const { tripId, driverName, bidAmount } = req.body;

        if (!tripId || !driverName || !bidAmount) {
            return res.status(400).json({
                success: false,
                message: "tripId, driverName and bidAmount are required"
            });
        }

        const existingBid = await Bid.findOne({ tripId, driverName });

        if (existingBid) {
            return res.status(400).json({ 
                success: false, 
                message: "You have already placed a bid for this trip!" 
            });
        }

        const newBid = new Bid({
            tripId,
            driverName,
            bidAmount: Number(bidAmount)
        });

        await newBid.save();

        res.status(201).json({
            success: true,
            message: "Bid submitted successfully!",
            data: newBid
        });

    } catch (error) {
        next(error); 
    }
};

const getBidsByTrip = async (req, res, next) => {
    try {
        const { tripId } = req.params;

        if (!tripId) {
            return res.status(400).json({
                success: false,
                message: "tripId is required"
            });
        }

        const bids = await Bid.find({ tripId });

        res.status(200).json({
            success: true,
            data: bids
        });

    } catch (error) {
        next(error);
    }
};

export {
    submitBid,
    getBidsByTrip
};