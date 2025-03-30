const mongoose = require('mongoose');
const Flower = require('./models/Flower');
const flowersData = require('./flowers.json');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const uploadFlowers = async () => {
  try {
    console.log('Uploading flower data...');
    await Flower.insertMany(flowersData);
    console.log('Flowers added successfully!');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error uploading flowers:', error.message);
    mongoose.disconnect();
  }
};

uploadFlowers();
