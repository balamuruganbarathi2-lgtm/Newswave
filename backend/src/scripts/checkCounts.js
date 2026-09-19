import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Article from '../models/Article.js';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const total = await Article.countDocuments();
    const southIndia = await Article.countDocuments({ region: 'South India' });
    const tn = await Article.countDocuments({ state: 'Tamil Nadu' });
    const kl = await Article.countDocuments({ state: 'Kerala' });
    const ka = await Article.countDocuments({ state: 'Karnataka' });
    const ap = await Article.countDocuments({ state: 'Andhra Pradesh' });
    const ts = await Article.countDocuments({ state: 'Telangana' });
    const py = await Article.countDocuments({ state: 'Puducherry' });

    console.log(`\n===================================`);
    console.log(`📊 LIVE MONGODB ATLAS COUNTS:`);
    console.log(`Total Articles Stored: ${total}`);
    console.log(`South India Articles: ${southIndia}`);
    console.log(`  - Tamil Nadu: ${tn}`);
    console.log(`  - Kerala: ${kl}`);
    console.log(`  - Karnataka: ${ka}`);
    console.log(`  - Andhra Pradesh: ${ap}`);
    console.log(`  - Telangana: ${ts}`);
    console.log(`  - Puducherry: ${py}`);
    console.log(`===================================\n`);
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

run();
