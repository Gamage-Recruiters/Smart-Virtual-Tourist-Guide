import SmeParticipation from '../models/SmeParticipation.js';
import RegionalImpact from '../models/RegionalImpact.js';
import EmploymentImpact from '../models/EmploymentImpact.js';
import TouristFeedback from '../models/TouristFeedback.js';
import SupportRequest from '../models/SupportRequest.js';
import CommunityDashboardStat from '../models/CommunityDashboardStat.js';

export const getDashboardStats = async (req, res) => {
  try {
    const stats = await CommunityDashboardStat.findOne();
    res.status(200).json(stats || {});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};

export const getSmeStats = async (req, res) => {
  try {
    const stats = await SmeParticipation.find();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching SME stats', error: error.message });
  }
};

export const getRegionalImpactStats = async (req, res) => {
  try {
    const stats = await RegionalImpact.find();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching regional impact stats', error: error.message });
  }
};

export const getEmploymentImpactStats = async (req, res) => {
  try {
    const stats = await EmploymentImpact.find();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employment impact stats', error: error.message });
  }
};

export const getTouristFeedbackStats = async (req, res) => {
  try {
    const stats = await TouristFeedback.find();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tourist feedback stats', error: error.message });
  }
};

export const getSupportRequestStats = async (req, res) => {
  try {
    const stats = await SupportRequest.find();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching support request stats', error: error.message });
  }
};

export const seedCommunityData = async (req, res) => {
  try {
    await CommunityDashboardStat.deleteMany({});
    await CommunityDashboardStat.create({
      totalSme: 1240,
      activeUsers: 880,
      economicImpact: {
        tourismRevenuePercent: 50,
        localBusinessProfitPercent: 35,
        jobCreationPercent: 15,
      },
      feedback: {
        fullySatisfiedPercent: 60,
        acceptedPercent: 25,
        negativePercent: 15,
      }
    });

    await SmeParticipation.deleteMany({});
    await SmeParticipation.insertMany([
      { category: 'Guided Tours / Safari & Excursions', registered: 120, active: 110, inactive: 10 },
      { category: 'Traditional / Local Art & Craft', registered: 245, active: 220, inactive: 25 },
      { category: 'Locally Made / Home Grown Products', registered: 485, active: 435, inactive: 50 },
      { category: 'Regional Local Food & Tourism Activities', registered: 120, active: 110, inactive: 10 },
      { category: 'Ayurvedic, Herbal Care & Therapies', registered: 355, active: 305, inactive: 50 },
      { category: 'Eco-friendly & Re-cycled Products', registered: 245, active: 220, inactive: 25 },
      { category: 'Heritage & Cultural practices', registered: 120, active: 110, inactive: 10 },
      { category: 'Adventure / Outdoor Activities', registered: 355, active: 305, inactive: 50 },
      { category: 'Local Clothing & Non-Agro based SMEs', registered: 245, active: 220, inactive: 25 },
      { category: 'Events (Music, Dance, & other Arts / culture)', registered: 485, active: 435, inactive: 50 },
    ]);

    await RegionalImpact.deleteMany({});
    await RegionalImpact.insertMany([
      { region: 'Western', smeCount: 4500, revenueLKR: '450 Million', growthRate: '12%', topSectors: 'Hotels & Resorts' },
      { region: 'Southern', smeCount: 3200, revenueLKR: '320 Million', growthRate: '15%', topSectors: 'Local Tourism' },
      { region: 'Central', smeCount: 2800, revenueLKR: '280 Million', growthRate: '10%', topSectors: 'Cultural Tourism' },
      { region: 'Northern', smeCount: 1500, revenueLKR: '150 Million', growthRate: '18%', topSectors: 'Local Cuisine' },
      { region: 'Eastern', smeCount: 1800, revenueLKR: '180 Million', growthRate: '14%', topSectors: 'Water Sports' },
      { region: 'North Western', smeCount: 2200, revenueLKR: '220 Million', growthRate: '9%', topSectors: 'Eco Tourism' },
      { region: 'North Central', smeCount: 1900, revenueLKR: '190 Million', growthRate: '11%', topSectors: 'Heritage Sites' },
      { region: 'Uva', smeCount: 1600, revenueLKR: '160 Million', growthRate: '13%', topSectors: 'Nature Trails' },
      { region: 'Sabaragamuwa', smeCount: 1700, revenueLKR: '170 Million', growthRate: '10%', topSectors: 'Adventure Tourism' },
    ]);

    await EmploymentImpact.deleteMany({});
    await EmploymentImpact.insertMany([
      { sector: 'Tour Guide', fullTime: 1245, partTime: 4500, selfEmployed: 320, total: 6065, malePercent: '80%', femalePercent: '20%' },
      { sector: 'Transport', fullTime: 4500, partTime: 1200, selfEmployed: 450, total: 6150, malePercent: '95%', femalePercent: '5%' },
      { sector: 'Accommodation', fullTime: 8500, partTime: 3200, selfEmployed: 1200, total: 12900, malePercent: '45%', femalePercent: '55%' },
      { sector: 'Restaurants & Food', fullTime: 7200, partTime: 4100, selfEmployed: 850, total: 12150, malePercent: '50%', femalePercent: '50%' },
      { sector: 'Retail (Souvenirs)', fullTime: 3500, partTime: 1800, selfEmployed: 900, total: 6200, malePercent: '40%', femalePercent: '60%' },
      { sector: 'Attraction Sites', fullTime: 2100, partTime: 800, selfEmployed: 150, total: 3050, malePercent: '60%', femalePercent: '40%' },
      { sector: 'Travel Agencies', fullTime: 1800, partTime: 400, selfEmployed: 200, total: 2400, malePercent: '55%', femalePercent: '45%' },
      { sector: 'Event Management', fullTime: 1500, partTime: 1200, selfEmployed: 350, total: 3050, malePercent: '48%', femalePercent: '52%' },
    ]);

    await TouristFeedback.deleteMany({});
    await TouristFeedback.insertMany([
      { service: 'Hotels', rating: 4.5, positive: '85%', negative: '15%' },
      { service: 'Tourist Guide', rating: 4.8, positive: '92%', negative: '8%' },
      { service: 'Transport', rating: 4.2, positive: '78%', negative: '22%' },
      { service: 'SME', rating: 4.6, positive: '88%', negative: '12%' },
      { service: 'Restaurants', rating: 4.3, positive: '80%', negative: '20%' },
      { service: 'Travel Agencies', rating: 4.4, positive: '82%', negative: '18%' },
      { service: 'Attraction Sites', rating: 4.7, positive: '90%', negative: '10%' },
      { service: 'Medical Care', rating: 4.5, positive: '85%', negative: '15%' },
      { service: 'Local Markets', rating: 4.1, positive: '75%', negative: '25%' },
      { service: 'Street Food', rating: 4.6, positive: '87%', negative: '13%' },
    ]);

    await SupportRequest.deleteMany({});
    await SupportRequest.insertMany([
      { type: 'Medical Support', requests: 450, region: 'Colombo', priority: 'High', status: 'Pending' },
      { type: 'Missing person', requests: 120, region: 'Kandy', priority: 'High', status: 'Resolved' },
      { type: 'Theft / Robbery case', requests: 250, region: 'Galle', priority: 'High', status: 'Resolving' },
      { type: 'Information Desk (Lost)', requests: 750, region: 'Matara', priority: 'Low', status: 'Ongoing' },
      { type: 'Transport issues', requests: 340, region: 'Jaffna', priority: 'Medium', status: 'Ongoing' },
      { type: 'Harassment', requests: 110, region: 'Nuwara Eliya', priority: 'High', status: 'Resolved' },
      { type: 'Website / App errors', requests: 880, region: 'Island-wide', priority: 'Medium', status: 'Resolved' },
      { type: 'Accident / Rescue', requests: 180, region: 'Anuradhapura', priority: 'High', status: 'Ongoing' },
      { type: 'Fraud / Scams', requests: 290, region: 'Trincomalee', priority: 'Medium', status: 'Ongoing' },
      { type: 'Emergency / Natural', requests: 150, region: 'Badulla', priority: 'High', status: 'Resolved' },
    ]);

    res.status(200).json({ message: 'Community data seeded successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error seeding data', error: error.message });
  }
};
