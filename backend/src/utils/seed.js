import dotenv from 'dotenv';
import Category from '../models/Category.js';
import User from '../models/User.js';
import { fetchAndProcessNews } from '../services/newsService.js';

dotenv.config();

const DEFAULT_CATEGORIES = [
  { name: 'Technology', slug: 'technology', description: 'AI, computing, gadgets, software & startups', iconName: 'Cpu' },
  { name: 'Business', slug: 'business', description: 'Markets, economy, stocks, banking & corporate news', iconName: 'TrendingUp' },
  { name: 'Sports', slug: 'sports', description: 'Cricket, football, Olympics, basketball & tournaments', iconName: 'Trophy' },
  { name: 'Health', slug: 'health', description: 'Medical research, wellness, pharma, healthcare & medicine', iconName: 'HeartPulse' },
  { name: 'Science', slug: 'science', description: 'Space exploration, astronomy, quantum physics & discoveries', iconName: 'FlaskConical' },
  { name: 'Entertainment', slug: 'entertainment', description: 'Movies, music, celebrities, streaming & arts', iconName: 'Film' },
  { name: 'World', slug: 'world', description: 'Global politics, international affairs, treaties & diplomacy', iconName: 'Globe' },
  { name: 'Environment', slug: 'environment', description: 'Climate change, renewable energy & green technology', iconName: 'Leaf' }
];

export const seedDatabase = async () => {
  try {
    console.log('[Seed] Seeding default categories...');
    for (const cat of DEFAULT_CATEGORIES) {
      await Category.findOneAndUpdate({ slug: cat.slug }, cat, { upsert: true, new: true });
    }

    console.log('[Seed] Checking default Admin user (admin@newswave.com)...');
    const adminExists = await User.findOne({ email: 'admin@newswave.com' });
    if (!adminExists) {
      await User.create({
        name: 'NewsWave Administrator',
        email: 'admin@newswave.com',
        password: 'AdminPassword123!',
        role: 'ADMIN',
      });
      console.log('[Seed] Admin user created successfully.');
    }

    console.log('[Seed] Seeding completed.');
  } catch (error) {
    console.warn('[Seed] Initialization notice:', error.message);
  }
};
