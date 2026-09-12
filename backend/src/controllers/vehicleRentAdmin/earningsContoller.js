import mongoose from "mongoose";
import RentalEarning from "../../models/vehicleRentAdmin/rentalEarnings.js";
import RentalRequest from "../../models/vehicleRentAdmin/rentalRequest.js";
import Vehicle from "../../models/vehicleRentAdmin/vehicle.js";

// Helper 1: Fetch all vehicle IDs owned by this renter
const getRenterVehicleIds = async (renterId) => {
  const vehicles = await Vehicle.find({ ownerId: renterId }).select("_id");
  return vehicles.map((v) => v._id);
};

// Helper 2: Calculate next payout date (e.g. 5 days from today)
const getNextPayoutDate = () => {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 5);
  return targetDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

// @desc    Get dashboard top summary stats (Vehicles & Total Earnings)
// @route   GET /api/renter/earnings/dashboard-stats
export const dashboardStats = async (req, res) => {
  try {
    const renterId = req.user?._id || req.user?.id;

    // 1. Vehicle status counts
    const activeRenatalsCount = await Vehicle.countDocuments({
      ownerId: renterId,
      status: "Available",
    });

    const rentedVehiclesCount = await Vehicle.countDocuments({
      ownerId: renterId,
      status: "Rented",
    });

    // 2. Total Earnings: Sum of all non-cancelled earnings for this renter
    const earningsRecords = await RentalEarning.find({
      renterId,
      tripStatus: { $ne: "CANCELLED" },
    }).select("amount");

    const totalEarnings = earningsRecords.reduce(
      (acc, curr) => acc + (curr.amount || 0),
      0,
    );

    return res.status(200).json({
      activeRenatalsCount,
      rentedVehiclesCount,
      totalEarnings,
    });
  } catch (err) {
    console.error("dashboardStats error:", err);
    return res.status(500).json({
      message: "Error fetching dashboard stats!",
      error: err.message,
    });
  }
};

// @desc    Get complete earnings overview, monthly trends, & completed transactions
// @route   GET /api/renter/earnings/rantal-earnings
export const getEarningsOverview = async (req, res) => {
  try {
    const renterId = req.user?._id || req.user?.id;
    const currentYear = new Date().getFullYear();

    // 1. Total Revenue: Sum of all non-cancelled earnings
    const allValidEarnings = await RentalEarning.find({
      renterId,
      tripStatus: { $ne: "CANCELLED" },
    });
    const totalRevenue = allValidEarnings.reduce(
      (acc, curr) => acc + (curr.amount || 0),
      0,
    );

    // 2. Pending Payout: Funds from trips that are COMPLETED but not paid out
    const pendingPayoutRecords = await RentalEarning.find({
      renterId,
      tripStatus: "COMPLETED",
      payoutStatus: "PENDING_PAYOUT",
    });
    const pendingPayout = pendingPayoutRecords.reduce(
      (acc, curr) => acc + (curr.amount || 0),
      0,
    );

    // 3. Success Rate
    const vehicleIds = await getRenterVehicleIds(renterId);
    const totalRequestsCount = await RentalRequest.countDocuments({
      vehicleId: { $in: vehicleIds },
    });
    const successfulRequestsCount = await RentalRequest.countDocuments({
      vehicleId: { $in: vehicleIds },
      status: { $in: ["CONFIRMED", "WON", "COMPLETED"] },
    });
    const successRate =
      totalRequestsCount > 0
        ? Math.round((successfulRequestsCount / totalRequestsCount) * 100)
        : 100;

    // 4. Monthly Revenue Aggregation for Selected Year
    const monthlyRaw = await RentalEarning.aggregate([
      {
        $match: {
          renterId: new mongoose.Types.ObjectId(renterId),
          tripStatus: "COMPLETED",
          createdAt: {
            $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            $lte: new Date(`${currentYear}-12-31T23:59:59.999Z`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$amount" },
        },
      },
    ]);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const chartData = months.map((monthName, idx) => {
      const match = monthlyRaw.find((m) => m._id === idx + 1);
      return {
        name: monthName,
        revenue: match ? match.revenue : 0,
      };
    });

    // 5. Transaction History: ONLY Completed trips
    const completedTransactions = await RentalEarning.find({
      renterId,
      tripStatus: "COMPLETED",
    })
      .sort({ completionDate: -1, createdAt: -1 })
      .select("transactionId tripDescription amount createdAt completionDate");

    const formattedHistory = completedTransactions.map((trx) => ({
      id: trx.transactionId,
      date: new Date(trx.completionDate || trx.createdAt).toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "2-digit",
          year: "numeric",
        },
      ),
      description: trx.tripDescription,
      amount: (trx.amount || 0).toLocaleString(),
      status: "Completed",
    }));

    return res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        pendingPayout,
        successRate: `${successRate}%`,
        expectedDate: getNextPayoutDate(),
      },
      chartData,
      transactions: formattedHistory,
    });
  } catch (error) {
    console.error("getEarningsOverview error:", error);
    return res
      .status(500)
      .json({
        message: "Server error fetching earnings data.",
        error: error.message,
      });
  }
};
