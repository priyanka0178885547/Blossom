const mongoose = require('mongoose');

const flowerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  imagePublicId: { type: String },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = flowerSchema;
