const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

// const mongoURL = 'mongodb://127.0.0.1:27017/hotels';
const mongoURL = process.env.MONGODB_URL;

mongoose.connect(mongoURL)
const db = mongoose.connection; 
             
db.on('connected', () => {
  console.log('Connected to MongoDB Server');
});
db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
db.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

module.exports = db;