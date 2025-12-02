const express = require('express');
const router = express.Router();
const {
  getDietEntries,
  getDietEntry,
  createDietEntry,
  updateDietEntry,
  deleteDietEntry,
  getDailySummary,
} = require('../controllers/dietController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getDietEntries).post(protect, createDietEntry);
router.route('/summary').get(protect, getDailySummary);
router.route('/:id').get(protect, getDietEntry).put(protect, updateDietEntry).delete(protect, deleteDietEntry);

module.exports = router;

