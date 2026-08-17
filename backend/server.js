import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/configs/database.js";

// Port
const PORT = process.env.PORT || 5000;

// Start server after DB connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('DB connection failed:', err);
  process.exit(1);
});
