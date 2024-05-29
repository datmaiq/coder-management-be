import mongoose from 'mongoose';
import * as process from "process";
import dotenv from "dotenv";

dotenv.config()
export async function connectDB(): Promise<void> {
  try {
    // MongoDB connection URI
    const mongoURI = process.env.MONGODB_URI;

    // Connect to MongoDB
    await mongoose.connect(mongoURI as string, {});
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}
