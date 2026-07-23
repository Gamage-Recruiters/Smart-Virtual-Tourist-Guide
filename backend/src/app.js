import express from 'express';
import cors from 'cors';

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

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// error handler middleware
app.use(errorHandler);

export default app;