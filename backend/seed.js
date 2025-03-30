const mongoose = require('mongoose');
const Flower = require('./models/Flower');
const fs = require('fs');
const path = require('path');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blossom')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Read flowers.json
const flowersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'flowers.json'), 'utf-8'));

// Insert or Update Flowers
const seedDatabase = async () => {
  try {
    for (const flower of flowersData) {
      const existingFlower = await Flower.findOne({ name: flower.name });
      if (existingFlower) {
        // Update existing flower
        await Flower.updateOne({ name: flower.name }, flower);
        console.log(`Updated: ${flower.name}`);
      } else {
        // Insert new flower
        const newFlower = new Flower(flower);
        await newFlower.save();
        console.log(`Inserted: ${flower.name}`);
      }
    }
    console.log('Database seeding complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
