const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/database');
const errorHandler = require('./src/middleware/errorHandler');
const safetyRouter = require('./src/routes/safetyRouter');

const app = express();
const PORT = process.env.PORT || 5000;



dotenv.config(); //use to access the values in .env file
// Middleware
app.use(cors());
app.use(express.json());

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
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});


