import express from 'express';
import {
  getOverviewStats,
  getCategoryDistribution,
  getSentimentDistribution,
  getNewsActivityTimeline,
} from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/overview', getOverviewStats);
router.get('/categories', getCategoryDistribution);
router.get('/sentiment', getSentimentDistribution);
router.get('/activity', getNewsActivityTimeline);

export default router;
