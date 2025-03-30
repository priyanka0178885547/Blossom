const express = require('express');
const multer = require('multer');
const Flower = require('../models/Flower');
const router = express.Router();

//Configure Multer for multiple image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/flowers');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
}).array('images', 10); // Field name should match 'images'

router.post('/bulk-upload', upload, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const flowersData = JSON.parse(req.body.flowers);
    if (flowersData.length !== req.files.length) {
      return res.status(400).json({ message: 'Number of images must match flower data' });
    }

    const flowers = flowersData.map((flower, index) => ({
      ...flower,
      imageUrl: `/uploads/flowers/${req.files[index].filename}`,
    }));

    await Flower.insertMany(flowers);
    res.status(201).json({ message: 'Flowers uploaded successfully', flowers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get All Flowers
// router.get('/', async (req, res) => {
//   try {
//     const flowers = await Flower.find({});
//     res.json(flowers);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });


router.get('/', async (req, res) => {
  try {
    // Use the flowerDB connection
    const FlowerModel = req.flowerDB.model('Flower', Flower.schema);
    const flowers = await FlowerModel.find({});
    res.json(flowers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;
