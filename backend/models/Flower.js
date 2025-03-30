const mongoose = require('mongoose');

const flowerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  scientificName: { type: String, required: true },
  price: { type: Number, required: true },
  lifespan: { type: String, required: true },
  climaticCondition: { type: String, required: true },
  imageUrl: { type: String ,required : true}
}, { timestamps: true });

module.exports = mongoose.model('Flower', flowerSchema);
