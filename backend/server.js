import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cron from 'node-cron';
import connectDB from './src/config/database.js';
import errorHandler from './src/middleware/errorHandler.js';
import safetyRouter from './src/routes/safetyRouter.js';
import { syncWeatherAlerts } from './src/utils/alertSyncService.js';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// --- NOTIFICATION ENGINE: Socket.io Setup ---
// Wrapped in try/catch so the server starts even if notification module isn't merged yet
let io = null;
try {
  const { default: notificationHandler } = await import('./socket/notificationHandler.js');
  const { default: socketAuth } = await import('./src/middleware/socketAuthMiddleware.js');

  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  app.set('io', io);
  io.use(socketAuth);
  notificationHandler(io);
  console.log('[STARTUP] Notification engine initialized successfully');
} catch (err) {
  console.warn('[STARTUP] Notification engine not available — skipping Socket.io setup:', err.message);
}




// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('src/uploads'));

// Routes
app.use('/api/safety', safetyRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Smart Virtual Tourist Guide API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use(errorHandler);

// Start server and connect DB
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    if (io) console.log('Socket.io notification engine is active');

    // Run weather alert sync every 15 minutes
    cron.schedule('*/15 * * * *', () => {
      console.log('[CRON] Syncing weather alerts for 25 districts...');
      syncWeatherAlerts(io).catch(err => console.error('[CRON] Sync failed:', err));
    });

    // Run once on startup
    console.log('[STARTUP] Running initial weather alert sync...');
    syncWeatherAlerts(io).catch(err => console.error('[STARTUP] Initial sync failed:', err));
  });
});
