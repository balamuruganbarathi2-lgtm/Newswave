import app from './app.js';
import connectDB from './config/db.js';
import { startNewsFetcherScheduler } from './tasks/newsFetcher.js';
import { seedDatabase } from './utils/seed.js';
import { fixDuplicateArticleImages } from './services/newsService.js';

const PORT = process.env.PORT || 5000;

// 1. Start listening on PORT immediately for Render port binding health checks
const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 NewsWave Backend API running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=======================================================`);
});

// 2. Connect to MongoDB Atlas & Initialize background services
const initServices = async () => {
  try {
    console.log('[Server] Connecting to MongoDB Atlas database...');
    await connectDB();

    console.log('[Server] Seeding categories and admin user if needed...');
    await seedDatabase();

    console.log('[Server] Verifying article regional & thumbnail data...');
    await fixDuplicateArticleImages();

    console.log('[Server] Starting background news fetcher scheduler...');
    startNewsFetcherScheduler();

    console.log('[Server] All background services initialized successfully.');
  } catch (err) {
    console.error('[Server] Background initialization notice:', err.message);
  }
};

initServices();
