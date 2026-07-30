import mongoose from 'mongoose';
import dns from 'dns';
import logger from '../utils/logger.js';

// Override system DNS with Google's public DNS to fix Atlas SRV resolution
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/tourdb',
      {
        // Force IPv4 to avoid IPv6 DNS lookup failures
        family: 4,
        // Increase timeouts for Atlas cold-start
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      }
    );

    logger.info('MongoDB connected successfully');
    return connection;
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;