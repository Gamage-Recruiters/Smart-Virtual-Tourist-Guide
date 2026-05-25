const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    // Make sure to use the exact variable name defined in your .env file
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/smart-virtual-tourist';
    
    const connection = await mongoose.connect(mongoURI);

    logger.info(`MongoDB connected successfully: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;