import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGODB_URI_TOURISM || 'mongodb://localhost:27017/tourismGuideDB'
    );

    console.log('MongoDB connected successfully');
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;