import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import TouristArea from '../models/TouristArea.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const areas = [
  { area: 'Colombo Region', lat: 6.9271, lng: 79.8612, covers: 'Colombo, Mount Lavinia, Dehiwala' },
  { area: 'Negombo Region', lat: 7.2081, lng: 79.8358, covers: 'Negombo, Katunayake' },
  { area: 'Bentota Region', lat: 6.4200, lng: 79.9928, covers: 'Bentota, Beruwala, Induruwa' },
  { area: 'Kalpitiya Region', lat: 8.2325, lng: 79.7617, covers: 'Lagoon, Bar Reef, Dolphin Area' },
  { area: 'Sigiriya Region', lat: 7.9570, lng: 80.7603, covers: 'Sigiriya, Pidurangala, Habarana' },
  { area: 'Anuradhapura Region', lat: 8.3114, lng: 80.4037, covers: 'Mihintale, Wilpattu Entrance' },
  { area: 'Polonnaruwa Region', lat: 7.9403, lng: 81.0188, covers: 'Ancient City' },
  { area: 'Kandy Region', lat: 7.2906, lng: 80.6337, covers: 'Temple of the Tooth, Peradeniya, Gampola' },
  { area: 'Nuwara Eliya Region', lat: 6.9497, lng: 80.7891, covers: 'Gregory Lake, Hakgala' },
  { area: 'Ella Region', lat: 6.8667, lng: 81.0466, covers: 'Nine Arches, Little Adams Peak, Ravana Falls' },
  { area: 'Haputale Region', lat: 6.7681, lng: 80.9593, covers: 'Liptons Seat, Diyaluma Falls' },
  { area: 'Ratnapura Region', lat: 6.6828, lng: 80.3992, covers: 'Adams Peak, Sinharaja Entrance' },
  { area: 'Galle Region', lat: 6.0328, lng: 80.2168, covers: 'Fort, Unawatuna, Jungle Beach' },
  { area: 'Mirissa Region', lat: 5.9483, lng: 80.4616, covers: 'Weligama, Coconut Tree Hill' },
  { area: 'Tangalle Region', lat: 6.0242, lng: 80.7963, covers: 'Dickwella, Hummanaya' },
  { area: 'Yala Region', lat: 6.3698, lng: 81.5046, covers: 'Yala National Park' },
  { area: 'Trincomalee Region', lat: 8.5874, lng: 81.2152, covers: 'Nilaveli, Marble Beach, Pigeon Island' },
  { area: 'Pasikudah Region', lat: 7.9255, lng: 81.5620, covers: 'Kalkudah' },
  { area: 'Arugam Bay Region', lat: 6.8402, lng: 81.8242, covers: 'Panama, Whiskey Point' },
  { area: 'Jaffna Region', lat: 9.6615, lng: 80.0255, covers: 'Delft, Nagadeepa, Casuarina' },
  { area: 'Mannar Region', lat: 8.9806, lng: 79.9042, covers: 'Mannar Island' },
  { area: 'Batticaloa Region', lat: 7.7170, lng: 81.6998, covers: 'Lagoon, Beaches' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding tourist areas');
    
    await TouristArea.deleteMany({});
    const result = await TouristArea.insertMany(areas);
    console.log(`✅ Seeded ${result.length} tourist areas`);
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding tourist areas:', error);
    process.exit(1);
  }
}

seed();
