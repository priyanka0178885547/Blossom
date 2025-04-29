// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
router.post("/add", async (req, res) => {
    try {
      const { userId, flowerId } = req.body;
      const Cart = req.Cart;
  
      if (!userId || !flowerId) {
        return res.status(400).json({
          success: false,
          message: "userId and flowerId are required"
        });
      }
  
      let cart = await Cart.findOne({ userId });
  
      if (!cart) {
        cart = new Cart({ userId, flowers: [flowerId] });
      } else if (!cart.flowers.includes(flowerId)) {
        cart.flowers.push(flowerId);
      }
  
      await cart.save();
      res.status(200).json({
        success: true,
        message: "Added to cart",
        cart,
      });
    } catch (error) {
      console.error("Cart Add Error:", error);
      res.status(500).json({
        success: false,
        message: "Error adding to cart",
        error: process.env.NODE_ENV === "development" ? error.stack : error.message, // Detailed error in dev mode
      });
    }
  });
  router.get("/:userId", async (req, res) => {
    const { userId } = req.params;
    const Cart = req.Cart;
    const Flower = req.flowerDB.model("Flower");
  
    try {
      const cart = await Cart.findOne({ userId }).populate({
        path: 'flowers',
        model: Flower
      });
  
      if (!cart) {
        return res.status(200).json({ message: "No cart found", cart: null });
      }
  
      res.status(200).json({ 
        message: "Cart retrieved successfully", 
        cart: cart.flowers 
      });
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({
        message: "Error fetching cart",
        error: error.message,
      });
    }
  });
  
// Remove from Cart
router.post("/remove", async (req, res) => {
    try {
      const { userId, flowerId } = req.body;
      const Cart = req.Cart;
  
      if (!userId || !flowerId) {
        return res.status(400).json({
          success: false,
          message: "userId and flowerId are required"
        });
      }
  
      let cart = await Cart.findOne({ userId });
  
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Cart not found"
        });
      }
  
      // Remove flowerId from flowers array
      cart.flowers = cart.flowers.filter(id => id.toString() !== flowerId.toString());
  
      // If flowerId exists, it will be removed; otherwise, nothing changes
      await cart.save();
  
      res.status(200).json({
        success: true,
        message: "Removed from cart",
        cart,
      });
    } catch (error) {
      console.error("Cart Remove Error:", error);
      res.status(500).json({
        success: false,
        message: "Error removing from cart",
        error: process.env.NODE_ENV === "development" ? error.stack : error.message, // Detailed error in dev mode
      });
    }
  });
// In CartRoutes.js
router.post("/removeBatch", async (req, res) => {
  const { userId, flowerIds } = req.body;
  const Cart = req.Cart;

  if (!userId || !Array.isArray(flowerIds) || flowerIds.length === 0) {
    return res.status(400).json({ error: "Missing userId or flowerIds." });
  }

  try {
    const updatedCart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { flowers: { $in: flowerIds } } },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ error: "Cart not found." });
    }

    res.status(200).json(updatedCart);
  } catch (err) {
    console.error("Error removing flowers from cart:", err);
    res.status(500).json({ error: "Failed to remove items from cart." });
  }
});

module.exports = router;
