import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import EmergencyContact from '../models/EmergencyContact.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const contacts = [
  { service: 'Police', number: '119', icon: '🚔', color: '#1565C0', priority: 1 },
  { service: 'Ambulance', number: '110', icon: '🚑', color: '#E53935', priority: 2 },
  { service: 'Fire & Rescue', number: '111', icon: '🚒', color: '#EF6C00', priority: 3 },
  { service: 'Tourist Police', number: '1912', icon: '🛡️', color: '#00897B', priority: 4 },
  { service: 'Accident Service', number: '011-2691111', icon: '🏥', color: '#7B1FA2', priority: 5 },
  { service: 'Government Info', number: '1919', icon: 'ℹ️', color: '#0277BD', priority: 6 },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding emergency contacts');
    
    await EmergencyContact.deleteMany({});
    const result = await EmergencyContact.insertMany(contacts);
    console.log(`✅ Seeded ${result.length} emergency contacts`);
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding emergency contacts:', error);
    process.exit(1);
  }
}

seed();
