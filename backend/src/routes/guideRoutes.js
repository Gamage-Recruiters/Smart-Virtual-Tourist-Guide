import express from 'express';
import { getGuides } from '../controllers/providerPublicController.js';

const router = express.Router();

router.get('/', getGuides);

export default router;
