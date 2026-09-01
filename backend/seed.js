import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import SecurityAlert from './src/models/SecurityAlert.js';

const sampleAlerts = [
  {
    source: 'database',
    category: 'weather',
    title: 'Weather Alert',
    description: 'Warm and humid conditions. Stay hydrated.',
    isActive: true,
    location: 'Colombo',
    temperature: 31,
    feelsLike: 35,
    weatherCondition: 'Partly Cloudy',
    humidity: 78,
    windSpeed: 5,
    windDirection: 210,
    pressure: 1010,
    visibility: 8000,
  },
  {
    source: 'database',
    category: 'weather',
    title: 'Weather Alert',
    description: 'Clear skies with mild breeze.',
    isActive: true,
    location: 'Kandy',
    temperature: 26,
    feelsLike: 28,
    weatherCondition: 'Clear',
    humidity: 65,
    windSpeed: 3,
    windDirection: 180,
    pressure: 1012,
    visibility: 10000,
  },
  {
    source: 'database',
    category: 'weather',
    title: 'Weather Alert',
    description: 'Heavy rain expected. Risk of flooding on low-lying roads.',
    isActive: true,
    location: 'Galle',
    temperature: 28,
    feelsLike: 32,
    weatherCondition: 'Heavy Rain',
    humidity: 90,
    windSpeed: 12,
    windDirection: 225,
    pressure: 1005,
    visibility: 3000,
  },
];

const crimeAlerts = [
  {
    source: 'police-report',
    title: 'High crime zone',
    description: 'Multiple theft incidents reported. Avoid isolated streets after 8pm.',
    isActive: true,
    category: 'crime',
    location: 'Pettah, Colombo',
    latitude: 6.9355,
    longitude: 79.8506,
  },
  {
    source: 'police-report',
    title: 'Pickpocket warning',
    description: 'Tourist area — pickpocket incidents reported near the bus stand.',
    isActive: true,
    category: 'crime',
    location: 'Fort, Colombo',
    latitude: 6.9344,
    longitude: 79.8428,
  },
  {
    source: 'police-report',
    title: 'Scam alert',
    description: 'Fake tour guide scams reported in this area. Use verified guides only.',
    isActive: true,
    category: 'crime',
    location: 'Kandy City Centre',
    latitude: 7.2906,
    longitude: 80.6337,
  },
  {
    source: 'police-report',
    title: 'Robbery reports',
    description: 'Multiple bag snatching incidents after dark. Stay vigilant.',
    isActive: true,
    category: 'crime',
    location: 'Dehiwala',
    latitude: 6.8510,
    longitude: 79.8650,
  },
  {
    source: 'police-report',
    title: 'Vehicle break-ins',
    description: 'Vehicle break-ins reported near beach parking areas. Do not leave valuables.',
    isActive: true,
    category: 'crime',
    location: 'Unawatuna, Galle',
    latitude: 6.0174,
    longitude: 80.2490,
  },
  {
    source: 'police-report',
    title: 'Nighttime safety concern',
    description: 'Poorly lit area with past assault reports. Avoid walking alone at night.',
    isActive: true,
    category: 'crime',
    location: 'Slave Island, Colombo',
    latitude: 6.9247,
    longitude: 79.8558,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB_NAME || 'tourismGuideDB' });
    console.log('Connected to MongoDB');

    await SecurityAlert.deleteMany({ category: 'weather' });
    console.log('Cleared existing weather alerts');

    const inserted = await SecurityAlert.insertMany(sampleAlerts);
    console.log(`Inserted ${inserted.length} weather alerts:`);
    inserted.forEach(a => console.log(` - ${a.location}: ${a.temperature}°C, ${a.weatherCondition}`));

    await SecurityAlert.deleteMany({ category: 'crime' });
    console.log('Cleared existing crime alerts');

    const crimeInserted = await SecurityAlert.insertMany(crimeAlerts);
    console.log(`Inserted ${crimeInserted.length} crime alerts:`);
    crimeInserted.forEach(a => console.log(` - ${a.location}: ${a.title}`));

    await mongoose.disconnect();
    console.log('Done.');
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seed();
