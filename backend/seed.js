import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Driver from './src/models/driver.js';
import Guide from './src/models/guide.js';

dotenv.config();

const dummyDrivers = [
  {
    driverName: 'Amila Perera',
    title: '12+ Years Experience',
    price: '8500',
    priceUnit: 'day',
    rating: 4.9,
    isVerified: true,
    isOnline: true,
    tags: ['English', 'SUV Expert', 'Kandy Local'],
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300',
    vehicleName: 'Toyota KDH',
    vehicleNumber: 'WP-1234',
    vehicleColor: 'White',
    nationalIdNumber: '921234567V',
    contactNumber: '0771234567',
    availability: true
  },
  {
    driverName: 'Sarah Wickramage',
    title: 'Safe Tour Driver',
    price: '6200',
    priceUnit: 'trip',
    rating: 5.0,
    badge: 'Gold Badge',
    tags: ['German', 'Safe Driver'],
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    vehicleName: 'Honda Fit',
    vehicleNumber: 'CBE-4567',
    vehicleColor: 'Silver',
    nationalIdNumber: '905678123V',
    contactNumber: '0714567890',
    availability: true
  }
];

const dummyGuides = [
  {
    name: 'Kasun Jayawardena',
    title: 'National Tourist Guide (10+ Yrs)',
    price: '9500',
    priceUnit: 'day',
    rating: 4.9,
    isVerified: true,
    isOnline: true,
    badge: 'Elite Guide',
    languages: ['English', 'Japanese'],
    specialties: ['Cultural Triangle', 'Hiking', 'Wildlife'],
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    contactNumber: '0779876543',
    availability: true
  },
  {
    name: 'Elena Rostova',
    title: 'Chauffeur Guide & History Expert',
    price: '7800',
    priceUnit: 'day',
    rating: 5.0,
    badge: 'Gold Badge',
    languages: ['English', 'Russian'],
    specialties: ['Galle Fort', 'Archaeology', 'Art'],
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    contactNumber: '0754321098',
    availability: true
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB Connected');

    await Driver.deleteMany({});
    await Guide.deleteMany({});

    await Driver.insertMany(dummyDrivers);
    await Guide.insertMany(dummyGuides);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDB();
