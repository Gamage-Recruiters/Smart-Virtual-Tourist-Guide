const Listing = require('../models/Listing');

// Fetch all listings and calculate statistics using MongoDB Aggregation (Optimized)
const getAllListings = async (req, res) => {
    try {
        // Using Promise.all to fetch listings and aggregate stats concurrently
        const [listings, statsAggregate] = await Promise.all([
            Listing.find().sort({ createdAt: -1 }),
            Listing.aggregate([
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                }
            ])
        ]);

        // Format the aggregation results into a clean object
        let stats = { pendingCount: 0, approvedCount: 0, rejectedCount: 0 };
        statsAggregate.forEach(stat => {
            if (stat._id === 'Pending') stats.pendingCount = stat.count;
            if (stat._id === 'Approved') stats.approvedCount = stat.count;
            if (stat._id === 'Rejected') stats.rejectedCount = stat.count;
        });

        res.status(200).json({ 
            success: true, 
            data: {
                listings,
                stats
            }
        });
    } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({ success: false, message: 'Error fetching listings from database' });
    }
};

// Approve a specific listing and record the admin who approved it
const approveListing = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.admin._id; 

        const updatedListing = await Listing.findByIdAndUpdate(
            id,
            { 
                status: 'Approved',
                approvedBy: adminId,
                approvedAt: new Date()
            },
            { new: true }
        );

        if (!updatedListing) {
            return res.status(404).json({ success: false, message: 'Listing not found.' });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Listing approved successfully',
            data: updatedListing 
        });
    } catch (error) {
        console.error('Error approving listing:', error);
        res.status(500).json({ success: false, message: 'Server error while approving listing' });
    }
};

// Reject a specific listing with a mandatory reason
const rejectListing = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body; 
        const adminId = req.admin._id;

        if (!reason || reason.trim() === '') {
            return res.status(400).json({ success: false, message: 'Rejection reason is required.' });
        }

        const updatedListing = await Listing.findByIdAndUpdate(
            id,
            { 
                status: 'Rejected',
                rejectedBy: adminId,
                rejectedAt: new Date(),
                rejectionReason: reason
            },
            { new: true }
        );

        if (!updatedListing) {
            return res.status(404).json({ success: false, message: 'Listing not found.' });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Listing rejected successfully',
            data: updatedListing 
        });
    } catch (error) {
        console.error('Error rejecting listing:', error);
        res.status(500).json({ success: false, message: 'Server error while rejecting listing' });
    }
};

module.exports = {
    getAllListings,
    approveListing,
    rejectListing
};