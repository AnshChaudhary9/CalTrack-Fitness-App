const express = require('express');
const router = express.Router();
const {
  getWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getWorkoutStats,
  toggleWorkoutCompletion,
  getMyWorkouts,
  addSuggestedToMyWorkouts,
} = require('../controllers/workoutController');
const { getSuggestedWorkouts } = require('../controllers/suggestedWorkoutController');
const { protect } = require('../middleware/auth');

// Specific routes first
router.get('/suggested', protect, getSuggestedWorkouts);
router.get('/my', protect, getMyWorkouts);
router.post('/my/add-suggested', protect, addSuggestedToMyWorkouts);

// Base routes
router.route('/').get(protect, getWorkouts).post(protect, createWorkout);
router.route('/stats').get(protect, getWorkoutStats);

// Parameterized routes last
router.route('/:id/complete').put(protect, toggleWorkoutCompletion);
router.route('/:id').get(protect, getWorkout).put(protect, updateWorkout).delete(protect, deleteWorkout);

module.exports = router;

