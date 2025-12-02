const express = require('express');
const router = express.Router();
const {
  getUserGoals,
  createOrUpdateUserGoals,
} = require('../controllers/userGoalsController');
const { protect } = require('../middleware/auth');

router.route('/goals')
  .get(protect, getUserGoals)
  .post(protect, createOrUpdateUserGoals);

module.exports = router;

