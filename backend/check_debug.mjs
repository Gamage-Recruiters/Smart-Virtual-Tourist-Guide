import mongoose from 'mongoose';

const conn = await mongoose.createConnection('mongodb+srv://SVTG:svtg123@cluster0.936rmcg.mongodb.net/test?appName=Cluster0').asPromise();

// Check all rooms and packages for Grand Kandyan hotelId
const hotelId = '6a731ad0aa764273f6e06dbd';
console.log('=== Searching rooms for hotelId:', hotelId, '===');
const rooms = await conn.collection('rooms').find({ hotelId: hotelId }).toArray();
console.log('Rooms found:', rooms.length);
rooms.forEach(r => {
  console.log('Room:', r.roomName);
  console.log('Images:', JSON.stringify(r.images));
  console.log('locationAndPricing:', JSON.stringify(r.locationAndPricing));
  console.log('---');
});

// Also try ObjectId version
const { ObjectId } = mongoose.Types;
const roomsById = await conn.collection('rooms').find({ hotelId: new ObjectId(hotelId) }).toArray();
console.log('Rooms found (ObjectId):', roomsById.length);

console.log('\n=== Searching specialpackages for hotelId:', hotelId, '===');
const pkgs = await conn.collection('specialpackages').find({ hotelId: hotelId }).toArray();
console.log('Packages found:', pkgs.length);
const pkgsById = await conn.collection('specialpackages').find({ hotelId: new ObjectId(hotelId) }).toArray();
console.log('Packages found (ObjectId):', pkgsById.length);

// Check ALL Kandy-related items now
console.log('\n=== ALL items with Kandy in aboutLocation ===');
const allRooms = await conn.collection('rooms').find({}).toArray();
const allPkgs = await conn.collection('specialpackages').find({}).toArray();
const all = [...allRooms, ...allPkgs];
console.log('Total rooms:', allRooms.length, 'Total packages:', allPkgs.length);

const kandyItems = all.filter(i => {
  const about = (i.locationAndPricing?.[0]?.aboutLocation || '').toLowerCase();
  return about.includes('kandy');
});
console.log('Kandy items:', kandyItems.length);
kandyItems.forEach(i => {
  console.log('Name:', i.roomName || i.packageName);
  console.log('hotelId:', i.hotelId, 'type:', typeof i.hotelId);
  console.log('Images:', JSON.stringify(i.images));
  console.log('locationAndPricing:', JSON.stringify(i.locationAndPricing));
  console.log('---');
});

// Also check if hotelId is stored differently
console.log('\n=== Last 5 rooms (newest) ===');
const recent = allRooms.slice(-5);
recent.forEach(r => {
  console.log('Room:', r.roomName, '| hotelId:', r.hotelId, '| type:', typeof r.hotelId);
  console.log('aboutLocation:', r.locationAndPricing?.[0]?.aboutLocation);
  console.log('images count:', r.images?.length);
  console.log('---');
});

await conn.close();
process.exit(0);
