import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URL;

    if (!mongoURI) {
      throw new Error('MONGODB_URI or MONGO_URL is not defined in .env file');
    }

    await mongoose.connect(mongoURI);

    console.log('MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};