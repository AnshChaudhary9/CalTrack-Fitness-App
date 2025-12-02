import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { 
  Award, 
  Trophy, 
  TrendingUp, 
  Target,
  User,
  Mail,
  MapPin,
  Calendar,
  Loader,
  Star,
  Medal,
  Camera,
  X
} from 'lucide-react';

const Profile = () => {
  const { user: authUser, updateUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalCaloriesBurned: 0,
    totalCaloriesConsumed: 0,
    currentStreak: 0,
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchBadges();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
      if (res.data.profilePicture) {
        setProfilePicturePreview(res.data.profilePicture);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBadges = async () => {
    try {
      const res = await api.get('/badges/my-badges');
      setBadges(res.data.badges || []);
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const workoutsRes = await api.get('/workouts');
      const dietRes = await api.get('/diet');
      
      const totalWorkouts = workoutsRes.data.length;
      const totalCaloriesBurned = workoutsRes.data.reduce((sum, w) => sum + (w.calories || 0), 0);
      const totalCaloriesConsumed = dietRes.data.reduce((sum, d) => sum + (d.calories || 0), 0);
      
      setStats({
        totalWorkouts,
        totalCaloriesBurned,
        totalCaloriesConsumed,
        currentStreak: 0, // Calculate streak logic here
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePictureUpload = async () => {
    if (!profilePicture) return;
    
    setUploading(true);
    try {
      const res = await api.put('/auth/profile', {
        profilePicture: profilePicture,
      });
      updateUser({ profilePicture: res.data.profilePicture });
      setUser({ ...user, profilePicture: res.data.profilePicture });
      setProfilePicturePreview(res.data.profilePicture);
      setProfilePicture(null); // Clear the temporary state
      alert('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert(error.response?.data?.message || 'Error uploading profile picture');
    } finally {
      setUploading(false);
    }
  };

  const removeProfilePicture = () => {
    setProfilePicture(null);
    setProfilePicturePreview(user?.profilePicture || null);
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 'Bronze':
        return 'bg-orange-600 text-white border-orange-600';
      case 'Silver':
        return 'bg-gray-400 text-white border-gray-400';
      case 'Gold':
        return 'bg-yellow-500 text-white border-yellow-500';
      case 'Platinum':
        return 'bg-cyan-500 text-white border-cyan-500';
      case 'Diamond':
        return 'bg-purple-600 text-white border-purple-600';
      default:
        return 'bg-gray-600 text-white border-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader className="w-8 h-8 animate-spin text-[#1F1F1F]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white border-2 border-gray-200 rounded-lg shadow-lg p-8 mb-6 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              {profilePicturePreview ? (
                <img
                  src={profilePicturePreview}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#1F1F1F]"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-[#1F1F1F] flex items-center justify-center text-white text-4xl font-bold border-4 border-[#1F1F1F]">
                  {user?.name?.charAt(0).toUpperCase() || authUser?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-[#1F1F1F] text-white p-2 rounded-full cursor-pointer hover:bg-gray-800 transition-colors">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
              </label>
            </div>
            {profilePicture && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleProfilePictureUpload}
                  disabled={uploading}
                  className="bg-[#1F1F1F] text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Save Picture'}
                </button>
                <button
                  onClick={removeProfilePicture}
                  className="bg-gray-200 text-[#1F1F1F] px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            )}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2 text-[#1F1F1F]">
                {user?.name || authUser?.name}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{user?.email || authUser?.email}</span>
              </div>
              {user?.location && (
                <div className="flex items-center justify-center md:justify-start gap-2 mb-4 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>
              )}
              {user?.bio && (
                <p className="mb-4 text-gray-700">
                  {user.bio}
                </p>
              )}
              <div className="flex items-center justify-center md:justify-start gap-4">
                <div className={`px-4 py-2 rounded-lg border-2 ${getRankColor(user?.rank || 'Bronze')} font-bold flex items-center gap-2`}>
                  <Medal className="w-5 h-5" />
                  {user?.rank || 'Bronze'}
                </div>
                <div className="px-4 py-2 rounded-lg bg-gray-100 text-[#1F1F1F] font-semibold flex items-center gap-2 border-2 border-gray-300">
                  <Star className="w-5 h-5 text-yellow-600" />
                  {user?.totalPoints || 0} Points
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white border-2 border-gray-200 p-6 rounded-lg hover:border-[#1F1F1F] transition-all duration-300 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#1F1F1F] flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1 text-[#1F1F1F]">
              {stats.totalWorkouts}
            </div>
            <div className="text-sm text-gray-600">
              Total Workouts
            </div>
          </div>
          <div className="bg-white border-2 border-gray-200 p-6 rounded-lg hover:border-[#1F1F1F] transition-all duration-300 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#1F1F1F] flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1 text-[#1F1F1F]">
              {stats.totalCaloriesBurned.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">
              Calories Burned
            </div>
          </div>
          <div className="bg-white border-2 border-gray-200 p-6 rounded-lg hover:border-[#1F1F1F] transition-all duration-300 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#1F1F1F] flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1 text-[#1F1F1F]">
              {stats.totalCaloriesConsumed.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">
              Calories Consumed
            </div>
          </div>
          <div className="bg-white border-2 border-gray-200 p-6 rounded-lg hover:border-[#1F1F1F] transition-all duration-300 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#1F1F1F] flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1 text-[#1F1F1F]">
              {badges.length}
            </div>
            <div className="text-sm text-gray-600">
              Badges Earned
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="bg-white border-2 border-gray-200 rounded-lg shadow-lg p-8 animate-fade-in">
          <h2 className="text-3xl font-bold mb-6 text-[#1F1F1F]">
            Badges & Achievements
          </h2>
          {badges.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Award className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl font-semibold mb-2">No badges yet</p>
              <p>Complete challenges and achieve goals to earn badges!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {badges.map((badgeItem, index) => {
                const badge = badgeItem.badge;
                return (
                  <div
                    key={badge?._id || index}
                    className="bg-gray-50 border-2 border-gray-200 p-6 rounded-lg text-center hover:border-[#1F1F1F] transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="text-5xl mb-3">{badge?.icon || '🏆'}</div>
                    <h3 className="font-bold mb-1 text-[#1F1F1F]">
                      {badge?.name || 'Badge'}
                    </h3>
                    <p className="text-xs mb-2 text-gray-600">
                      {badge?.description || ''}
                    </p>
                    <div className="text-xs px-2 py-1 rounded bg-white text-gray-700 border border-gray-300">
                      {badge?.category || 'Achievement'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
