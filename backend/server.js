import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/database.js';
import serviceRouter from './src/routes/serviceRouter.js';
import favoriteRouter from './src/routes/favoriteRouter.js';
import securityAlertRouter from './src/routes/securityAlertRouter.js';
import incidentRouter from './src/routes/incidentRouter.js';
import hotelRouter from './src/routes/hotelRouter.js';

dotenv.config(); // use values from .env before reading environment variables

const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Smart Virtual Tourist Guide API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.use('/api/recent-places', serviceRouter);
app.use('/api/favorite-places', favoriteRouter);
app.use('/api/security-alerts', securityAlertRouter);
app.use('/api/incidents', incidentRouter);
app.use('/api/hotels', hotelRouter);

// Start server after MongoDB connects
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

