// src/db/connectMongoDB.js
import mongoose from 'mongoose';

export const connectMongoDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;

    if (!mongoUrl) {
      console.error('❌ MONGO_URL is not set. Please add it to your .env or environment.');
      process.exit(1);
    }

    // Mask password in logs to avoid leaking secrets
    const maskedUrl = mongoUrl.replace(/\/\/([^:]+):([^@]+)@/, (_m, user) => `//${user}:*****@`);
    console.log('🔎 Connecting to MongoDB:', maskedUrl);

    await mongoose.connect(mongoUrl);
    console.log('✅ MongoDB connection established successfully');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};
