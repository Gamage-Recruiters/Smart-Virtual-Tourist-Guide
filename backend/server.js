const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// 👉 DNS fix

const dns = require('dns').promises;
dns.setServers(['1.1.1.1']);

const adminRoutes = require('./src/routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config(); 

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Smart Virtual Tourist Guide API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});


app.use('/api/admin', adminRoutes);


// db connection
let mongoUrl = process.env.MONGO_URI;
mongoose.connect(mongoUrl);

let connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB connected successfully");
});

// Start server 
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});