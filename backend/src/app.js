import express from 'express';
import dotenv from 'dotenv';
import connectDB from './configs/database.js';

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
import authRoutes from './routes/authRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import itineraryRoutes from './routes/itineraryRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import touristRoutes from './routes/touristRoutes.js';

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

export default app;
