const express = require('express');
const router = express.Router();
const flowerController = require('../controllers/flowerController');
const { authenticateJWT, authorizeRoles } = require('../middleWare/auth');
const parser = require('../middleWare/multer');

// Seller adds a flower (with image)
router.post(
  '/add',
  authenticateJWT,
  authorizeRoles('seller'),
  parser.single('image'),
  (req, res, next) => {
    console.log('✅ Route hit, file:', req.file);
    next();
  },
  flowerController.addFlower
);

// Seller views their flowers
router.get(
  '/my-flowers',
  authenticateJWT,
  authorizeRoles('seller'),
  flowerController.getMyFlowers
);

// Delete flower (optional)
router.delete(
  '/delete/:id',
  authenticateJWT,
  authorizeRoles('seller'),
  flowerController.deleteFlower
);
router.get(
  '/all',
  flowerController.getAllFlowers // No auth, accessible to all
);

module.exports = router;
