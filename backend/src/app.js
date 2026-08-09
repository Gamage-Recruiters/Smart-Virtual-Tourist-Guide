import express from 'express';
import cors from 'cors';

// Auth Routes
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import errorHandler from './middleware/errorHandler.js';

// Review ROUTES
import reviewRoutes from './routes/review.routes.js'; 

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// --- ROUTES INTEGRATION ---
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Review Routes
app.use('/api/reviews', reviewRoutes);

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