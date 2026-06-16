<<<<<<< HEAD
require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const app = express();
const connectDB = require('./src/configs/database');

const feedbackRoutes = require('./src/routes/feedbackRoutes');
const itineraryRoutes = require('./src/routes/itineraryRoutes');

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


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
=======
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
>>>>>>> ebada5d5c29fc1294a4f406fc35c04308fdb4ea9
