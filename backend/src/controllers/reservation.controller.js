const Reservation = require("../models/reservation.model");
const Restaurant = require("../models/restaurant.model");

const createReservation = async (req, res) => {
  try {
    const { restaurantId, tableType, guestCount, date } = req.body;

    if (!restaurantId || !tableType || !guestCount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const tableConfig = restaurant.tables?.[tableType];
    if (!tableConfig) {
      return res.status(400).json({ message: "Invalid table type selected" });
    }

    // Check availability for this date and table type
    const dateStr = String(date);
    const existingBookings = await Reservation.find({
      restaurantId,
      tableType,
      date: dateStr,
      status: "Paid",
    });

    const bookedCount = existingBookings.reduce((sum, b) => sum + b.guestCount, 0);
    const availableSeats = Math.max(0, tableConfig.limit - bookedCount);

    if (guestCount > availableSeats) {
      return res.status(400).json({
        message: `Not enough available seats. Only ${availableSeats} seats left for ${tableConfig.name} on this date.`,
      });
    }

    // Calculations
    const pricePerPerson = tableConfig.pricePerPerson;
    const subtotal = pricePerPerson * guestCount;
    const serviceCharge = parseFloat((subtotal * 0.15).toFixed(2));
    const totalAmount = parseFloat((subtotal + serviceCharge).toFixed(2));

    const userEmail = req.user?.email || "guest@svtg.com";
    const userName = req.user?.fullName || "Guest Traveler";

    const reservation = await Reservation.create({
      restaurantId,
      userEmail,
      userName,
      tableType,
      guestCount,
      date: dateStr,
      pricePerPerson,
      subtotal,
      serviceCharge,
      totalAmount,
      status: "Paid",
    });

    return res.status(201).json(reservation);
  } catch (error) {
    console.error("Create reservation error:", error);
    return res.status(500).json({ message: "Server error creating reservation" });
  }
};

const getAvailability = async (req, res) => {
  try {
    const { restaurantId, date } = req.query;
    if (!restaurantId || !date) {
      return res.status(400).json({ message: "restaurantId and date are required" });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const dateStr = String(date);
    const reservations = await Reservation.find({
      restaurantId,
      date: dateStr,
      status: "Paid",
    });

    // Ethereal capacity
    const etherealBooked = reservations
      .filter((r) => r.tableType === "ethereal")
      .reduce((sum, r) => sum + r.guestCount, 0);
    const etherealLimit = restaurant.tables?.ethereal?.limit || 500;
    const etherealAvailable = Math.max(0, etherealLimit - etherealBooked);

    // Obsidian capacity
    const obsidianBooked = reservations
      .filter((r) => r.tableType === "obsidian")
      .reduce((sum, r) => sum + r.guestCount, 0);
    const obsidianLimit = restaurant.tables?.obsidian?.limit || 500;
    const obsidianAvailable = Math.max(0, obsidianLimit - obsidianBooked);

    return res.status(200).json({
      date: dateStr,
      ethereal: {
        name: restaurant.tables?.ethereal?.name || "The ethereal (full luxury experience)",
        pricePerPerson: restaurant.tables?.ethereal?.pricePerPerson || 285,
        limit: etherealLimit,
        booked: etherealBooked,
        available: etherealAvailable,
      },
      obsidian: {
        name: restaurant.tables?.obsidian?.name || "Obsidian terrace (open air sunset dinning)",
        pricePerPerson: restaurant.tables?.obsidian?.pricePerPerson || 195,
        limit: obsidianLimit,
        booked: obsidianBooked,
        available: obsidianAvailable,
      },
    });
  } catch (error) {
    console.error("Availability error:", error);
    return res.status(500).json({ message: "Server error fetching availability" });
  }
};

const getRestaurantReservations = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const reservations = await Reservation.find({ restaurantId }).sort({ createdAt: -1 });
    return res.status(200).json(reservations);
  } catch (error) {
    console.error("Get reservations error:", error);
    return res.status(500).json({ message: "Server error fetching reservations" });
  }
};

const getRestaurantRevenue = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const reservations = await Reservation.find({ restaurantId, status: "Paid" });

    const totalRevenue = reservations.reduce((sum, r) => sum + r.subtotal, 0);

    // This Month revenue
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthReservations = reservations.filter((r) => {
      const d = new Date(r.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
    const thisMonthRevenue = thisMonthReservations.reduce((sum, r) => sum + r.subtotal, 0);

    // Today revenue
    const todayStr = new Date().toISOString().split("T")[0];
    const todayReservations = reservations.filter((r) => r.date === todayStr);
    const todayRevenue = todayReservations.reduce((sum, r) => sum + r.subtotal, 0);

    return res.status(200).json({
      totalRevenue,
      thisMonthRevenue,
      todayRevenue,
      reservationsCount: reservations.length,
    });
  } catch (error) {
    console.error("Get revenue error:", error);
    return res.status(500).json({ message: "Server error calculating revenue" });
  }
};

const getTouristReservations = async (req, res) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      return res.status(400).json({ message: "User email not found in token" });
    }
    const reservations = await Reservation.find({ userEmail })
      .populate("restaurantId", "restaurantName address district phone")
      .sort({ createdAt: -1 });
    return res.status(200).json(reservations);
  } catch (error) {
    console.error("Get tourist reservations error:", error);
    return res.status(500).json({ message: "Server error fetching tourist reservations" });
  }
};

module.exports = {
  createReservation,
  getAvailability,
  getRestaurantReservations,
  getRestaurantRevenue,
  getTouristReservations,
};
