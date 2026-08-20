import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/tourdb'
    );

    logger.info('MongoDB connected successfully');
    return connection;
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
