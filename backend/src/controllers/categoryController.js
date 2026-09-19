import Category from '../models/Category.js';
import Article from '../models/Article.js';

// @desc    Get all categories with article counts
// @route   GET /api/categories
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    
    // Dynamically calculate actual article counts per category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Article.countDocuments({
          category: { $regex: new RegExp(`^${cat.name}$`, 'i') },
        });
        return {
          ...cat.toObject(),
          articleCount: count,
        };
      })
    );

    res.json({
      success: true,
      categories: categoriesWithCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category details and top articles
// @route   GET /api/categories/:slug
export const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug.toLowerCase() });
    
    // Fallback if category model doesn't match slug exactly
    const categoryName = category ? category.name : req.params.slug.charAt(0).toUpperCase() + req.params.slug.slice(1);

    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '12', 10);
    const skip = (page - 1) * limit;

    const query = { category: { $regex: new RegExp(`^${categoryName}$`, 'i') } };

    const total = await Article.countDocuments(query);
    const articles = await Article.find(query).sort({ publishedAt: -1 }).skip(skip).limit(limit);

    res.json({
      success: true,
      category: category || { name: categoryName, slug: req.params.slug, description: `Latest news and AI analysis for ${categoryName}` },
      total,
      articles,
    });
  } catch (error) {
    next(error);
  }
};
