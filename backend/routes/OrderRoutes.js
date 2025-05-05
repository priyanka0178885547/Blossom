const express = require("express");
const router = express.Router();
const { Order, Flower, User } = require('../config/db');

 // ✅ Import Order model
 router.post("/", async (req, res) => {
  const { buyer, flowers } = req.body;

  if (!buyer || !flowers || !Array.isArray(flowers) || flowers.length === 0) {
    return res.status(400).json({ error: "Missing or invalid required fields." });
  }

  try {
    console.log(`Order creation request received. Buyer ID: ${buyer}`);
    // Validate buyer is a user with role 'buyer'
    const buyerUser = await User.findById(buyer);
    if (!buyerUser) {
      console.log(`Buyer not found for ID: ${buyer}`);
      return res.status(400).json({ error: "Buyer not found." });
    }
    console.log(`Buyer found with role: ${buyerUser.role}`);
    if (buyerUser.role !== 'buyer') {
      console.log(`User with ID ${buyer} is not a buyer, role: ${buyerUser.role}`);
      return res.status(400).json({ error: "User is not a buyer." });
    }

    let totalPrice = 0;
    const flowerDetails = [];

    // Collect all flowerIds
    const flowerIds = flowers.map(item => item.flowerId);

    // Retrieve all flower documents at once
    const flowerDocs = await req.flowerDB.find({ '_id': { $in: flowerIds } });

    if (flowerDocs.length !== flowerIds.length) {
      return res.status(404).json({ error: "One or more flowers not found." });
    }

    // Process each flower in the order
    for (let i = 0; i < flowers.length; i++) {
      const { flowerId, quantity } = flowers[i];

      if (!flowerId || !quantity) {
        return res.status(400).json({ error: "Each flower must have a valid flowerId and quantity." });
      }

      // Find the flower in the batch response
      const flowerDoc = flowerDocs.find(doc => doc._id.toString() === flowerId.toString());

      if (!flowerDoc) {
        return res.status(404).json({ error: `Flower with ID ${flowerId} not found.` });
      }

      const price = flowerDoc.price;
      const totalFlowerPrice = price * quantity;
      totalPrice += totalFlowerPrice;

      flowerDetails.push({
        flowerId,
        quantity,
        price,
        status: 'not accepted'  // Initialize status per flower item
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

router.get("/seller/:sellerId", async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    // Reduced logs to avoid flooding terminal
    // console.log("🔍 Fetching orders for seller:", sellerId);
    console.log(sellerId);
    // Step 1: Get all flowers for this seller
    const sellerFlowers = await req.flowerDB.find({ seller: sellerId });
    // console.log("🌸 Seller's flowers:", sellerFlowers);

    if (!sellerFlowers || sellerFlowers.length === 0) {
      // console.warn("⚠️ No flowers found for this seller.");
      return res.status(404).json({ error: "No flowers found for this seller" });
    }

    const flowerIds = sellerFlowers.map(f => f._id.toString());
    // console.log("📦 Flower IDs associated with the seller:", flowerIds);

    // Step 2: Find all orders that contain any of these flower IDs
    let orders = await Order.find({
      'flowers.flowerId': { $in: flowerIds }
    }).populate('flowers.flowerId');
    
    // console.log("🧾 Orders after populating flowerId:", orders);

    // Manually populate buyer details
    const buyerIds = [...new Set(orders.map(order => order.buyer.toString()))];
    const buyers = await User.find({ _id: { $in: buyerIds } }).select('-password -__v');
    const buyersMap = {};
    buyers.forEach(buyer => {
      buyersMap[buyer._id.toString()] = buyer;
    });

    // Attach buyer details to orders
    orders = orders.map(order => {
      const orderObj = order.toObject();
      // Ensure buyer is only replaced if buyer role is 'buyer'
      const buyerData = buyersMap[order.buyer.toString()];
      if (buyerData && buyerData.role === 'buyer') {
        orderObj.buyer = buyerData;
      } else {
        // If buyer is not a buyer role, keep original ObjectId or null
        orderObj.buyer = null;
      }
      return orderObj;
    });

    // console.log("🧾 Orders after manual buyer population:", orders);

    if (!orders || orders.length === 0) {
      // console.warn("⚠️ No orders found for this seller.");
      return res.status(404).json({ error: "No orders found for this seller" });
    }

    // Step 3: Filter orders to only include those containing this seller's flowers
    let filteredOrders = orders.filter(order => {
      return order.flowers.some(flower => flower.flowerId && flowerIds.includes(flower.flowerId._id.toString()));
    });

    if (filteredOrders.length === 0) {
      // console.warn("⚠️ No valid orders for this seller.");
      return res.status(404).json({ error: "No valid orders for this seller" });
    }

    // Step 4: For each order, filter flowers to only include those sold by this seller
    filteredOrders = filteredOrders.map(order => {
      const filteredFlowers = order.flowers.filter(flower => flower.flowerId && flowerIds.includes(flower.flowerId._id.toString()));
      return {
        ...order,
        flowers: filteredFlowers
      };
    });

    // Final response
    res.status(200).json(filteredOrders);
  } catch (err) {
    console.error("❌ Error fetching seller orders:", err);
    res.status(500).json({ error: `Server error: ${err.message}` });
  }
});


router.put("/:orderId/flower/:flowerId/status", async (req, res) => {
  const { status } = req.body;
  const { orderId, flowerId } = req.params;

  if (!["accepted", "not accepted"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value." });
  }

  try {
    const order = await req.Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    const flowerItem = order.flowers.find(flower => flower.flowerId.toString() === flowerId);
    if (!flowerItem) {
      return res.status(404).json({ error: "Flower item not found in order." });
    }

    flowerItem.status = status;

    // Update order status based on flower item statuses
    const allAccepted = order.flowers.every(flower => flower.status === "accepted");
    order.status = allAccepted ? "accepted" : "not accepted";

    await order.save();

    res.status(200).json(order);
  } catch (err) {
    console.error("Error updating flower item status:", err);
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
