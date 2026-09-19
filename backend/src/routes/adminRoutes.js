import express from 'express';
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  deleteArticle,
  forceFetchNews,
  getOverviewStats,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly); // Admin only routes

router.get('/stats', getOverviewStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.delete('/news/:id', deleteArticle);
router.post('/fetch-news', forceFetchNews);

export default router;
