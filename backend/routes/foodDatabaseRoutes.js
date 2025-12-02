const express = require('express');
const router = express.Router();
const {
  searchFoods,
  getFood,
  createFood,
  getPopularFoods,
} = require('../controllers/foodDatabaseController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, searchFoods).post(protect, createFood);
router.get('/popular', protect, getPopularFoods);
router.get('/:id', protect, getFood);

module.exports = router;

