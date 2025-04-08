
// const flowerSchema = require('../models/Flower');

// exports.addFlower = async (req, res) => {
//   try {
//     const Flower = req.flowerDB.models.Flower || req.flowerDB.model('Flower', flowerSchema); // ✅ Register model dynamically
//     const { name, color, price } = req.body;

//     if (!req.file || !name || !color || !price) {
//       return res.status(400).json({ message: 'All fields including image are required' });
//     }

//     const flower = new Flower({
//       name,
//       color,
//       price,
//       image: req.file.path,
//       imagePublicId: req.file.filename,
//       seller: req.user.id,
//     });

//     await flower.save();
//     res.status(201).json({ message: 'Flower added successfully', flower });

//   } catch (error) {
//     console.error('💥 Add flower error:', error);
//     res.status(500).json({ message: 'Failed to add flower', error: error.message });
//   }
// };


// const getMyFlowers = async (req, res) => {
//   try {
//     const flowers = await Flower.find({ seller: req.user.id });
//     res.status(200).json({ flowers });
//   } catch (error) {
//     console.error('Error fetching seller flowers:', error);
//     res.status(500).json({ message: 'Failed to fetch seller flowers' });
//   }
// };

// // New function to get all flowers
// const getAllFlowers = async (req, res) => {
//   try {
//     const flowers = await Flower.find({});
//     res.status(200).json({ flowers });
//   } catch (error) {
//     console.error('Error fetching all flowers:', error);
//     res.status(500).json({ message: 'Failed to fetch flowers' });
//   }
// };

// module.exports = {
//   getMyFlowers,
//   getAllFlowers,
//   // other controllers like addFlower, deleteFlower, etc.
// };

// // Optional: Delete flower (and Cloudinary image)
// exports.deleteFlower = async (req, res) => {
//   try {
//     const flower = await Flower.findById(req.params.id);
//     if (!flower) return res.status(404).json({ message: 'Flower not found' });

//     // Optional: delete image from Cloudinary
//     const cloudinary = require('../config/cloudinary');
//     await cloudinary.uploader.destroy(flower.imagePublicId);

//     await flower.deleteOne();
//     res.json({ message: 'Flower deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to delete flower' });
//   }
// };


const flowerSchema = require('../models/Flower');
const cloudinary = require('../config/cloudinary');

// Add Flower (Seller only)

exports.addFlower = async (req, res) => {
  try {
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);
    console.log('Using DB:', req.flowerDB.name);

    let Flower;
    if (req.flowerDB.models.Flower) {
      Flower = req.flowerDB.models.Flower;
    } else {
      Flower = req.flowerDB.model('Flower', flowerSchema);
    }

    const { name, color, price } = req.body;

    if (!req.file || !name || !color || !price) {
      return res.status(400).json({ message: 'All fields including image are required' });
    }

    const flower = new Flower({
      name,
      color,
      price,
      image: req.file.path,
      imagePublicId: req.file.filename,
      seller: req.user.id,
    });

    await flower.save();
    res.status(201).json({ message: 'Flower added successfully', flower });

  } catch (error) {
    console.error('💥 Add flower error:', error);
    res.status(500).json({ message: 'Failed to add flower', error: error.message });
  }
};


// Get Flowers of Current Seller
exports.getMyFlowers = async (req, res) => {
  try {
    const Flower = req.flowerDB.models.Flower || req.flowerDB.model('Flower', flowerSchema);
    const flowers = await Flower.find({ seller: req.user.id });
    res.status(200).json({ flowers });
  } catch (error) {
    console.error('Error fetching seller flowers:', error);
    res.status(500).json({ message: 'Failed to fetch seller flowers' });
  }
};

// Get All Flowers (for Buyers)
exports.getAllFlowers = async (req, res) => {
  try {
    const Flower = req.flowerDB.models.Flower || req.flowerDB.model('Flower', flowerSchema);
    const flowers = await Flower.find({});
    res.status(200).json({ flowers });
  } catch (error) {
    console.error('Error fetching all flowers:', error);
    res.status(500).json({ message: 'Failed to fetch flowers' });
  }
};

// Delete Flower (Seller)
exports.deleteFlower = async (req, res) => {
  try {
    const Flower = req.flowerDB.models.Flower || req.flowerDB.model('Flower', flowerSchema);
    const flower = await Flower.findById(req.params.id);

    if (!flower) return res.status(404).json({ message: 'Flower not found' });

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(flower.imagePublicId);

    await flower.deleteOne();
    res.json({ message: 'Flower deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete flower' });
  }
};
