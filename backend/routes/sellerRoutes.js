const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const {
  addFlower,
  getMyFlowers,
  deleteFlower,
} = require('../controllers/sellerController');
const authenticate = require('../middleWare/authenticate');
const checkRole = require('../middleWare/checkRole'); // make sure this checks "seller"

router.post('/add-flower', authenticate, checkRole('seller'), upload.single('image'), addFlower);
router.get('/my-flowers', authenticate, checkRole('seller'), getMyFlowers);
router.delete('/delete-flower/:id', authenticate, checkRole('seller'), deleteFlower);

module.exports = router;
