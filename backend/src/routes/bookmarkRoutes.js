import express from 'express';
import { toggleBookmark, getBookmarks, checkBookmarkStatus } from '../controllers/bookmarkController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All bookmark endpoints require login

router.post('/', toggleBookmark);
router.get('/', getBookmarks);
router.get('/check/:articleId', checkBookmarkStatus);

export default router;
