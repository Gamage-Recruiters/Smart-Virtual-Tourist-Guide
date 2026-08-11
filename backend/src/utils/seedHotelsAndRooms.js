import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Room from '../models/Room.js';
import { connectDB } from '../configs/database.js';

dotenv.config({ path: 'backend/.env' });

const seedData = async () => {
    try {
        await connectDB();
        console.log('Connected to DB for seeding...');

        const existingRoomsCount = await Room.countDocuments();
        if (existingRoomsCount > 0) {
            console.log(`Rooms already exist in DB (${existingRoomsCount} rooms found). Skipping seed.`);
            process.exit(0);
        }

        console.log('Seeding Hotel Owners and Rooms...');

        // 1. Create or find Hotel Owner 1
        let owner1 = await User.findOne({ email: 'info@oceanbreeze.lk' });
        if (!owner1) {
            owner1 = await User.create({
                fullName: 'Ocean Breeze Management',
                email: 'info@oceanbreeze.lk',
                role: 'hotelowner_user',
                contactNumber: '+94 34 227 5000',
                hotels: [
                    {
                        hotelName: 'Ocean Breeze Resort',
                        hotelRegistrationNo: 'HTL-2023-0891',
                        hotelEmail: 'info@oceanbreeze.lk',
                        hotelRegisteredYear: '2020',
                        hotelContactNumber: '+94 34 227 5000',
                        hotelAddress: 'Bentota, Southern Province, Sri Lanka'
                    }
                ]
            });
        }

        // 2. Create or find Hotel Owner 2
        let owner2 = await User.findOne({ email: 'reservations@grandheritage.lk' });
        if (!owner2) {
            owner2 = await User.create({
                fullName: 'Grand Heritage Hotels Group',
                email: 'reservations@grandheritage.lk',
                role: 'hotelowner_user',
                contactNumber: '+94 81 223 4455',
                hotels: [
                    {
                        hotelName: 'Grand Heritage Hotel Kandy',
                        hotelRegistrationNo: 'HTL-2021-0412',
                        hotelEmail: 'reservations@grandheritage.lk',
                        hotelRegisteredYear: '2018',
                        hotelContactNumber: '+94 81 223 4455',
                        hotelAddress: 'Rajapihilla Mawatha, Kandy, Sri Lanka'
                    }
                ]
            });
        }

        // 3. Create Rooms for Owner 1 (Ocean Breeze Resort)
        const roomsOwner1 = [
            {
                hotelId: owner1._id,
                roomNumber: '101',
                roomName: 'Ocean View Suite',
                roomType: 'King Room',
                roomSize: 50,
                measureType: 'sqm',
                capacity: { adults: 2, children: 1 },
                amenities: ['wifi', 'pool', 'ac', 'coffee', 'balcony', 'minibar'],
                description: 'Panoramic ocean views with private balcony, king-sized bed, marble bath, and luxury amenities.',
                images: [
                    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=600',
                    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600'
                ],
                contactInfo: {
                    contactName: 'Front Desk',
                    contactNumber: '+94 34 227 5000',
                    email: 'info@oceanbreeze.lk'
                },
                locationAndPricing: [
                    {
                        aboutLocation: 'Beachfront Tower, 3rd Floor',
                        basePrice: 35000,
                        paymentMethods: ['Card Payment', 'Cash Payment(Pay at Hotel)']
                    }
                ],
                roomStatus: 'Available'
            },
            {
                hotelId: owner1._id,
                roomNumber: '102',
                roomName: 'Deluxe Garden Room',
                roomType: 'Deluxe Double Room',
                roomSize: 35,
                measureType: 'sqm',
                capacity: { adults: 2, children: 0 },
                amenities: ['wifi', 'ac', 'coffee'],
                description: 'Tranquil garden view room featuring twin or queen bed setup, private patio, and contemporary minimalist design.',
                images: [
                    'https://images.unsplash.com/photo-1598928506311-c55dd1b67272?auto=format&fit=crop&q=80&w=600',
                    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=600'
                ],
                contactInfo: {
                    contactName: 'Front Desk',
                    contactNumber: '+94 34 227 5000',
                    email: 'info@oceanbreeze.lk'
                },
                locationAndPricing: [
                    {
                        aboutLocation: 'Garden Wing, Ground Floor',
                        basePrice: 22000,
                        paymentMethods: ['Card Payment', 'Cash Payment(Pay at Hotel)']
                    }
                ],
                roomStatus: 'Available'
            }
        ];

        // 4. Create Rooms for Owner 2 (Grand Heritage Hotel Kandy)
        const roomsOwner2 = [
            {
                hotelId: owner2._id,
                roomNumber: '201',
                roomName: 'Royal Heritage Villa',
                roomType: 'Family Room / Quad Room',
                roomSize: 75,
                measureType: 'sqm',
                capacity: { adults: 4, children: 2 },
                amenities: ['wifi', 'pool', 'ac', 'coffee', 'parking'],
                description: 'Spacious colonial-style villa overlooking Lake Kandy, complete with plunge pool and private butler service.',
                images: [
                    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=600',
                    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=600'
                ],
                contactInfo: {
                    contactName: 'Reservations Desk',
                    contactNumber: '+94 81 223 4455',
                    email: 'reservations@grandheritage.lk'
                },
                locationAndPricing: [
                    {
                        aboutLocation: 'Hillside Sanctuary',
                        basePrice: 55000,
                        paymentMethods: ['Card Payment', 'Online Payment', 'Cash Payment(Pay at Hotel)']
                    }
                ],
                roomStatus: 'Available'
            },
            {
                hotelId: owner2._id,
                roomNumber: '202',
                roomName: 'Superior Twin Room',
                roomType: 'Twin Room',
                roomSize: 40,
                measureType: 'sqm',
                capacity: { adults: 2, children: 1 },
                amenities: ['wifi', 'ac', 'coffee', 'parking'],
                description: 'Elegantly furnished twin bed room with mountain mist views and complimentary traditional Sri Lankan breakfast.',
                images: [
                    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=600'
                ],
                contactInfo: {
                    contactName: 'Reservations Desk',
                    contactNumber: '+94 81 223 4455',
                    email: 'reservations@grandheritage.lk'
                },
                locationAndPricing: [
                    {
                        aboutLocation: 'Heritage Main Building',
                        basePrice: 28000,
                        paymentMethods: ['Card Payment', 'Cash Payment(Pay at Hotel)']
                    }
                ],
                roomStatus: 'Available'
            }
        ];

        await Room.insertMany([...roomsOwner1, ...roomsOwner2]);
        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    }
};

seedData();
