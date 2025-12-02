const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPost,
  createPost,
  toggleLike,
  addComment,
  getMyPosts,
  deletePost,
} = require('../controllers/communityController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getPosts).post(protect, createPost);
router.get('/my-posts', protect, getMyPosts);
router.put('/:id/like', protect, toggleLike);
router.post('/:id/comment', protect, addComment);
router.get('/:id', protect, getPost);
router.delete('/:id', protect, deletePost);

module.exports = router;

