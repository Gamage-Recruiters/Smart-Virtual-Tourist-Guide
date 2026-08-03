import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './configs/database.js';

import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

// basic routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Smart Virtual Tourist Guide API' });
});

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// error handler middleware
app.use(errorHandler);

export default app;
