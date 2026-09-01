/**
 * Seed data for Sri Lanka Tourist Police Stations & Fallback Hospitals/Police
 *
 * Run this seed with: node src/seeds/emergencyLocations.js
 * It will connect to the DB and insert all locations.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM __dirname replacement
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import EmergencyLocation from '../models/EmergencyLocation.js';

// Original Tourist Police Stations
const touristPoliceStations = [
  { name: 'Tourist Police Station Colombo', type: 'tourist_police', address: 'Galle Road, Colombo 03', district: 'Colombo', phone: '+94 11 242 1052', location: { lat: 6.9183463, lng: 79.8471811 }, operatingHours: '24/7', isActive: true },
  { name: 'Tourist Police Kandy', type: 'tourist_police', address: 'Kandy', district: 'Kandy', phone: '+94 81 383 7392', location: { lat: 7.2932149, lng: 80.6336302 }, operatingHours: '24/7', isActive: true },
  { name: 'Tourist Police Station Negombo', type: 'tourist_police', address: 'Negombo', district: 'Gampaha', phone: '+94 31 227 5555', location: { lat: 7.246012, lng: 79.8421251 }, operatingHours: '24/7', isActive: true },
  { name: 'Tourist Police Station Polonnaruwa', type: 'tourist_police', address: 'Polonnaruwa', district: 'Polonnaruwa', phone: '+94 27 222 3099', location: { lat: 7.9390145, lng: 81.0000455 }, operatingHours: '24/7', isActive: true },
  { name: 'Tourist Police Hikkaduwa', type: 'tourist_police', address: 'Hikkaduwa', district: 'Galle', phone: '+94 91 227 5545', location: { lat: 6.1246956, lng: 80.1097264 }, operatingHours: '24/7', isActive: true },
  { name: 'Tourist Police Unawatuna', type: 'tourist_police', address: 'Unawatuna', district: 'Galle', phone: '', location: { lat: 6.0100137, lng: 80.2423234 }, operatingHours: '24/7', isActive: true },
  { name: 'Moragalla Tourist Police Station', type: 'tourist_police', address: 'Moragalla, Aluthgama', district: 'Kalutara', phone: '+94 34 227 6049', location: { lat: 6.4481518, lng: 79.9885797 }, operatingHours: '24/7', isActive: true },
  { name: 'Tourist Police Unit Wellawaya', type: 'tourist_police', address: 'Wellawaya', district: 'Monaragala', phone: '', location: { lat: 6.7295596, lng: 81.1023302 }, operatingHours: '24/7', isActive: true },
  { name: 'Tourist Police Arugam Bay', type: 'tourist_police', address: 'Arugam Bay, Pottuvil', district: 'Ampara', phone: '+94 11 308 1044', location: { lat: 6.8411025, lng: 81.8329993 }, operatingHours: '24/7', isActive: true },
];

const districts = [
  { district: 'Colombo', lat: 6.9271, lng: 79.8612 },
  { district: 'Gampaha', lat: 7.0873, lng: 79.9996 },
  { district: 'Kalutara', lat: 6.5854, lng: 79.9607 },
  { district: 'Kandy', lat: 7.2906, lng: 80.6337 },
  { district: 'Matale', lat: 7.4675, lng: 80.6234 },
  { district: 'Nuwara Eliya', lat: 6.9497, lng: 80.7828 },
  { district: 'Galle', lat: 6.0535, lng: 80.2210 },
  { district: 'Matara', lat: 5.9549, lng: 80.5469 },
  { district: 'Hambantota', lat: 6.1248, lng: 81.1185 },
  { district: 'Jaffna', lat: 9.6615, lng: 80.0255 },
  { district: 'Kilinochchi', lat: 9.3803, lng: 80.3770 },
  { district: 'Mannar', lat: 8.9810, lng: 79.9044 },
  { district: 'Vavuniya', lat: 8.7542, lng: 80.4982 },
  { district: 'Mullaitivu', lat: 9.2671, lng: 80.8142 },
  { district: 'Batticaloa', lat: 7.7102, lng: 81.6924 },
  { district: 'Ampara', lat: 7.2840, lng: 81.6665 },
  { district: 'Trincomalee', lat: 8.5874, lng: 81.2152 },
  { district: 'Kurunegala', lat: 7.4818, lng: 80.3609 },
  { district: 'Puttalam', lat: 8.0330, lng: 79.8260 },
  { district: 'Anuradhapura', lat: 8.3114, lng: 80.4037 },
  { district: 'Polonnaruwa', lat: 7.9403, lng: 81.0188 },
  { district: 'Badulla', lat: 6.9934, lng: 81.0550 },
  { district: 'Monaragala', lat: 6.8728, lng: 81.3445 },
  { district: 'Ratnapura', lat: 6.6828, lng: 80.3992 },
  { district: 'Kegalle', lat: 7.2513, lng: 80.3464 },
];

const realHospitalsData = {
  'Colombo': { name: 'National Hospital of Sri Lanka', phone: '+94 11 269 1111' },
  'Gampaha': { name: 'District General Hospital Gampaha', phone: '+94 33 222 2261' },
  'Kalutara': { name: 'District General Hospital Kalutara', phone: '+94 34 222 2261' },
  'Kandy': { name: 'National Hospital Kandy', phone: '+94 81 223 3337' },
  'Matale': { name: 'District General Hospital Matale', phone: '+94 66 222 2261' },
  'Nuwara Eliya': { name: 'District General Hospital Nuwara Eliya', phone: '+94 52 222 2261' },
  'Galle': { name: 'Teaching Hospital Karapitiya', phone: '+94 91 223 2250' },
  'Matara': { name: 'District General Hospital Matara', phone: '+94 41 222 2261' },
  'Hambantota': { name: 'District General Hospital Hambantota', phone: '+94 47 222 2261' },
  'Jaffna': { name: 'Teaching Hospital Jaffna', phone: '+94 21 222 2261' },
  'Kilinochchi': { name: 'District General Hospital Kilinochchi', phone: '+94 21 228 5327' },
  'Mannar': { name: 'District General Hospital Mannar', phone: '+94 23 222 2261' },
  'Vavuniya': { name: 'District General Hospital Vavuniya', phone: '+94 24 222 2261' },
  'Mullaitivu': { name: 'District General Hospital Mullaitivu', phone: '+94 21 229 0261' },
  'Batticaloa': { name: 'Teaching Hospital Batticaloa', phone: '+94 65 222 2261' },
  'Ampara': { name: 'District General Hospital Ampara', phone: '+94 63 222 2261' },
  'Trincomalee': { name: 'District General Hospital Trincomalee', phone: '+94 26 222 2261' },
  'Kurunegala': { name: 'Teaching Hospital Kurunegala', phone: '+94 37 222 2261' },
  'Puttalam': { name: 'Base Hospital Puttalam', phone: '+94 32 226 5261' },
  'Anuradhapura': { name: 'Teaching Hospital Anuradhapura', phone: '+94 25 222 2261' },
  'Polonnaruwa': { name: 'District General Hospital Polonnaruwa', phone: '+94 27 222 2261' },
  'Badulla': { name: 'Provincial General Hospital Badulla', phone: '+94 55 222 2261' },
  'Monaragala': { name: 'District General Hospital Monaragala', phone: '+94 55 227 6261' },
  'Ratnapura': { name: 'Teaching Hospital Ratnapura', phone: '+94 45 222 2261' },
  'Kegalle': { name: 'District General Hospital Kegalle', phone: '+94 35 222 2261' }
};

const fallbackHospitals = districts.map(d => {
  const data = realHospitalsData[d.district] || { name: `${d.district} General Hospital`, phone: '' };
  return {
    name: data.name,
    type: 'hospital',
    address: `${d.district} City`,
    district: d.district,
    phone: data.phone,
    location: { lat: d.lat + 0.001, lng: d.lng + 0.001 },
    operatingHours: '24/7',
    isActive: true,
  };
});

const realPoliceData = {
  'Colombo': { phone: '+94 11 243 3342' },
  'Gampaha': { phone: '+94 33 222 2228' },
  'Kalutara': { phone: '+94 34 222 2228' },
  'Kandy': { phone: '+94 81 222 2228' },
  'Matale': { phone: '+94 66 222 2227' },
  'Nuwara Eliya': { phone: '+94 52 222 2222' },
  'Galle': { phone: '+94 91 223 2061' },
  'Matara': { phone: '+94 41 222 2228' },
  'Hambantota': { phone: '+94 47 222 2228' },
  'Jaffna': { phone: '+94 21 321 7444' },
  'Kilinochchi': { phone: '+94 21 228 5503' },
  'Mannar': { phone: '+94 23 222 2227' },
  'Vavuniya': { phone: '+94 24 222 2228' },
  'Mullaitivu': { phone: '+94 21 222 2228' },
  'Batticaloa': { phone: '+94 65 222 4412' },
  'Ampara': { phone: '+94 63 222 2227' },
  'Trincomalee': { phone: '+94 26 222 2228' },
  'Kurunegala': { phone: '+94 37 222 2228' },
  'Puttalam': { phone: '+94 32 222 2228' },
  'Anuradhapura': { phone: '+94 25 222 2228' },
  'Polonnaruwa': { phone: '+94 27 222 2228' },
  'Badulla': { phone: '+94 55 222 2228' },
  'Monaragala': { phone: '+94 55 222 2228' },
  'Ratnapura': { phone: '+94 45 222 2228' },
  'Kegalle': { phone: '+94 35 222 2228' }
};

const fallbackPolice = districts.map(d => {
  const data = realPoliceData[d.district] || { phone: '' };
  return {
    name: `${d.district} Headquarters Police Station`,
    type: 'local_police',
    address: `${d.district} City`,
    district: d.district,
    phone: data.phone,
    location: { lat: d.lat - 0.001, lng: d.lng - 0.001 },
    operatingHours: '24/7',
    isActive: true,
  };
});

const allLocationsToSeed = [...touristPoliceStations, ...fallbackHospitals, ...fallbackPolice];

const seedEmergencyLocations = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Remove existing records to avoid duplicates
    const deleteResult = await EmergencyLocation.deleteMany({
      type: { $in: ['tourist_police', 'hospital', 'local_police'] }
    });
    console.log(`🗑️  Removed ${deleteResult.deletedCount} existing records`);

    // Insert fresh data
    const inserted = await EmergencyLocation.insertMany(allLocationsToSeed);
    console.log(`✅ Seeded ${inserted.length} Emergency locations`);

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedEmergencyLocations();
