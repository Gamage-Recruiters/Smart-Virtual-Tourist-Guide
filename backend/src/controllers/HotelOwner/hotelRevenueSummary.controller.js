import getTestDb from '../../configs/HotelOwner/testDb.js';
import revenueSummarySchema from '../../models/HotelOwner/hotelRevenueSummar.js';
import { syncRevenueSummaries } from '../../services/HotelOwner/revenueSummarySync.js';

const getModel = async () => {
  const conn = await getTestDb();
  return conn.models.hotelRevenueSummary
    || conn.model('hotelRevenueSummary', revenueSummarySchema.schema);
};

const getSummaries = async (hotelId) => {
  const RevenueSummary = await getModel();
  return RevenueSummary.find({ hotelId }).sort({ month: 1 }).lean();
};

export const getRevenueSummariesByHotel = async (req, res) => {
  try {
    const summaries = await getSummaries(req.params.hotelId);
    return res.status(200).json({ message: 'Revenue summaries fetched', summaries });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const syncRevenueSummariesForHotel = async (req, res) => {
  try {
    await syncRevenueSummaries();
    const summaries = await getSummaries(req.params.hotelId);
    return res.status(200).json({ message: 'Revenue summaries synchronized', summaries });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
