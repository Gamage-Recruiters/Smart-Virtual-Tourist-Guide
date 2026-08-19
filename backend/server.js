import dns from 'dns';
import dotenv from 'dotenv';

dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config();

import express from 'express';
import cors from 'cors';

import connectDB from './src/configs/database.js';

import feedbackRoutes from './src/routes/feedbackRoutes.js';
import itineraryRoutes from './src/routes/itineraryRoutes.js';
import reportRoutes from './src/routes/reportRoutes.js';
import pdfRoutes from './src/routes/pdfRoutes.js';
import healthRoutes from './src/routes/healthRoutes.js';
import emailRoutes from './src/routes/emailRoutes.js';
import financialSummeryRoutes from './src/routes/financialSummeryRoutes.js';
import bookingRoutes from './src/routes/bookingRoutes.js';

const app = express();

connectDB();

app.use(express.json());

app.use(
    cors({
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    })
);

app.use('/api/feedback', feedbackRoutes); 
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/export', pdfRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/budget', financialSummeryRoutes);
app.use('/api/booking', bookingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

