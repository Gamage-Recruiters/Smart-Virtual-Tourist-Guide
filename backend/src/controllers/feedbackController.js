const TripFeedback = require("../models/TripFeedback");

const createFeedback = async (req, res) => {
    try {
        const { touristId, tripId, overallRating, feedbackText } = req.body;


        if (!touristId || !tripId || !overallRating || !feedbackText) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newFeedback = new TripFeedback({
            touristId,
            tripId,
            overallRating,
            feedbackText
        });

        const savedFeedback = await newFeedback.save();

        res.status(201).json({
            message: "Feedback submitted successfully!",
            data: savedFeedback
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error occurred while submitting feedback",
            error: error.message
        });
    }
};

const getFeedbackById = async (req, res) => {
    try {
        const { touristId, tripId } = req.params;

        if (!touristId || !tripId) {
            return res.status(400).json({ error: "Tourist ID and Trip ID are required" });
        }

        const feedback = await TripFeedback.findOne({
            touristId: touristId,
            tripId: tripId
        });

        if (!feedback) {
            return res.status(404).json({ error: "Feedback not found" });
        }

        res.status(200).json({
            success: true, 
            message: "Feedback fetched successfully!",
            data: feedback
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error occurred while fetching feedback",
            error: error.message
        });
    }
};

module.exports = {
    createFeedback,
    getFeedbackById
};