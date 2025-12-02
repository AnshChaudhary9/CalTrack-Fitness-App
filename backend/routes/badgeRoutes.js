const express = require('express');
const router = express.Router();
const {
  getBadges,
  getMyBadges,
  awardBadge,
} = require('../controllers/badgeController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getBadges);
router.get('/my-badges', protect, getMyBadges);
router.post('/award', protect, awardBadge);

module.exports = router;

