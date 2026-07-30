import mongoose from 'mongoose';

let testConn = null;

const getTestDb = async () => {
  if (testConn) return testConn;

  const uri = process.env.MONGODB_URI_TEST;
  if (!uri) throw new Error('MONGODB_URI_TEST is not defined in .env');

  testConn = await mongoose.createConnection(uri).asPromise();
  console.log('Test DB connected');
  return testConn;
};

export default getTestDb;
