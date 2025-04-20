const mongoose = require("mongoose");

module.exports = (connection) => {
    const wishlistSchema = new mongoose.Schema({
      userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
      flowers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Flower" }],
    });
  
    // Return the model after registering it with the connection
    return connection.model("Wishlist", wishlistSchema, "wishlists");
  };