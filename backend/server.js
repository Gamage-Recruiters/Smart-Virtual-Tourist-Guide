require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Smart Virtual Tourist Guide API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Mount itinerary routes
const itineraryRoutes = require('./routes/itineraryRoutes');
app.use('/api/itinerary', itineraryRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});