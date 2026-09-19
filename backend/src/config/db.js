import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI is not defined in environment variables.');
      return;
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
    });

    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    let sanitizedMsg = error.message || 'Connection failed';
    sanitizedMsg = sanitizedMsg.replace(/mongodb(?:\+srv)?:\/\/[^@]+@/gi, 'mongodb+srv://<credentials_hidden>@');
    console.error(`MongoDB Atlas Connection Warning: ${sanitizedMsg}`);
  }
};

export default connectDB;
