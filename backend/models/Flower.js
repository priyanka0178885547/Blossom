// const mongoose = require('mongoose');

// const flowerSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   color: { type: String, required: true },
//   price: { type: Number, required: true },
//   image: { type: String, required: true },
//   imagePublicId: { type: String },
//   seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
// }, { timestamps: true });

// module.exports = flowerSchema;


// models/Flower.js
// models/Flower.js



// const mongoose = require('mongoose');

// const flowerSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   color: { type: String, required: true },
//   price: { type: Number, required: true },
//   image: { type: String },
//   imagePublicId: { type: String },
//   seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
// });

// // Define and register the Flower model on flowerDB connection
// module.exports = (flowerDB) => {
//   if (flowerDB.models.Flower) {
//     return flowerDB.models.Flower;  // Return existing model if already defined
//   }
//   return flowerDB.model('Flower', flowerSchema);  // Register model if not already registered
// };



const mongoose = require('mongoose');

// models/Flower.js
module.exports = (connection) => {
  const flowerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    color: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    imagePublicId: { type: String, required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sold: { type: Number, default: 0 } 
  });

  return connection.model('Flower', flowerSchema);
};