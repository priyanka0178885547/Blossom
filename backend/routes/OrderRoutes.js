const express = require("express");
const router = express.Router();
const { Order, Flower, User } = require('../config/db');
 // ✅ Import Order model

// 1. Place a new order with multiple flowers
router.post("/", async (req, res) => {
  const { buyer, flowers } = req.body;

  if (!buyer || !flowers || !Array.isArray(flowers) || flowers.length === 0) {
    return res.status(400).json({ error: "Missing or invalid required fields." });
  }

  try {
    let totalPrice = 0;
    const flowerDetails = [];

    // Process each flower in the order
    for (let i = 0; i < flowers.length; i++) {
      const { flowerId, quantity } = flowers[i];

      if (!flowerId || !quantity) {
        return res.status(400).json({ error: "Each flower must have a valid flowerId and quantity." });
      }

      const flowerDoc = await req.flowerDB.findById(flowerId);
      if (!flowerDoc) {
        return res.status(404).json({ error: `Flower with ID ${flowerId} not found.` });
      }

      const price = flowerDoc.price;
      const totalFlowerPrice = price * quantity;
      totalPrice += totalFlowerPrice;

      flowerDetails.push({
        flowerId,
        quantity,
        price
      });
    }

    // Create the new order with multiple flowers
    const newOrder = await req.Order.create({
      buyer,
      flowers: flowerDetails,
      totalPrice,
    });

    res.status(201).json(newOrder);
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ error: "Server error." });
  }
});


// 2. Get all orders by buyer
router.get("/buyer/:buyerId", async (req, res) => {
  try {
    const orders = await req.Order.find({ buyer: req.params.buyerId })
      .populate("flowers.flowerId") // Populate flowerId for each flower in the order
      .sort({ orderedAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching buyer orders:", err);
    res.status(500).json({ error: "Server error." });
  }
});

// 3. Update order status (accepted / not accepted)
router.put("/:orderId/status", async (req, res) => {
  const { status } = req.body;

  if (!["accepted", "not accepted"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value." });
  }

  try {
    const updated = await req.Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Order not found." });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ error: "Server error." });
  }
});
// 4. Get all orders for a seller (based on flowers they own)
router.get("/seller/:sellerId", async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    console.log("🔍 Fetching orders for seller:", req.params.sellerId);

    // Step 1: Get all flowers for this seller
    const sellerFlowers = await req.flowerDB.find({ seller: req.params.sellerId });
    console.log("🌸 Seller's flowers:", sellerFlowers);

    if (!sellerFlowers || sellerFlowers.length === 0) {
      console.warn("⚠️ No flowers found for this seller.");
      return res.status(404).json({ error: "No flowers found for this seller" });
    }

    const flowerIds = sellerFlowers.map(f => f._id);
    // console.log("📦 Flower IDs associated with the seller:", flowerIds);

    // Step 2: Find all orders with any of these flower IDs
    let orders = await Order.find({
      'flowers.flowerId': { $in: flowerIds }
    });
    
    // console.log("🧾 Raw orders found (before populate):", orders);

    // Step 3: Populate flowerId for each flower in the order
    orders = await Order.populate(orders, {
      path: 'flowers.flowerId',
      model: Flower, // ✅ use model from blossomDB
    });
    // console.log("🌼 Orders after populating flowerId:", orders);

    // Step 4: Populate buyer info
    orders = await Order.populate(orders, {
      path: 'buyer',
      model: User, // ✅ model from userDB
      select: '-password -__v' // ⛔️ exclude password field
    });
    
    console.log("🧍 Orders after populating buyer info:", orders);

    if (!orders || orders.length === 0) {
      console.warn("⚠️ No orders found for this seller.");
      return res.status(404).json({ error: "No orders found for this seller" });
    }

    // Final response
    res.status(200).json(orders);
  } catch (err) {
    console.error("❌ Error fetching seller orders:", err);
    res.status(500).json({ error: `Server error: ${err.message}` });
  }
});


module.exports = router;
