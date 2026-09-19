import User from '../models/User.js';
import Article from '../models/Article.js';
import { fetchAndProcessNews } from '../services/newsService.js';

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
export const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const skip = (page - 1) * limit;

    const total = await User.countDocuments();
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: users.length,
      total,
      page,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/admin/users/:id/role
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['USER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user (Admin only)
// @route   DELETE /api/admin/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own admin account' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an article (Admin only)
// @route   DELETE /api/admin/news/:id
export const deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    res.json({
      success: true,
      message: 'Article removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Force trigger news fetch (Admin only)
// @route   POST /api/admin/fetch-news
export const forceFetchNews = async (req, res, next) => {
  try {
    const result = await fetchAndProcessNews();
    res.json({
      success: true,
      message: 'Live news fetch executed successfully',
      result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed overview stats including South India state breakdowns (Admin requirement 15)
// @route   GET /api/admin/stats
export const getOverviewStats = async (req, res, next) => {
  try {
    const totalArticles = await Article.countDocuments();
    const totalUsers = await User.countDocuments();

    const indiaArticles = await Article.countDocuments({ region: { $in: ['India', 'South India'] } });
    const southIndiaArticles = await Article.countDocuments({ region: 'South India' });

    const tamilNaduCount = await Article.countDocuments({ state: 'Tamil Nadu' });
    const keralaCount = await Article.countDocuments({ state: 'Kerala' });
    const karnatakaCount = await Article.countDocuments({ state: 'Karnataka' });
    const apCount = await Article.countDocuments({ state: 'Andhra Pradesh' });
    const telanganaCount = await Article.countDocuments({ state: 'Telangana' });
    const puducherryCount = await Article.countDocuments({ state: 'Puducherry' });

    const latestArticle = await Article.findOne().sort({ createdAt: -1 });

    res.json({
      success: true,
      stats: {
        totalArticles,
        totalUsers,
        indiaArticles,
        southIndiaArticles,
        stateBreakdown: {
          tamilNadu: tamilNaduCount,
          kerala: keralaCount,
          karnataka: karnatakaCount,
          andhraPradesh: apCount,
          telangana: telanganaCount,
          puducherry: puducherryCount,
        },
        lastFetchTime: latestArticle ? latestArticle.createdAt : new Date(),
        lastSuccessfulFetch: new Date(),
        status: 'Operational',
      },
    });
  } catch (error) {
    next(error);
  }
};
