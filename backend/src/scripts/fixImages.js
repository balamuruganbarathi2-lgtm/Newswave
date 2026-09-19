import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Article from '../models/Article.js';
import { getArticleSpecificImage } from '../utils/imageHelper.js';

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
    console.log('Connected!');

    const articles = await Article.find();
    console.log(`Found ${articles.length} total articles in database.`);

    let updatedCount = 0;
    for (const article of articles) {
      const newImage = getArticleSpecificImage(
        article.title,
        article.description || article.content || '',
        article.category || 'Technology'
      );

      // Always update if it's generic fallback or if we want fresh accurate images
      if (article.imageUrl !== newImage) {
        article.imageUrl = newImage;
        article.urlToImage = newImage;
        await article.save();
        updatedCount++;
        console.log(`Updated [${article.category}] "${article.title.substring(0, 40)}..." -> ${newImage.substring(0, 50)}...`);
      }
    }

    console.log(`\n✅ Migration complete! Updated ${updatedCount} articles with specific, relevant images.`);
    process.exit(0);
  } catch (err) {
    console.error('Error during image fix script:', err.message);
    process.exit(1);
  }
};

run();
