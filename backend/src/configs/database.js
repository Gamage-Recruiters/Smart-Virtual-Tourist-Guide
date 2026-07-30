const mongoose = require('mongoose');
const dns = require('dns');

// Override system DNS with Google's public DNS to fix Atlas SRV resolution
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }

    await mongoose.connect(mongoURI, {
      // Force IPv4 to avoid IPv6 DNS lookup failures
      family: 4,
      // Retry failed connections
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log('MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
