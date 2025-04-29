
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



// // Add Flower (Seller only)

// exports.addFlower = async (req, res) => {
//   try {
//     console.log('req.body:', req.body);
//     console.log('req.file:', req.file);
//     console.log('Using DB:', req.flowerDB.name);

//     let Flower;
//     if (req.flowerDB.models.Flower) {
//       Flower = req.flowerDB.models.Flower;
//     } else {
//       Flower = req.flowerDB.model('Flower', flowerSchema);
//     }

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

const { flowerSchema } = require('../models/Flower');
const cloudinary = require('../config/cloudinary');

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

// Search for flowers based on image
exports.searchFlowersByImage = async (req, res) => {
  try {
    const { imageUrl } = req.body; // URL of the image sent by the buyer

    // Analyze the search image
    const searchLabels = await analyzeImage(imageUrl);

    // Search for flowers with matching labels
    const Flower = req.flowerDB.models.Flower || req.flowerDB.model('Flower', flowerSchema);
    const flowers = await Flower.find({
      labels: { $in: searchLabels }, // Match flowers that have any of the search image's labels
    });

    res.status(200).json({ flowers });
  } catch (error) {
    console.error('Error searching for flowers:', error);
    res.status(500).json({ message: 'Failed to search flowers' });
  }
};
exports.updateFlower = async (req, res) => {
  try {
    const Flower = req.flowerDB.models.Flower || req.flowerDB.model('Flower', flowerSchema);
    const { id } = req.params;
    const { name, color, price } = req.body;

    // Basic validation
    if (!name || !color || !price) {
      return res.status(400).json({ 
        message: 'Name, color and price are required' 
      });
    }

    // Find and verify ownership
    const flower = await Flower.findOne({ _id: id, seller: req.user.id });
    if (!flower) {
      return res.status(404).json({ 
        message: 'Flower not found or not authorized' 
      });
    }

    // Prepare update data
    const updateData = { 
      name, 
      color, 
      price,
      updatedAt: new Date()
    };

    // Handle image update
    if (req.file) {
      // Delete old image if exists
      if (flower.imagePublicId) {
        await cloudinary.uploader.destroy(flower.imagePublicId);
      }

      // Analyze new image
      const imageLabels = await analyzeImage(req.file.path);

      updateData.image = req.file.path;
      updateData.imagePublicId = req.file.filename;
      updateData.labels = imageLabels;
    }

    // Update flower
    const updatedFlower = await Flower.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({ 
      message: 'Flower updated successfully', 
      flower: updatedFlower 
    });

  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ 
      message: 'Failed to update flower', 
      error: error.message 
    });
  }
};

// Get Flower by ID (for editing)
exports.getFlowerById = async (req, res) => {
  try {
    const Flower = req.flowerDB.models.Flower || req.flowerDB.model('Flower', flowerSchema);
    const flower = await Flower.findOne({ 
      _id: req.params.id, 
      seller: req.user.id 
    });

    if (!flower) {
      return res.status(404).json({ 
        message: 'Flower not found or not authorized' 
      });
    }

    res.status(200).json({ flower });
  } catch (error) {
    console.error('Error fetching flower:', error);
    res.status(500).json({ 
      message: 'Failed to fetch flower', 
      error: error.message 
    });
  }
};