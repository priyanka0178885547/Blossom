const mongoose = require("mongoose");

module.exports = (connection) => {
  const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    flowers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Flower" }],
  });

  return connection.model("Cart", cartSchema, "carts");
};
