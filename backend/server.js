require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const app = express();
const connectDB = require('./src/configs/database');

const feedbackRoutes = require('./src/routes/feedbackRoutes');
const itineraryRoutes = require('./src/routes/itineraryRoutes');
const reportRoutes = require('./src/routes/reportRoutes');
const pdfRoutes = require('./src/routes/pdfRoutes');

connectDB();

app.use(express.json());

app.use(
    cors({
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    })
);

app.use('/api/feedback', feedbackRoutes); 
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/export', pdfRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

