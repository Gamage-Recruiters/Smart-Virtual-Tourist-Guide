import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import restaurantRoutes from './routes/restaurant.routes.js';
import menuItemRoutes from './routes/menuItem.routes.js';
import offerRoutes from './routes/offer.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import reservationRoutes from './routes/reservation.routes.js';
import reviewRoutes from './routes/review.routes.js';
import errorHandler from './middleware/errorHandler.js';

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
app.use('/api/upload', uploadRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/reviews', reviewRoutes);


// Error handling middleware
app.use(errorHandler);

export default app;
