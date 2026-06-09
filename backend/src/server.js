const dotenv = require('dotenv');
// 1. Load environment variables FIRST
dotenv.config();

// DNS fix (Kept as requested to resolve specific network DNS issues)
const dns = require('dns').promises;
dns.setServers(['1.1.1.1']);

const connectDB = require('./src/config/database');
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

// 2. Connect to MongoDB Atlas
connectDB().then(() => {
  // 3. Start the server only after Database is connected
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error("Failed to connect to the database. Server not started.", error);
});