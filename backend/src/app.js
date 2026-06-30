const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const restaurantRoutes = require('./routes/restaurant.routes');
const menuItemRoutes = require('./routes/menuItem.routes');
const offerRoutes = require('./routes/offer.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Smart Virtual Tourist Guide API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuItemRoutes);
app.use('/api/offers', offerRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
