import express from 'express';
const router = express.Router();

import { 
  addGuide,
  getAllGuides,
  getGuideById,
  updateGuide 
} from '../controllers/guideController.js';

router.post("/", addGuide);
router.get("/", getAllGuides);
router.get("/:id", getGuideById);
router.put("/:id", updateGuide);

export default router;
