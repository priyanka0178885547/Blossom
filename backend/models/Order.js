// models/order.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  flowers: [
    {
      flowerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flower', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      status: { type: String, default: 'not accepted' }  // Added status per flower item
    }
  ],
  totalPrice: { type: Number, required: true },
  status: { type: String, default: 'not accepted' },
  orderedAt: { type: Date, default: Date.now }
});

// Export the schema for external use
module.exports.schema = orderSchema;
