import { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { 
  Target, 
  Trophy, 
  Users, 
  Calendar, 
  Award,
  Filter,
  Loader,
  CheckCircle2,
  Clock,
  TrendingUp,
  Trash2
} from 'lucide-react';

const Challenges = () => {
  const { user } = useContext(AuthContext);
  const [challenges, setChallenges] = useState([]);
  const [myChallenges, setMyChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterType, setFilterType] = useState('');

  const fetchChallenges = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.append('isActive', 'true');
      if (filterDifficulty) params.append('difficulty', filterDifficulty);
      if (filterType) params.append('type', filterType);
      
      const res = await api.get(`/challenges?${params.toString()}`);
      setChallenges(res.data);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  }, [filterDifficulty, filterType]);

  const fetchMyChallenges = useCallback(async () => {
    try {
      const res = await api.get('/challenges/my-challenges');
      setMyChallenges(res.data);
    } catch (error) {
      console.error('Error fetching my challenges:', error);
    }
  }, []);

  useEffect(() => {
    fetchChallenges();
    fetchMyChallenges();
  }, [fetchChallenges, fetchMyChallenges]);

  // Listen for workout completion events to refresh challenges
  useEffect(() => {
    const handleWorkoutCompleted = () => {
      console.log('Workout completed event received, refreshing challenges...');
      // Refresh both all challenges and my challenges to update progress
      fetchChallenges();
      fetchMyChallenges();
    };

    window.addEventListener('workoutCompleted', handleWorkoutCompleted);
    
    return () => {
      window.removeEventListener('workoutCompleted', handleWorkoutCompleted);
    };
  }, [fetchChallenges, fetchMyChallenges]); // Use memoized functions as dependencies

  const handleJoinChallenge = async (challengeId) => {
    try {
      await api.post(`/challenges/${challengeId}/join`);
      fetchChallenges();
      fetchMyChallenges();
      alert('Successfully joined challenge!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error joining challenge');
    }
  };

  const handleDeleteAllChallenges = async () => {
    if (!window.confirm('Are you sure you want to delete ALL challenges? This action cannot be undone.')) {
      return;
    }
    try {
      const res = await api.delete('/challenges/delete-all');
      alert(`Successfully deleted ${res.data.deletedCount} challenge(s)`);
      fetchChallenges();
      fetchMyChallenges();
    } catch (error) {
      console.error('Delete all challenges error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error deleting challenges';
      alert(`Error: ${errorMessage}`);
    }
  };


  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Advanced':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'Expert':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getProgress = (challenge) => {
    if (!user || !challenge.participants) return 0;
    const participant = challenge.participants.find(
      (p) => {
        const userId = user._id || user.id;
        const participantUserId = p.user?._id || p.user;
        return String(participantUserId) === String(userId);
      }
    );
    if (!participant) return 0;
    return Math.min((participant.progress / challenge.targetValue) * 100, 100);
  };

  const getDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getChallengeGoalText = (challenge) => {
    if (challenge.type === 'Workout' && challenge.unit === 'workouts') {
      return `Log ${challenge.targetValue} activities`;
    } else if (challenge.type === 'Calorie' && challenge.unit === 'calories') {
      return `Log ${challenge.targetValue} calories`;
    } else if (challenge.type === 'Distance') {
      return `Log ${challenge.targetValue} ${challenge.unit}`;
    } else if (challenge.type === 'Duration') {
      return `Log ${challenge.targetValue} ${challenge.unit} of activity`;
    }
    return `Complete ${challenge.targetValue} ${challenge.unit}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader className="w-8 h-8 animate-spin text-[#1F1F1F]" />
      </div>
    );
  }

  const displayChallenges = activeTab === 'my' ? myChallenges : challenges;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-[#1F1F1F]">
            {activeTab === 'my' ? 'My Challenges' : 'Suggested'}
          </h1>
          <button 
            onClick={handleDeleteAllChallenges}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 font-semibold text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Delete All
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 border-2 ${
              activeTab === 'all'
                ? 'bg-[#1F1F1F] text-white border-[#1F1F1F]'
                : 'bg-white text-[#1F1F1F] border-gray-300 hover:border-[#1F1F1F]'
            }`}
          >
            All Challenges
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 border-2 ${
              activeTab === 'my'
                ? 'bg-[#1F1F1F] text-white border-[#1F1F1F]'
                : 'bg-white text-[#1F1F1F] border-gray-300 hover:border-[#1F1F1F]'
            }`}
          >
            My Challenges
          </button>
        </div>

        {/* Filters */}
        {activeTab === 'all' && (
          <div className="mb-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] transition-all duration-200 bg-white text-[#1F1F1F]"
              >
                <option value="">All Difficulties</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] transition-all duration-200 bg-white text-[#1F1F1F]"
            >
              <option value="">All Types</option>
              <option value="Workout">Workout</option>
              <option value="Calorie">Calorie</option>
              <option value="Distance">Distance</option>
              <option value="Duration">Duration</option>
            </select>
          </div>
        )}

        {/* Challenges Grid - Redesigned to match images */}
        {displayChallenges.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl font-semibold mb-2">No challenges found</p>
            <p>{activeTab === 'my' ? 'Join a challenge to get started!' : 'Check back later for new challenges!'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayChallenges.map((challenge, index) => {
              const userId = user?._id || user?.id;
              const participant = challenge.participants?.find(
                (p) => {
                  const participantUserId = p.user?._id || p.user;
                  return userId && String(participantUserId) === String(userId);
                }
              );
              const isJoined = !!participant;
              const daysRemaining = getDaysRemaining(challenge.endDate);
              
              return (
                <Link
                  key={challenge._id}
                  to={`/challenges/${challenge._id}`}
                  className="block"
                >
                  <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-[#1F1F1F] transition-all duration-300 cursor-pointer h-full flex flex-col">
                    {/* Banner Image Section */}
                    <div 
                      className="h-48 bg-gradient-to-br from-red-500 to-red-700 relative overflow-hidden"
                      style={{
                        backgroundImage: challenge.image ? `url(${challenge.image})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      {!challenge.image && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Target className="w-16 h-16 text-white opacity-50" />
                        </div>
                      )}
                      {participant?.completed && (
                        <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Completed
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-xl font-bold mb-2 text-[#1F1F1F] line-clamp-2">
                        {challenge.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Ends in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
                      </p>

                      <p className="text-sm text-gray-700 mb-4 line-clamp-2 flex-1">
                        {getChallengeGoalText(challenge)} on MapMyFitness between {new Date(challenge.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} and {new Date(challenge.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}.
                      </p>

                      {isJoined && (
                        <div className="mb-4">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">
                              Progress: {participant?.progress || 0} / {challenge.targetValue}
                            </span>
                            <span className="font-bold text-[#1F1F1F]">{getProgress(challenge).toFixed(1)}%</span>
                          </div>
                          <div className="w-full rounded-full h-2 bg-gray-200">
                            <div
                              className="h-2 rounded-full bg-[#1F1F1F] transition-all duration-500"
                              style={{ width: `${getProgress(challenge)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {!isJoined && activeTab === 'all' && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleJoinChallenge(challenge._id);
                          }}
                          className="w-full bg-[#1F1F1F] text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-all duration-200 font-bold uppercase text-sm mt-auto"
                        >
                          Join Challenge
                        </button>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Challenges;
