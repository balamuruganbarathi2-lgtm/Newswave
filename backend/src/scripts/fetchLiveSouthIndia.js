import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fetchAndProcessNews } from '../services/newsService.js';

dotenv.config();

const run = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI is missing in .env');
      process.exit(1);
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Atlas!');

    console.log('Triggering live news ingestion for South India and National Feeds...');
    const result = await fetchAndProcessNews();

    console.log(`\n✅ Ingestion complete! Added ${result.newArticlesAdded} new articles to MongoDB.`);
    process.exit(0);
  } catch (err) {
    console.error('Error in live ingestion:', err.message);
    process.exit(1);
  }
};

run();
