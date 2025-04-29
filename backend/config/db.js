const mongoose = require('mongoose');
const userModel = require('../models/User');
const flowerModel = require('../models/Flower');
const { schema: orderSchema } = require('../models/Order');

// Connections
const blossomDB = mongoose.createConnection(process.env.FLOWER_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userDetailsDB = mongoose.createConnection(process.env.USER_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Models from each DB
const User = userModel(userDetailsDB); // 👈 User from userDetails DB
const Flower = flowerModel(blossomDB); // 👈 Flower from blossom DB
const Order = blossomDB.model('Order', orderSchema);

module.exports = {
  blossomDB,
  userDetailsDB,
  User,
  Flower,
  Order,
};
