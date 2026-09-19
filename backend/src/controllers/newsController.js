import Article from '../models/Article.js';
import TrendingTopic from '../models/TrendingTopic.js';
import { fetchAndProcessNews, fetchHistoricalNews } from '../services/newsService.js';
import { calculateTrendingTopics } from '../services/trendingService.js';
import { enrichArticleDetails } from '../services/summaryService.js';

// @desc    Get paginated news articles with search, date range & category filtering
// @route   GET /api/news
export const getArticles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '12', 10);
    const skip = (page - 1) * limit;

    const { category, sentiment, search, sort, source, from, to, region, state } = req.query;

    const query = {};

    if (category && category.toLowerCase() !== 'all') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (region && region.toLowerCase() !== 'all') {
      query.region = { $regex: new RegExp(`^${region}$`, 'i') };
    }

    if (state && state.toLowerCase() !== 'all') {
      query.state = { $regex: new RegExp(`^${state.replace(/-/g, ' ')}$`, 'i') };
    }

    if (sentiment && sentiment.toLowerCase() !== 'all') {
      query.sentiment = { $regex: new RegExp(`^${sentiment}$`, 'i') };
    }

    if (source) {
      query.sourceName = { $regex: new RegExp(source, 'i') };
    }

    // Date Range Filtering (Requirement 6)
    if (from || to) {
      query.publishedAt = {};
      if (from) {
        const fromDate = new Date(from);
        if (!isNaN(fromDate.getTime())) {
          fromDate.setHours(0, 0, 0, 0);
          query.publishedAt.$gte = fromDate;
        }
      }
      if (to) {
        const toDate = new Date(to);
        if (!isNaN(toDate.getTime())) {
          toDate.setHours(23, 59, 59, 999);
          query.publishedAt.$lte = toDate;
        }
      }
    }

    // Search Query Filtering across stored MongoDB articles (Requirement 8 & 12)
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { topic: searchRegex },
        { category: searchRegex },
        { sourceName: searchRegex },
        { author: searchRegex },
        { state: searchRegex },
        { region: searchRegex },
      ];
    }

    let sortOptions = { publishedAt: -1 };
    if (sort === 'oldest') {
      sortOptions = { publishedAt: 1 };
    } else if (sort === 'popular') {
      sortOptions = { viewsCount: -1, publishedAt: -1 };
    } else if (sort === 'confidence') {
      sortOptions = { classificationConfidence: -1 };
    }

    const total = await Article.countDocuments(query);
    const articles = await Article.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate('similarArticleId', 'title url category sourceName');

    const totalPages = Math.ceil(total / limit) || 1;

    res.json({
      success: true,
      count: articles.length,
      total,
      page,
      totalPages,
      articles,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top featured headline article
// @route   GET /api/news/featured
export const getFeaturedArticle = async (req, res, next) => {
  try {
    const featured = await Article.findOne({ imageUrl: { $ne: '' }, isDuplicate: false })
      .sort({ publishedAt: -1 })
      .populate('similarArticleId', 'title url');

    res.json({
      success: true,
      article: featured || null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get article details by ID with complete enriched NewsWave reading sections
// @route   GET /api/news/:id
export const getArticleById = async (req, res, next) => {
  try {
    const articleDoc = await Article.findById(req.params.id).populate(
      'similarArticleId',
      'title url category sourceName imageUrl'
    );

    if (!articleDoc) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    articleDoc.viewsCount += 1;
    await articleDoc.save();

    const enrichedArticle = enrichArticleDetails(articleDoc);

    const relatedArticles = await Article.find({
      _id: { $ne: articleDoc._id },
      $or: [{ category: articleDoc.category }, { topic: articleDoc.topic }],
    })
      .sort({ publishedAt: -1 })
      .limit(4);

    res.json({
      success: true,
      article: enrichedArticle,
      relatedArticles,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dynamic trending topics
// @route   GET /api/news/trending
export const getTrending = async (req, res, next) => {
  try {
    let trending = await TrendingTopic.find().sort({ trendScore: -1 }).limit(10);
    if (!trending || trending.length === 0) {
      trending = await calculateTrendingTopics();
    }
    res.json({
      success: true,
      topics: trending,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Trigger manual current news refresh
// @route   POST /api/news/refresh
export const refreshNews = async (req, res, next) => {
  try {
    const result = await fetchAndProcessNews();
    res.json({
      success: true,
      message: `Current news refreshed successfully. Added ${result.newArticlesAdded} new articles.`,
      result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Import historical news for a date range (Requirement 5)
// @route   POST /api/news/import-history
export const importHistoricalNews = async (req, res, next) => {
  try {
    const { from, to, category, search } = req.body;

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both "from" and "to" dates in YYYY-MM-DD format.',
      });
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD.',
      });
    }

    if (fromDate > toDate) {
      return res.status(400).json({
        success: false,
        message: '"from" date must be earlier than or equal to "to" date.',
      });
    }

    const result = await fetchHistoricalNews({
      from,
      to,
      category: category || 'Technology',
      search: search || '',
    });

    res.json({
      success: true,
      message: 'Historical news import completed successfully',
      result,
    });
  } catch (error) {
    next(error);
  }
};
