import app from './app.js';
import connectDB from './config/db.js';
import { startNewsFetcherScheduler } from './tasks/newsFetcher.js';
import { seedDatabase } from './utils/seed.js';
import { fixDuplicateArticleImages } from './services/newsService.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Seed initial categories & default Admin
    await seedDatabase();

    // 3. Fix any legacy duplicate article thumbnails in MongoDB
    await fixDuplicateArticleImages();

    // 4. Start background news fetcher task
    startNewsFetcherScheduler();

    // 4. Listen for incoming HTTP requests
    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 NewsWave Backend API running in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
