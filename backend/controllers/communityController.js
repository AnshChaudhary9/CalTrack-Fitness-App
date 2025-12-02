const CommunityPost = require('../models/CommunityPost');

const getPosts = async (req, res) => {
  try {
    const { type, sort, limit } = req.query;
    let query = { isPublic: true };

    if (type) query.type = type;

    let sortOption = { createdAt: -1 };
    if (sort === 'popular') sortOption = { views: -1, likes: -1 };
    if (sort === 'recent') sortOption = { createdAt: -1 };

    const posts = await CommunityPost.find(query)
      .populate('user', 'name profilePicture rank')
      .populate('likes', 'name')
      .populate({
        path: 'comments.user',
        select: 'name profilePicture'
      })
      .sort(sortOption)
      .limit(parseInt(limit) || 20);

    if (posts.length > 0 && posts[0].comments && posts[0].comments.length > 0) {
      console.log('Sample comment user:', {
        comment: posts[0].comments[0],
        user: posts[0].comments[0].user,
        userType: typeof posts[0].comments[0].user,
        hasName: posts[0].comments[0].user?.name
      });
    }

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id)
      .populate('user', 'name profilePicture rank bio')
      .populate('likes', 'name profilePicture')
      .populate('comments.user', 'name profilePicture');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.views += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPost = async (req, res) => {
  try {
    const post = await CommunityPost.create({
      ...req.body,
      user: req.user._id,
    });

    const populatedPost = await CommunityPost.findById(post._id)
      .populate('user', 'name profilePicture rank');

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleLike = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.findIndex(
      (id) => id.toString() === req.user._id.toString()
    );

    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    res.json({ message: 'Like toggled', post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      user: req.user._id,
      content,
      createdAt: new Date(),
    });

    await post.save();

    const populatedPost = await CommunityPost.findById(post._id)
      .populate('user', 'name profilePicture rank')
      .populate('likes', 'name')
      .populate({
        path: 'comments.user',
        select: 'name profilePicture'
      });

    res.json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find({ user: req.user._id })
      .populate('user', 'name profilePicture rank')
      .populate('likes', 'name')
      .populate({
        path: 'comments.user',
        select: 'name profilePicture'
      })
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    if (!postId) {
      return res.status(400).json({ message: 'Post ID is required' });
    }

    const post = await CommunityPost.findOne({
      _id: postId,
      user: userId,
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  toggleLike,
  addComment,
  getMyPosts,
  deletePost,
};

