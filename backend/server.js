const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database');
const adminRoutes = require('./src/routes/adminRoutes');

// 1. Load environment variables FIRST before anything else uses them
dotenv.config();

// 👉 DNS fix (Kept as requested to resolve specific network DNS issues)
const dns = require('dns').promises;
dns.setServers(['1.1.1.1']);

const app = express();
const PORT = process.env.PORT || 5000;

// 2. Middleware setup
app.use(cors());
app.use(express.json());

// 3. Connect to MongoDB Atlas via the separate config file
connectDB();

// 4. API Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Smart Virtual Tourist Guide API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running properly' });
});

app.use('/api/admin', adminRoutes);

// 5. Global Error Handler (Safety net for unhandled errors)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong on the server side',
  });
});

// 6. Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});