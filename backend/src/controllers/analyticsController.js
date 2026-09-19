import Article from '../models/Article.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Bookmark from '../models/Bookmark.js';
import TrendingTopic from '../models/TrendingTopic.js';

// @desc    Get dashboard overview stats
// @route   GET /api/analytics/overview
export const getOverviewStats = async (req, res, next) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [totalArticles, articlesToday, totalUsers, totalCategories, totalBookmarks, distinctSources] = await Promise.all([
      Article.countDocuments(),
      Article.countDocuments({ fetchedAt: { $gte: todayStart } }),
      User.countDocuments(),
      Category.countDocuments(),
      Bookmark.countDocuments(),
      Article.distinct('sourceName'),
    ]);

    const activeSources = distinctSources.length || 8;

    res.json({
      success: true,
      stats: {
        totalArticles,
        articlesToday,
        totalUsers,
        totalCategories,
        activeSources,
        totalBookmarks,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get article category distribution for Recharts
// @route   GET /api/analytics/categories
export const getCategoryDistribution = async (req, res, next) => {
  try {
    const distribution = await Article.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { name: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: distribution,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get sentiment analysis breakdown
// @route   GET /api/analytics/sentiment
export const getSentimentDistribution = async (req, res, next) => {
  try {
    const distribution = await Article.aggregate([
      { $group: { _id: '$sentiment', count: { $sum: 1 } } },
      { $project: { name: '$_id', count: 1, _id: 0 } },
    ]);

    res.json({
      success: true,
      data: distribution,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get daily news activity timeline
// @route   GET /api/analytics/activity
export const getNewsActivityTimeline = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days || '7', 10);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const activity = await Article.aggregate([
      { $match: { publishedAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$publishedAt' } },
          count: { $sum: 1 },
          positive: {
            $sum: { $cond: [{ $eq: ['$sentiment', 'Positive'] }, 1, 0] },
          },
          negative: {
            $sum: { $cond: [{ $eq: ['$sentiment', 'Negative'] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', count: 1, positive: 1, negative: 1, _id: 0 } },
    ]);

    res.json({
      success: true,
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};
