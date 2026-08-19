import Bid from '../models/bid.js';

const submitBid = async (req, res, next) => {
    try {
        const { tripId, driverName, bidAmount, userId, userName } = req.body;

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
            bidAmount: Number(bidAmount),
            userId,
            userName
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

const getBidsByUser = async (req, res, next) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required"
            });
        }

        const bids = await Bid.find({ userId });

        res.status(200).json({
            success: true,
            data: bids
        });

    } catch (error) {
        next(error);
    }
};

const getBidsByDriver = async (req, res, next) => {
    try {
        const { driverName } = req.params;

        if (!driverName) {
            return res.status(400).json({
                success: false,
                message: "driverName is required"
            });
        }

        const bids = await Bid.find({ driverName });

        res.status(200).json({
            success: true,
            data: bids
        });

    } catch (error) {
        next(error);
    }
};

const getLowestBidByTrip = async (req, res, next) => {
    try {
        const { tripId } = req.params;

        if (!tripId) {
            return res.status(400).json({
                success: false,
                message: "tripId is required"
            });
        }

        // Find the lowest bid by sorting bidAmount in ascending order and taking the first one
        const lowestBid = await Bid.findOne({ tripId }).sort({ bidAmount: 1 });

        if (!lowestBid) {
            return res.status(404).json({
                success: false,
                message: "No bids found for this trip"
            });
        }

        res.status(200).json({
            success: true,
            data: lowestBid
        });

    } catch (error) {
        next(error);
    }
};

export {
    submitBid,
    getBidsByTrip,
    getBidsByUser,
    getBidsByDriver,
    getLowestBidByTrip
};