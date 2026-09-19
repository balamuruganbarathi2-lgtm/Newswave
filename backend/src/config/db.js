import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables.');
    }

    // Disable command buffering so queries fail immediately if DB is disconnected
    mongoose.set('bufferCommands', false);

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log('MongoDB Atlas connected successfully');
    return conn;
  } catch (error) {
    // Sanitize credentials from log message
    let sanitizedMsg = error.message || 'Connection failed';
    sanitizedMsg = sanitizedMsg.replace(/mongodb(?:\+srv)?:\/\/[^@]+@/gi, 'mongodb+srv://<credentials_hidden>@');

    console.error(`MongoDB Atlas Connection Error: ${sanitizedMsg}`);
    throw error;
  }
};

export default connectDB;
