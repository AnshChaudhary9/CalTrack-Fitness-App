import { useState, useEffect, useContext, useRef } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { 
  Search, 
  Filter, 
  Heart, 
  MessageCircle, 
  Share2, 
  TrendingUp,
  Activity,
  Award,
  Lightbulb,
  Route,
  Loader,
  Plus,
  Image as ImageIcon,
  X,
  Trash2,
  ChevronDown,
  MapPin,
  Gauge,
  Clock
} from 'lucide-react';

const Community = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExploreDropdown, setShowExploreDropdown] = useState(false);
  const [showMyPosts, setShowMyPosts] = useState(false);
  const exploreDropdownRef = useRef(null);
  const [postForm, setPostForm] = useState({
    type: 'Workout',
    title: '',
    content: '',
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [commentTexts, setCommentTexts] = useState({});
  const [commenting, setCommenting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [filterType, sortBy, showMyPosts]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exploreDropdownRef.current && !exploreDropdownRef.current.contains(event.target)) {
        setShowExploreDropdown(false);
      }
    };

    if (showExploreDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExploreDropdown]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let res;
      if (showMyPosts) {
        res = await api.get('/community/my-posts');
      } else {
        const params = new URLSearchParams();
        if (filterType) params.append('type', filterType);
        if (sortBy) params.append('sort', sortBy);
        res = await api.get(`/community?${params.toString()}`);
      }
      setPosts(res.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await api.put(`/community/${postId}/like`);
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    try {
      await api.delete(`/community/${postId}`);
      fetchPosts();
    } catch (error) {
      console.error('Delete error:', error);
      alert(error.response?.data?.message || error.message || 'Error deleting post');
    }
  };

  const handleComment = async (postId) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
    } else {
      setExpandedPostId(postId);
    }
  };

  const handleAddComment = async (e, postId) => {
    e.preventDefault();
    const commentText = commentTexts[postId] || '';
    if (!commentText.trim()) return;
    
    setCommenting(true);
    try {
      const response = await api.post(`/community/${postId}/comment`, { content: commentText });
      const updatedPost = response.data;
      
      // Update the specific post in the posts array with the populated comment data
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? updatedPost : post
        )
      );
      
      setCommentTexts({ ...commentTexts, [postId]: '' });
    } catch (error) {
      console.error('Error adding comment:', error);
      alert(error.response?.data?.message || 'Error adding comment');
    } finally {
      setCommenting(false);
    }
  };

  const handleShare = async (postId) => {
    const postUrl = `${window.location.origin}/community/${postId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this post on CalTrack',
          text: 'Check out this post on CalTrack',
          url: postUrl,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          // Fallback to clipboard
          navigator.clipboard.writeText(postUrl);
          alert('Post link copied to clipboard!');
        }
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(postUrl);
      alert('Post link copied to clipboard!');
    }
  };


  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = [];
    const newImages = [];

    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result);
          newImages.push(reader.result);
          if (newPreviews.length === files.length) {
            setImagePreviews([...imagePreviews, ...newPreviews]);
            setPostForm({ ...postForm, images: [...postForm.images, ...newImages] });
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    const newImages = postForm.images.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
    setPostForm({ ...postForm, images: newImages });
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await api.post('/community', postForm);
      setShowCreateModal(false);
      setPostForm({ type: 'Workout', title: '', content: '', images: [] });
      setImagePreviews([]);
      fetchPosts();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating post');
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now - postDate) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minute${Math.floor(diffInSeconds / 60) !== 1 ? 's' : ''} ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hour${Math.floor(diffInSeconds / 3600) !== 1 ? 's' : ''} ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} day${Math.floor(diffInSeconds / 86400) !== 1 ? 's' : ''} ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} week${Math.floor(diffInSeconds / 604800) !== 1 ? 's' : ''} ago`;
    return `${Math.floor(diffInSeconds / 2592000)} month${Math.floor(diffInSeconds / 2592000) !== 1 ? 's' : ''} ago`;
  };

  const getActivitySummary = (post) => {
    if (post.workoutData) {
      const { type, distance, duration } = post.workoutData;
      if ((type === 'Cycling' || type === 'Running') && distance) {
        return `rode ${distance.toFixed(2)} miles`;
      }
      if (duration) {
        const totalMinutes = Math.floor(duration);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const seconds = Math.floor((duration - totalMinutes) * 60);
        if (hours > 0) {
          return `did a ${type?.toLowerCase() || 'workout'} for ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `did a ${type?.toLowerCase() || 'workout'} for ${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
      return `did a ${type?.toLowerCase() || 'workout'}`;
    }
    return 'shared a post';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const filteredPosts = posts.filter(post =>
    searchQuery === '' ||
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header with Explore dropdown */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 relative">
            <div className="relative" ref={exploreDropdownRef}>
              <button 
                onClick={() => setShowExploreDropdown(!showExploreDropdown)}
                className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-[#1F1F1F] transition-all bg-white text-[#1F1F1F] font-semibold"
              >
                Explore
                <ChevronDown className={`w-4 h-4 transition-transform ${showExploreDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showExploreDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => {
                      setShowMyPosts(false);
                      setShowExploreDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                      !showMyPosts ? 'bg-gray-50 font-semibold' : ''
                    }`}
                  >
                    All Posts
                  </button>
                  <button
                    onClick={() => {
                      setShowMyPosts(true);
                      setShowExploreDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                      showMyPosts ? 'bg-gray-50 font-semibold' : ''
                    }`}
                  >
                    My Posts
                  </button>
                </div>
              )}
            </div>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-[#1F1F1F] text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-all duration-200 font-semibold"
          >
            <Plus className="w-5 h-5" />
            Create Post
          </button>
        </div>

        {/* Posts Feed - Single Column */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl font-semibold mb-2">No posts found</p>
            <p>Be the first to share something with the community!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post, index) => (
              <div
                key={post._id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Post Header */}
                <div className="p-4 pb-3 relative">
                  <div className="flex items-center gap-3 mb-2">
                    {/* Profile Picture */}
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      {post.user?.profilePicture ? (
                        <img 
                          src={post.user.profilePicture} 
                          alt={post.user?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold">
                          {post.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                    
                    {/* User Info and Activity Summary */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[#1F1F1F] text-sm">
                        {post.user?.name?.toLowerCase() || 'User'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {getActivitySummary(post)}
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  {user && post.user?._id && String(post.user._id) === String(user._id) && (
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-red-600 transition-colors"
                      title="Delete post"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Post Content */}
                <div className="px-4 pb-3">
                  <p className="text-[#1F1F1F] text-sm leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>
                </div>

                {/* Main Image */}
                {post.images && post.images.length > 0 && (
                  <div className="relative w-full">
                    <img
                      src={post.images[0]}
                      alt="Post"
                      className="w-full h-auto object-cover"
                      style={{ maxHeight: '500px' }}
                    />
                  </div>
                )}

                {/* Statistics and Map Section */}
                {post.workoutData && (
                  <div className="px-4 py-3 border-t border-gray-200">
                    <div className="flex items-start gap-6">
                      {/* Statistics */}
                      <div className="flex-1 space-y-2">
                        {post.workoutData.distance && (
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-[#1F1F1F]">
                              {post.workoutData.distance.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-600">Distance (mi)</span>
                          </div>
                        )}
                        {post.workoutData.avgSpeed && (
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-[#1F1F1F]">
                              {post.workoutData.avgSpeed.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-600">Avg Speed (mph)</span>
                          </div>
                        )}
                        {post.workoutData.duration && !post.workoutData.distance && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-600">
                              {Math.floor(post.workoutData.duration / 60)}:{(post.workoutData.duration % 60).toString().padStart(2, '0')}
                            </span>
                          </div>
                        )}
                        {post.workoutData.calories && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                              {post.workoutData.calories} calories
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Map Placeholder */}
                      {post.routeData && (
                        <div className="w-32 h-24 bg-gray-100 rounded border border-gray-300 flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Engagement Footer */}
                <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(post._id)}
                      className="flex items-center gap-1.5 text-gray-600 hover:text-red-500 transition-colors"
                    >
                      <Heart className={`w-5 h-5 ${post.likes?.some(like => String(like._id || like) === String(user?._id)) ? 'fill-red-500 text-red-500' : ''}`} />
                      <span className="text-sm font-medium">
                        {post.likes?.length || 0} {post.likes?.length === 1 ? 'liked' : 'liked'} this
                      </span>
                    </button>
                    <button
                      onClick={() => handleComment(post._id)}
                      className="flex items-center gap-1.5 text-gray-600 hover:text-blue-500 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">{post.comments?.length || 0}</span>
                    </button>
                    <button
                      onClick={() => handleShare(post._id)}
                      className="flex items-center gap-1.5 text-gray-600 hover:text-green-500 transition-colors"
                      title="Share post"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatTimeAgo(post.createdAt)}
                  </span>
                </div>

                {/* Comments Section */}
                {expandedPostId === post._id && (
                  <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                    {/* Existing Comments */}
                    <div className="space-y-3 mb-4">
                      {post.comments && post.comments.length > 0 ? (
                        post.comments.map((comment, idx) => {
                          // Handle both populated and unpopulated comment user
                          // Populated user will be an object with name/profilePicture properties
                          // Unpopulated will be a string (ObjectId) or object with only _id
                          let commentUser = null;
                          let userName = 'User';
                          let userProfilePic = null;
                          
                          if (comment.user) {
                            // Check if it's a populated user object (has name property)
                            if (typeof comment.user === 'object' && comment.user !== null && comment.user.name) {
                              commentUser = comment.user;
                              userName = commentUser.name;
                              userProfilePic = commentUser.profilePicture || null;
                            } else if (typeof comment.user === 'string') {
                              // Unpopulated ObjectId string - can't display name/pic
                              console.warn('Comment user not populated (ObjectId string):', comment.user);
                            } else {
                              // Might be an object but not populated
                              console.warn('Comment user object but missing name:', comment.user);
                            }
                          }
                          
                          return (
                            <div key={idx} className="flex gap-3">
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                {userProfilePic ? (
                                  <img 
                                    src={userProfilePic} 
                                    alt={userName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold text-sm">
                                    {userName?.charAt(0)?.toUpperCase() || 'U'}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-sm text-[#1F1F1F]">
                                    {userName}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {formatTimeAgo(comment.createdAt || comment.date || new Date())}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                  {comment.content}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-2">No comments yet. Be the first to comment!</p>
                      )}
                    </div>

                    {/* Add Comment Form */}
                    <form onSubmit={(e) => handleAddComment(e, post._id)} className="flex gap-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        {user?.profilePicture ? (
                          <img 
                            src={user.profilePicture} 
                            alt={user?.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold text-sm">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={commentTexts[post._id] || ''}
                          onChange={(e) => setCommentTexts({ ...commentTexts, [post._id]: e.target.value })}
                          className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] bg-white text-[#1F1F1F] text-sm"
                          placeholder="Write a comment..."
                        />
                        <button
                          type="submit"
                          disabled={commenting || !(commentTexts[post._id] || '').trim()}
                          className="px-4 py-2 bg-[#1F1F1F] text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
                        >
                          {commenting ? 'Posting...' : 'Post'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Create Post Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-[#1F1F1F]/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#1F1F1F]">Create Post</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="block mb-2 font-semibold text-[#1F1F1F]">Type</label>
                  <select
                    value={postForm.type}
                    onChange={(e) => setPostForm({ ...postForm, type: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] bg-white text-[#1F1F1F]"
                    required
                  >
                    <option value="Workout">Workout</option>
                    <option value="Achievement">Achievement</option>
                    <option value="Tip">Tip</option>
                    <option value="Question">Question</option>
                    <option value="Motivation">Motivation</option>
                    <option value="Route">Route</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-[#1F1F1F]">Title</label>
                  <input
                    type="text"
                    value={postForm.title}
                    onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] bg-white text-[#1F1F1F]"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-[#1F1F1F]">Content</label>
                  <textarea
                    value={postForm.content}
                    onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] bg-white text-[#1F1F1F]"
                    rows="4"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-[#1F1F1F]">Images (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] bg-white text-[#1F1F1F]"
                  />
                  {imagePreviews.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-[#1F1F1F] text-white p-1 rounded-full hover:bg-gray-800 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setPostForm({ type: 'Workout', title: '', content: '', images: [] });
                      setImagePreviews([]);
                    }}
                    className="flex-1 px-6 py-3 rounded-lg font-semibold bg-gray-200 text-[#1F1F1F] hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 rounded-lg font-semibold bg-[#1F1F1F] text-white hover:bg-gray-800 transition-colors"
                  >
                    Create Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;

