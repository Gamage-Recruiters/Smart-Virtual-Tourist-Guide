// const app = require('./src/app');

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });


const dotenv = require('dotenv');
dotenv.config();

const app = require('./src/app');
const connectDB = require('./src/configs/db');

const PORT = process.env.PORT || 5000;

// connect database
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});