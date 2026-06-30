const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config(); //use to access the values in .env file

const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cron = require('node-cron');
const connectDB = require('./src/config/database');
const errorHandler = require('./src/middleware/errorHandler');
const safetyRouter = require('./src/routes/safetyRouter');
const { syncWeatherAlerts } = require('./src/utils/alertSyncService');
const notificationHandler = require('./socket/notificationHandler');
const socketAuth = require('./src/middleware/socketAuthMiddleware');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// --- NOTIFICATION ENGINE: Socket.io Setup ---
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Make io accessible in controllers via req.app.get('io')
app.set('io', io);

// Secure socket connections with JWT auth
io.use(socketAuth);

// Initialize notification socket handler (manages user rooms)
notificationHandler(io);




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
    console.log(`Socket.io notification engine is active`);

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
