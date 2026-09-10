import mongoose from 'mongoose';

// In-memory fallback array for bids if MongoDB isn't populated for temporary trip IDs
const inMemoryBids = [
  { _id: "b1", tripId: "default", driverName: "Kamal Perera", bidAmount: 12000, status: "pending", createdAt: new Date() },
  { _id: "b2", tripId: "default", driverName: "Sunil Shantha", bidAmount: 9500, status: "pending", createdAt: new Date() },
  { _id: "b3", tripId: "default", driverName: "Nimal Fernando", bidAmount: 10500, status: "pending", createdAt: new Date() },
];

/**
 * Helper: Find lowest bid for a tripId and set it as hired automatically
 */
function autoAssignLowestBid(tripId) {
  const tripBids = inMemoryBids.filter(b => b.tripId === tripId || tripId === "default" || !tripId);
  if (tripBids.length === 0) return null;

  // Sort by bidAmount ascending
  tripBids.sort((a, b) => a.bidAmount - b.bidAmount);

  // Lowest bid driver gets auto-hired
  const lowest = tripBids[0];
  tripBids.forEach(b => {
    if (b._id === lowest._id) {
      b.status = "hired";
      b.autoHired = true;
    } else {
      b.status = "rejected";
      b.autoHired = false;
    }
  });

  return lowest;
}

// Automatically run initial auto-assign for default bids
autoAssignLowestBid("default");

// GET /api/bids/:tripId or GET /api/bids
export const getBidsByTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const targetTrip = tripId || "default";

    // Auto-assign lowest bid before returning
    const lowest = autoAssignLowestBid(targetTrip);

    const bids = inMemoryBids.filter(b => b.tripId === targetTrip || targetTrip === "default");
    bids.sort((a, b) => a.bidAmount - b.bidAmount);

    return res.status(200).json({
      success: true,
      data: bids,
      autoHiredDriver: lowest,
      count: bids.length
    });
  } catch (error) {
    console.error("getBidsByTrip error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch bids" });
  }
};

// POST /api/bids - Submit a new driver bid
export const submitBid = async (req, res) => {
  try {
    const { tripId, driverName, bidAmount, notes } = req.body;

    if (!bidAmount || Number(bidAmount) <= 0) {
      return res.status(400).json({ success: false, message: "Valid bid amount is required" });
    }

    const newBid = {
      _id: "bid_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      tripId: tripId || "default",
      driverName: driverName || "Driver",
      bidAmount: Number(bidAmount),
      notes: notes || "",
      status: "pending",
      createdAt: new Date()
    };

    inMemoryBids.push(newBid);

    // Run auto-hire logic: lowest bid driver automatically gets hired
    const lowest = autoAssignLowestBid(newBid.tripId);

    return res.status(201).json({
      success: true,
      message: "Bid submitted successfully",
      data: newBid,
      autoHiredDriver: lowest
    });
  } catch (error) {
    console.error("submitBid error:", error);
    return res.status(500).json({ success: false, message: "Failed to submit bid" });
  }
};

// PUT /api/bids/hire/:bidId - Mark a specific bid as hired
export const hireBid = async (req, res) => {
  try {
    const { bidId } = req.params;
    const bid = inMemoryBids.find(b => b._id === bidId);

    if (!bid) {
      return res.status(404).json({ success: false, message: "Bid not found" });
    }

    // Set target bid to hired, reject others for same trip
    inMemoryBids.forEach(b => {
      if (b.tripId === bid.tripId) {
        if (b._id === bidId) {
          b.status = "hired";
          b.autoHired = true;
        } else {
          b.status = "rejected";
          b.autoHired = false;
        }
      }
    });

    return res.status(200).json({
      success: true,
      message: `Driver ${bid.driverName} hired successfully`,
      data: bid
    });
  } catch (error) {
    console.error("hireBid error:", error);
    return res.status(500).json({ success: false, message: "Failed to hire driver" });
  }
};
