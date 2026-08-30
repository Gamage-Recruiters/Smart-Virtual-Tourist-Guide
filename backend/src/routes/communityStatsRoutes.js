import express from 'express';
import {
  getDashboardStats,
  getSmeStats,
  getRegionalImpactStats,
  getEmploymentImpactStats,
  getTouristFeedbackStats,
  getSupportRequestStats,
  seedCommunityData
} from '../controllers/communityStatsController.js';

const router = express.Router();

router.get('/dashboard', getDashboardStats);
router.get('/sme', getSmeStats);
router.get('/regional', getRegionalImpactStats);
router.get('/employment', getEmploymentImpactStats);
router.get('/feedback', getTouristFeedbackStats);
router.get('/support', getSupportRequestStats);
router.post('/seed', seedCommunityData);

export default router;
