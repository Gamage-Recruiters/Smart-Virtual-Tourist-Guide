import mongoose from 'mongoose';

let testConn = null;

const getTestDb = async () => {
  if (testConn) return testConn;

  const uri = process.env.MONGODB_URI_TEST;
  if (!uri) throw new Error('MONGODB_URI_TEST is not defined in .env');

  testConn = await mongoose.createConnection(uri).asPromise();
  console.log('Test DB connected');

  // Drop stale global unique indexes on roomNumber and roomName left over
  // from old schema versions — must run on this connection, not mongoose.connection
  try {
    const col = testConn.collection('rooms');
    const indexes = await col.indexes();
    for (const idx of indexes) {
      const keys = Object.keys(idx.key);
      if (idx.unique && keys.length === 1 && (keys[0] === 'roomNumber' || keys[0] === 'roomName')) {
        await col.dropIndex(idx.name);
        console.log(`Dropped stale index: ${idx.name}`);
      }
    }
  } catch (_) {}

  return testConn;
};

export default getTestDb;
