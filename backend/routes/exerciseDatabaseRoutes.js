const express = require('express');
const router = express.Router();
const {
  searchExercises,
  getExercise,
  createExercise,
  getPopularExercises,
  seedExerciseDatabase,
} = require('../controllers/exerciseDatabaseController');
const { protect } = require('../middleware/auth');

router.post('/seed', protect, seedExerciseDatabase);
router.get('/popular', protect, getPopularExercises);

// Base routes
router.route('/').get(protect, searchExercises).post(protect, createExercise);

// Parameterized routes last
router.get('/:id', protect, getExercise);

module.exports = router;

