const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Listing = require('./src/models/Listing'); // Adjust path if needed

// DNS fix to resolve specific network issues with MongoDB Atlas
const dns = require('dns').promises;
dns.setServers(['1.1.1.1']);

// Load environment variables to get MONGODB_URI
dotenv.config();

const mockListings = [
    {
        title: "Sigiriya Rock Fortress Tour",
        providerName: "Lanka Guides",
        type: "Activity",
        description: "Experience the ancient wonder of Sigiriya with a professional guide. Includes water and entrance tickets.",
        location: "Sigiriya, Sri Lanka",
        price: "$50",
        rating: "4.8",
        verificationScore: "100% Verified",
        tags: ["Historical", "Adventure"],
        since: "2020",
        status: "Pending",
        imageUrl: "https://images.unsplash.com/photo-1588614959060-4d144f28b207?w=800&q=80"
    },
    {
        title: "Ella Train Journey & Hike",
        providerName: "Ella Explorers",
        type: "Package",
        description: "A breathtaking train ride followed by a hike to Little Adam's Peak and Nine Arches Bridge.",
        location: "Ella, Sri Lanka",
        price: "$35",
        rating: "4.9",
        verificationScore: "95% Verified",
        tags: ["Nature", "Hiking"],
        since: "2021",
        status: "Approved",
        imageUrl: "https://images.unsplash.com/photo-1546708973-c40336ae9b84?w=800&q=80"
    },
    {
        title: "Colombo City Tuk-Tuk Tour",
        providerName: "City Wheels",
        type: "Transport",
        description: "Explore the bustling streets of Colombo in a traditional Tuk-Tuk. Visit temples, markets, and the beach.",
        location: "Colombo, Sri Lanka",
        price: "$20",
        rating: "4.0",
        verificationScore: "60% Verified",
        tags: ["City", "Transport"],
        since: "2023",
        status: "Rejected",
        rejectionReason: "Incomplete vehicle insurance documents.",
        imageUrl: "https://images.unsplash.com/photo-1620025736465-9eb9b41dc2f3?w=800&q=80"
    }
];

const seedDatabase = async () => {
    try {
        // Connect to the database
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB for seeding...");

        // Clear existing mock data to avoid duplicates
        await Listing.deleteMany({}); 
        console.log("Old data cleared.");

        // Insert new mock data
        await Listing.insertMany(mockListings);
        console.log("Mock data successfully inserted into the database!");

        // Exit the script
        process.exit();
    } catch (error) {
        console.error("Error seeding the database:", error);
        process.exit(1);
    }
};

seedDatabase();