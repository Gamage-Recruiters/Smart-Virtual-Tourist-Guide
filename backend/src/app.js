import express, { json, urlencoded } from 'express';
import { config } from 'dotenv';
import connectDB from "./configs/database.js";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import roomRoutes from './routes/Room.routes.js';
import specialPackageRoutes from './routes/specialPackage.routes.js';
import roomAvailabilityRoutes from './routes/roomAvailability.routes.js';

config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(json());
app.use(cors());
app.use(urlencoded({ extended: true }));

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

connectDB();

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.use('/api/rooms', roomRoutes);
app.use('/api/packages', specialPackageRoutes);
app.use('/api/room-availability', roomAvailabilityRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

export default app;
