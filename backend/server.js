import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import itineraryRoutes from './routes/itineraryRoutes.js';

dotenv.config();

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Database Connection ───────────────────────────────────────────────────────
connectDB();

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/itinerary', itineraryRoutes);

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({ message: 'Smart Virtual Tourist Guide API is running! 🚀' });
});

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Node.js server running on http://localhost:${PORT}`);
});