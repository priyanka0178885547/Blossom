
const express = require('express');
const router = express.Router();
const Wishlist = require('../models/wishlist'); // Import Wishlist model

router.post("/add", async (req, res) => {
  const { userId, flowerId } = req.body;
  const Wishlist = req.Wishlist; // Use the registered model

  try {
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, flowers: [flowerId] });
    } else if (!wishlist.flowers.includes(flowerId)) {
      wishlist.flowers.push(flowerId);
    }

    await wishlist.save();
    res.status(200).json({ message: "Added to wishlist", wishlist });
  } catch (error) {
    console.error("Wishlist Add Error:", error);
    res.status(500).json({ message: "Error adding to wishlist", error: error.message || error });
  }
});
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const Wishlist = req.Wishlist;
  // const Flower = req.flowerDB.model('Flower'); // Get Flower model from flowerDB connection
  const Flower = req.flowerDB.model('Flower'); // Get Flower model from flowerDB connection

  try {
    const wishlist = await Wishlist.findOne({ userId })
      .populate({
        path: 'flowers',
        model: Flower // Use the Flower model from the correct connection
      });

    if (!wishlist) {
      return res.status(200).json({ message: "No wishlist found", wishlist: null });
    }

    res.status(200).json({ 
      message: "Wishlist retrieved successfully", 
      wishlist: wishlist.flowers 
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ 
      message: "Error fetching wishlist", 
      error: error.message 
    });
  }
});
// Remove flower from wishlist
router.post("/remove", async (req, res) => {
  const { userId, flowerId } = req.body;
  const Wishlist = req.Wishlist; // Get the Wishlist model the same way as add/get

  try {
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.flowers = wishlist.flowers.filter(id => id.toString() !== flowerId);
    await wishlist.save();

    res.status(200).json({ message: "Removed from wishlist", wishlist });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ message: "Error removing from wishlist", error: error.message || error });
  }
});

module.exports = router;