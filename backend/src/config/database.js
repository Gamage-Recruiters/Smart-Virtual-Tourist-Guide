const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    // Matched the exact variable name defined in the .env file (MONGODB_URI)
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
       throw new Error("MONGODB_URI is not defined in the .env file. Please check your environment variables.");
    }

    const connection = await mongoose.connect(mongoURI);

    logger.info(`MongoDB connected successfully: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;