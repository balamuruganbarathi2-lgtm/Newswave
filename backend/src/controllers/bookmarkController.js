import Bookmark from '../models/Bookmark.js';

// @desc    Toggle article bookmark (Add / Remove)
// @route   POST /api/bookmarks
export const toggleBookmark = async (req, res, next) => {
  try {
    const { articleId } = req.body;
    const userId = req.user._id;

    if (!articleId) {
      return res.status(400).json({ success: false, message: 'Article ID is required' });
    }

    const existingBookmark = await Bookmark.findOne({ user: userId, article: articleId });

    if (existingBookmark) {
      await Bookmark.findByIdAndDelete(existingBookmark._id);
      return res.json({
        success: true,
        bookmarked: false,
        message: 'Article removed from bookmarks',
      });
    } else {
      await Bookmark.create({ user: userId, article: articleId });
      return res.status(201).json({
        success: true,
        bookmarked: true,
        message: 'Article saved to bookmarks',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user bookmarked articles
// @route   GET /api/bookmarks
export const getBookmarks = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const bookmarks = await Bookmark.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('article');

    // Filter out any bookmarks where article might have been removed
    const validBookmarks = bookmarks.filter(b => b.article !== null);

    res.json({
      success: true,
      count: validBookmarks.length,
      bookmarks: validBookmarks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check bookmark status for an article
// @route   GET /api/bookmarks/check/:articleId
export const checkBookmarkStatus = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const bookmark = await Bookmark.findOne({ user: userId, article: req.params.articleId });

    res.json({
      success: true,
      isBookmarked: !!bookmark,
    });
  } catch (error) {
    next(error);
  }
};
