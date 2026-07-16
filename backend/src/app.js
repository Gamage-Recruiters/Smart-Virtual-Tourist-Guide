const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./configs/database');

// Load environment variables
dotenv.config();

const app = express();

// ─── CORS ──────────────────────────────────────────────────────────────────
// Allow the React dev server (Vite :5173 or CRA :3000) to call this API
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ─── Body parsers ──────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Database ──────────────────────────────────────────────────────────────
connectDB();

// ─── Health check ──────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// ─── Routes ────────────────────────────────────────────────────────────────
const authRoutes         = require('./routes/authRoutes');
const budgetRoutes       = require('./routes/budgetRoutes');
const bookingRoutes      = require('./routes/bookingRoutes');
const dashboardRoutes    = require('./routes/dashboardRoutes');
const itineraryRoutes    = require('./routes/itineraryRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const touristRoutes      = require('./routes/touristRoutes');

app.use('/api/auth',          authRoutes);
app.use('/api/budget',        budgetRoutes);
app.use('/api/bookings',      bookingRoutes);
app.use('/api/dashboard',     dashboardRoutes);
app.use('/api/itinerary',     itineraryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/tourists',      touristRoutes);

// ─── 404 fallback ──────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// ─── Global error handler ──────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

module.exports = app;
