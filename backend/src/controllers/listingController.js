const Listing = require('../models/Listing');

// Fetch all listings and calculate statistics for the approval dashboard
const getAllListings = async (req, res) => {
    try {
        const listings = await Listing.find().sort({ createdAt: -1 });
        
        const pendingCount = await Listing.countDocuments({ status: 'Pending' });
        const approvedCount = await Listing.countDocuments({ status: 'Approved' });
        const rejectedCount = await Listing.countDocuments({ status: 'Rejected' });

        res.status(200).json({ 
            success: true, 
            data: {
                listings,
                stats: { pendingCount, approvedCount, rejectedCount }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching listings' });
    }
};

// Update the status of a specific listing (Approve or Reject)
const updateListingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['Pending', 'Approved', 'Rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status provided.' });
        }

        const updatedListing = await Listing.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedListing) {
            return res.status(404).json({ success: false, message: 'Listing not found.' });
        }

        res.status(200).json({ 
            success: true, 
            message: `Listing marked as ${status}`,
            data: updatedListing 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating listing status' });
    }
};

module.exports = {
    getAllListings,
    updateListingStatus
};