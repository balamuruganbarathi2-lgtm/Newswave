import express from 'express';
import {
  getArticles,
  getFeaturedArticle,
  getArticleById,
  getTrending,
  refreshNews,
  importHistoricalNews,
} from '../controllers/newsController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getArticles);
router.get('/featured', getFeaturedArticle);
router.get('/trending', getTrending);
router.post('/refresh', refreshNews);
router.post('/import-history', protect, adminOnly, importHistoricalNews);
router.get('/:id', getArticleById);

export default router;
