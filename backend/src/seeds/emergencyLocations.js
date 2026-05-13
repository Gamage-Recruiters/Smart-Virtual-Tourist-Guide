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
    name: 'Colombo Tourist Police Station',
    type: 'tourist_police',
    address: 'No. 29, Bristol Street, Colombo 01',
    district: 'Colombo',
    phone: '011-2421451',
    location: { lat: 6.9271, lng: 79.8612 },
    operatingHours: '24/7',
    isActive: true,
  },
  {
    name: 'Kandy Tourist Police Unit',
    type: 'tourist_police',
    address: 'Palace Square, Kandy',
    district: 'Kandy',
    phone: '081-2222222',
    location: { lat: 7.2906, lng: 80.6337 },
    operatingHours: '24/7',
    isActive: true,
  },
  {
    name: 'Galle Tourist Police Unit',
    type: 'tourist_police',
    address: 'Galle Fort, Galle',
    district: 'Galle',
    phone: '091-2234796',
    location: { lat: 6.0328, lng: 80.2168 },
    operatingHours: '24/7',
    isActive: true,
  },
  {
    name: 'Negombo Tourist Police Unit',
    type: 'tourist_police',
    address: 'Lewis Place, Negombo',
    district: 'Gampaha',
    phone: '031-2222222',
    location: { lat: 7.2094, lng: 79.8358 },
    operatingHours: '24/7',
    isActive: true,
  },
  {
    name: 'Nuwara Eliya Tourist Police Unit',
    type: 'tourist_police',
    address: 'Badulla Road, Nuwara Eliya',
    district: 'Nuwara Eliya',
    phone: '052-2222222',
    location: { lat: 6.9497, lng: 80.7891 },
    operatingHours: '24/7',
    isActive: true,
  },
  {
    name: 'Bentota Tourist Police Unit',
    type: 'tourist_police',
    address: 'Galle Road, Bentota',
    district: 'Galle',
    phone: '034-2275022',
    location: { lat: 6.4213, lng: 80.0028 },
    operatingHours: '24/7',
    isActive: true,
  },
  {
    name: 'Hikkaduwa Tourist Police Unit',
    type: 'tourist_police',
    address: 'Galle Road, Hikkaduwa',
    district: 'Galle',
    phone: '091-2277222',
    location: { lat: 6.1395, lng: 80.1037 },
    operatingHours: '24/7',
    isActive: true,
  },
  {
    name: 'Anuradhapura Tourist Police Unit',
    type: 'tourist_police',
    address: 'Sacred City Area, Anuradhapura',
    district: 'Anuradhapura',
    phone: '025-2222222',
    location: { lat: 8.3114, lng: 80.4037 },
    operatingHours: '24/7',
    isActive: true,
  },
  {
    name: 'Sigiriya Tourist Police Unit',
    type: 'tourist_police',
    address: 'Sigiriya Junction, Sigiriya',
    district: 'Matale',
    phone: '066-2286700',
    location: { lat: 7.9570, lng: 80.7603 },
    operatingHours: '24/7',
    isActive: true,
  },
  {
    name: 'Ella Tourist Police Unit',
    type: 'tourist_police',
    address: 'Main Street, Ella',
    district: 'Badulla',
    phone: '057-2222222',
    location: { lat: 6.8667, lng: 81.0466 },
    operatingHours: '24/7',
    isActive: true,
  },
  {
    name: 'Trincomalee Tourist Police Unit',
    type: 'tourist_police',
    address: 'Fort Frederick Road, Trincomalee',
    district: 'Trincomalee',
    phone: '026-2222222',
    location: { lat: 8.5874, lng: 81.2152 },
    operatingHours: '24/7',
    isActive: true,
  },
  {
    name: 'Mirissa Tourist Police Unit',
    type: 'tourist_police',
    address: 'Beach Road, Mirissa',
    district: 'Matara',
    phone: '041-2222222',
    location: { lat: 5.9484, lng: 80.4586 },
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
