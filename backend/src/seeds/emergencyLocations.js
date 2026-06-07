/**
 * Seed data for Sri Lanka Tourist Police Stations
 *
 * Run this seed with: node src/seeds/emergencyLocations.js
 * It will connect to the DB and insert all Tourist Police station records.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const EmergencyLocation = require('../models/EmergencyLocation');

const touristPoliceStations = [
  {
    name: 'Tourist Police Station Colombo',
    type: 'tourist_police',
    address: 'Galle Road, Colombo 03',
    district: 'Colombo',
    phone: '+94 11 242 1052',
    location: { lat: 6.9183463, lng: 79.8471811 },
    operatingHours: '24/7',
    isActive: true,
  },
  {
    name: 'Tourist Police Kandy',
    type: 'tourist_police',
    address: 'Kandy',
    district: 'Kandy',
    phone: '+94 81 383 7392',
    location: { lat: 7.2932149, lng: 80.6336302 },
    operatingHours: '24/7',
    isActive: true,
  },
  {
    name: 'Tourist Police Station Negombo',
    type: 'tourist_police',
    address: 'Negombo',
    district: 'Gampaha',
    phone: '+94 31 227 5555',
    location: { lat: 7.246012, lng: 79.8421251 },
    operatingHours: '24/7',
    isActive: true,
  },
  {
    name: 'Tourist Police Station Polonnaruwa',
    type: 'tourist_police',
    address: 'Polonnaruwa',
    district: 'Polonnaruwa',
    phone: '+94 27 222 3099',
    location: { lat: 7.9390145, lng: 81.0000455 },
    operatingHours: '24/7',
    isActive: true,
  },
  {
    name: 'Tourist Police Hikkaduwa',
    type: 'tourist_police',
    address: 'Hikkaduwa',
    district: 'Galle',
    phone: '+94 91 227 5545',
    location: { lat: 6.1246956, lng: 80.1097264 },
    operatingHours: '24/7',
    isActive: true,
  },
  {
    name: 'Tourist Police Unawatuna',
    type: 'tourist_police',
    address: 'Unawatuna',
    district: 'Galle',
    phone: '',
    location: { lat: 6.0100137, lng: 80.2423234 },
    operatingHours: '24/7',
    isActive: true,
  },
  {
    name: 'Moragalla Tourist Police Station',
    type: 'tourist_police',
    address: 'Moragalla, Aluthgama',
    district: 'Kalutara',
    phone: '+94 34 227 6049',
    location: { lat: 6.4481518, lng: 79.9885797 },
    operatingHours: '24/7',
    isActive: true,
  },
  {
    name: 'Tourist Police Unit Wellawaya',
    type: 'tourist_police',
    address: 'Wellawaya',
    district: 'Monaragala',
    phone: '',
    location: { lat: 6.7295596, lng: 81.1023302 },
    operatingHours: '24/7',
    isActive: true,
  },
  {
    name: 'Tourist Police Arugam Bay',
    type: 'tourist_police',
    address: 'Arugam Bay, Pottuvil',
    district: 'Ampara',
    phone: '+94 11 308 1044',
    location: { lat: 6.8411025, lng: 81.8329993 },
    operatingHours: '24/7',
    isActive: true,
  },
];

const seedEmergencyLocations = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Remove existing tourist police stations to avoid duplicates
    const deleteResult = await EmergencyLocation.deleteMany({ type: 'tourist_police' });
    console.log(`🗑️  Removed ${deleteResult.deletedCount} existing tourist police records`);

    // Insert fresh data
    const inserted = await EmergencyLocation.insertMany(touristPoliceStations);
    console.log(`✅ Seeded ${inserted.length} Tourist Police stations`);

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedEmergencyLocations();
