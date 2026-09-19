import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import { fetchHistoricalNews } from '../services/newsService.js';

dotenv.config();

/**
 * Optional seed script to populate MongoDB Atlas with historical news across categories
 * Run explicitly via: npm run seed:news
 * DOES NOT run automatically on server boot.
 */
const runHistoricalSeed = async () => {
  try {
    console.log('[Seed News] Connecting to MongoDB Atlas...');
    await connectDB();

    console.log('[Seed News] Populating MongoDB with historical news data...');

    const categories = ['Technology', 'Business', 'Sports', 'Health', 'Science', 'Entertainment', 'World', 'Environment'];
    
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const fromDateStr = thirtyDaysAgo.toISOString().split('T')[0];
    const toDateStr = today.toISOString().split('T')[0];

    let grandTotalInserted = 0;
    let grandTotalDuplicates = 0;

    for (const cat of categories) {
      console.log(`[Seed News] Seeding historical news for category: ${cat}...`);
      const result = await fetchHistoricalNews({
        from: fromDateStr,
        to: toDateStr,
        category: cat,
      });

      grandTotalInserted += result.inserted;
      grandTotalDuplicates += result.duplicates;
    }

    console.log('=======================================================');
    console.log(`✅ Historical News Seeding Complete!`);
    console.log(`📥 Total Inserted: ${grandTotalInserted} articles`);
    console.log(`⚠️ Total Duplicates Skipped: ${grandTotalDuplicates}`);
    console.log(`📅 Date Range: ${fromDateStr} to ${toDateStr}`);
    console.log('=======================================================');

    process.exit(0);
  } catch (error) {
    console.error('[Seed News] Error seeding historical news:', error.message);
    process.exit(1);
  }
};

runHistoricalSeed();
