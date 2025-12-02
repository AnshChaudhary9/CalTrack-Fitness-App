const express = require('express');
const router = express.Router();
const {
  getWorkoutLeaderboard,
  getCalorieLeaderboard,
} = require('../controllers/leaderboardController');
const { protect } = require('../middleware/auth');

router.get('/workouts', protect, getWorkoutLeaderboard);
router.get('/calories', protect, getCalorieLeaderboard);

module.exports = router;

