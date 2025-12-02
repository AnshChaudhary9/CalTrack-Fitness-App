const express = require('express');
const router = express.Router();
const {
  getChallenges,
  getChallenge,
  createChallenge,
  joinChallenge,
  updateProgress,
  getMyChallenges,
  recalculateProgress,
  recalculateAllProgress,
  deleteAllChallenges,
} = require('../controllers/challengeController');
const { protect } = require('../middleware/auth');

router.get('/my-challenges', protect, getMyChallenges);
router.post('/recalculate-all', protect, recalculateAllProgress);
router.delete('/delete-all', protect, deleteAllChallenges);

router.route('/')
  .get(protect, getChallenges)
  .post(protect, createChallenge);

router.get('/:id', protect, getChallenge);
router.post('/:id/join', protect, joinChallenge);
router.post('/:id/recalculate', protect, recalculateProgress);
router.put('/:id/progress', protect, updateProgress);

module.exports = router;

