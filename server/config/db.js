const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use MONGODB_URI to match server.js usage and common conventions
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
