const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.log('No MONGODB_URI found in env. Falling back to local JSON database storage.');
    isConnected = false;
    return false;
  }
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully.');
    isConnected = true;
    return true;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    console.log('Falling back to local JSON database storage.');
    isConnected = false;
    return false;
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
