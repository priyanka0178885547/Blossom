const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const visitorDB = mongoose.createConnection(process.env.VISITOR_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

visitorDB.on('connected', () => console.log('Connected to visitor database'));

const Visitor = require("../models/visitor")(visitorDB);

router.get("/", async (req, res) => {
  try {
    let visitor = await Visitor.findOne();
    if (!visitor) {
      visitor = new Visitor({ count: 1 });
    } else {
      visitor.count += 1;
    }
    await visitor.save();
    res.json({ visitorCount: visitor.count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching visitor count", error });
  }
});

module.exports = router;
