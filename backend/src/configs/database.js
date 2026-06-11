import mongoConn from 'mongoose';
const { connect, connection } = mongoConn;

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }

    await connect(mongoURI);

    console.log('MongoDB connected successfully');
    return connection;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
