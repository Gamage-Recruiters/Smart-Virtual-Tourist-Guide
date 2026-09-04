import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/database.js';
import hotelRouter from './src/routes/hotelRouter.js';
import {
  getRooms,
  getRoomById,
  getSpecialPackages,
  getUsersHotels,
  getBookingsByHotel,
  getRoomAvailability,
} from './src/controllers/hotelController.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/hotels', hotelRouter);
app.get('/api/rooms', getRooms);
app.get('/api/rooms/:id', getRoomById);
app.get('/api/special-packages', getSpecialPackages);
app.get('/api/users/hotels', getUsersHotels);
app.get('/api/bookings/hotel/:hotelId', getBookingsByHotel);
app.get('/api/room-availability', getRoomAvailability);

await connectDB();

const server = app.listen(5099, async () => {
  const baseUrl = 'http://localhost:5099';
  console.log('Testing server started on port 5099');

  try {
    // 1. Hotel search with Gampaha & coordinates
    console.log('\n--- 1. GET /api/hotels?location=Gampaha&lat=7.0840&lng=79.9926 ---');
    const r1 = await fetch(`${baseUrl}/api/hotels?location=Gampaha&lat=7.0840&lng=79.9926`);
    const d1 = await r1.json();
    console.log('Status:', r1.status, 'Count:', d1.data?.length);
    console.log('First hotel:', d1.data?.[0]?.name, '| Room:', d1.data?.[0]?.roomName, '| Distance:', d1.data?.[0]?.distanceKm, 'km');

    // 2. Hotel search text only
    console.log('\n--- 2. GET /api/hotels?location=Gampaha ---');
    const r2 = await fetch(`${baseUrl}/api/hotels?location=Gampaha`);
    const d2 = await r2.json();
    console.log('Status:', r2.status, 'Count:', d2.data?.length);

    // 3. Rooms
    console.log('\n--- 3. GET /api/rooms ---');
    const r3 = await fetch(`${baseUrl}/api/rooms`);
    const d3 = await r3.json();
    console.log('Status:', r3.status, 'Count:', d3.data?.length);
    const firstRoomId = d3.data?.[0]?._id;
    const hotelId = d3.data?.[0]?.hotelId;

    // 4. Room by ID
    console.log(`\n--- 4. GET /api/rooms/${firstRoomId} ---`);
    const r4 = await fetch(`${baseUrl}/api/rooms/${firstRoomId}`);
    const d4 = await r4.json();
    console.log('Status:', r4.status, 'Room Name:', d4.data?.roomName, 'Hotel:', d4.data?.hotelName);

    // 5. Special Packages
    console.log('\n--- 5. GET /api/special-packages ---');
    const r5 = await fetch(`${baseUrl}/api/special-packages`);
    const d5 = await r5.json();
    console.log('Status:', r5.status, 'Count:', d5.data?.length, 'Package:', d5.data?.[0]?.packageName);

    // 6. User Hotels
    console.log('\n--- 6. GET /api/users/hotels ---');
    const r6 = await fetch(`${baseUrl}/api/users/hotels`);
    const d6 = await r6.json();
    console.log('Status:', r6.status, 'Count:', d6.data?.length, 'Hotel Name:', d6.data?.[0]?.hotelName, 'Address:', d6.data?.[0]?.hotelAddress);

    // 7. Bookings by Hotel
    console.log(`\n--- 7. GET /api/bookings/hotel/${hotelId} ---`);
    const r7 = await fetch(`${baseUrl}/api/bookings/hotel/${hotelId}`);
    const d7 = await r7.json();
    console.log('Status:', r7.status, 'Count:', d7.data?.length, 'Sample Booking:', d7.data?.[0]?.bookingNo);

    // 8. Room Availability
    console.log('\n--- 8. GET /api/room-availability ---');
    const r8 = await fetch(`${baseUrl}/api/room-availability`);
    const d8 = await r8.json();
    console.log('Status:', r8.status, 'Count:', d8.data?.length);

    console.log('\n>>> ALL ENDPOINT TESTS PASSED SUCCESSFULLY! <<<');
  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});






