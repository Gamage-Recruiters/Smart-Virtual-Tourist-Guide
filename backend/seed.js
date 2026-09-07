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
    district: 'Colombo',
    region: 'Western Province',
    location: { type: 'Point', coordinates: [79.8612, 6.9271] },
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
    district: 'Kandy',
    region: 'Central Province',
    location: { type: 'Point', coordinates: [80.6350, 7.2906] },
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
    district: 'Galle',
    region: 'Southern Province',
    location: { type: 'Point', coordinates: [80.2170, 6.0535] },
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
    district: 'Pettah',
    region: 'Colombo',
    location: { type: 'Point', coordinates: [79.8506, 6.9355] },
  },
  {
    source: 'police-report',
    title: 'Pickpocket warning',
    description: 'Tourist area — pickpocket incidents reported near the bus stand.',
    isActive: true,
    category: 'crime',
    district: 'Fort',
    region: 'Colombo',
    location: { type: 'Point', coordinates: [79.8428, 6.9344] },
  },
  {
    source: 'police-report',
    title: 'Scam alert',
    description: 'Fake tour guide scams reported in this area. Use verified guides only.',
    isActive: true,
    category: 'crime',
    district: 'Kandy City Centre',
    region: 'Kandy',
    location: { type: 'Point', coordinates: [80.6337, 7.2906] },
  },
  {
    source: 'police-report',
    title: 'Robbery reports',
    description: 'Multiple bag snatching incidents after dark. Stay vigilant.',
    isActive: true,
    category: 'crime',
    district: 'Dehiwala',
    region: 'Colombo',
    location: { type: 'Point', coordinates: [79.8650, 6.8510] },
  },
  {
    source: 'police-report',
    title: 'Vehicle break-ins',
    description: 'Vehicle break-ins reported near beach parking areas. Do not leave valuables.',
    isActive: true,
    category: 'crime',
    district: 'Unawatuna',
    region: 'Galle',
    location: { type: 'Point', coordinates: [80.2490, 6.0174] },
  },
  {
    source: 'police-report',
    title: 'Nighttime safety concern',
    description: 'Poorly lit area with past assault reports. Avoid walking alone at night.',
    isActive: true,
    category: 'crime',
    district: 'Slave Island',
    region: 'Colombo',
    location: { type: 'Point', coordinates: [79.8558, 6.9247] },
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB_NAME || 'test' });
    console.log('Connected to MongoDB');

    await SecurityAlert.deleteMany({ category: 'weather' });
    console.log('Cleared existing weather alerts');

    const inserted = await SecurityAlert.insertMany(sampleAlerts);
    console.log(`Inserted ${inserted.length} weather alerts:`);
    inserted.forEach(a => console.log(` - ${a.district}: ${a.temperature}°C, ${a.weatherCondition}`));

    await SecurityAlert.deleteMany({ category: 'crime' });
    console.log('Cleared existing crime alerts');

    const crimeInserted = await SecurityAlert.insertMany(crimeAlerts);
    console.log(`Inserted ${crimeInserted.length} crime alerts:`);
    crimeInserted.forEach(a => console.log(` - ${a.district}: ${a.title}`));

    await mongoose.disconnect();
    console.log('Done.');
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seed();
