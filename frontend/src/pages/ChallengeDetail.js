import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { 
  Target, 
  Calendar, 
  Clock,
  Award,
  ArrowLeft,
  Loader,
  CheckCircle2,
  Trophy
} from 'lucide-react';

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [promoEmail, setPromoEmail] = useState(false);

  useEffect(() => {
    fetchChallenge();
  }, [id]);

  // Listen for workout completion events to refresh challenge progress
  useEffect(() => {
    const handleWorkoutCompleted = () => {
      console.log('Workout completed event received, refreshing challenge...');
      fetchChallenge(); // Refresh challenge to get updated progress
    };

    window.addEventListener('workoutCompleted', handleWorkoutCompleted);
    
    return () => {
      window.removeEventListener('workoutCompleted', handleWorkoutCompleted);
    };
  }, [id]); // Re-setup listener if challenge ID changes

  const fetchChallenge = async () => {
    try {
      const res = await api.get(`/challenges/${id}`);
      setChallenge(res.data);
    } catch (error) {
      console.error('Error fetching challenge:', error);
      alert('Challenge not found');
      navigate('/challenges');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinChallenge = async () => {
    if (!challenge) return;
    
    setJoining(true);
    try {
      await api.post(`/challenges/${challenge._id}/join`);
      alert('Successfully joined challenge!');
      fetchChallenge(); // Refresh to get updated participant data
    } catch (error) {
      alert(error.response?.data?.message || 'Error joining challenge');
    } finally {
      setJoining(false);
    }
  };

  const getDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getDaysUntilStart = (startDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const diffTime = start - today;
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

  const getParticipant = () => {
    if (!user || !challenge?.participants) return null;
    const userId = user._id || user.id;
    return challenge.participants.find(
      (p) => {
        const participantUserId = p.user?._id || p.user;
        return String(participantUserId) === String(userId);
      }
    );
  };

  const participant = getParticipant();
  const isJoined = !!participant;
  const progress = participant ? Math.min((participant.progress / challenge?.targetValue) * 100, 100) : 0;
  const daysRemaining = challenge ? getDaysRemaining(challenge.endDate) : 0;
  const daysUntilStart = challenge ? getDaysUntilStart(challenge.startDate) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader className="w-8 h-8 animate-spin text-[#1F1F1F]" />
      </div>
    );
  }

  if (!challenge) {
    return null;
  }

  // Generate milestones based on challenge target
  const generateMilestones = () => {
    const milestones = [];
    const target = challenge.targetValue;
    
    // For challenges with target >= 12, create milestones like 2, 4, 6, 8, 10, 12
    if (target >= 12) {
      const step = Math.max(2, Math.floor(target / 6));
      for (let i = step; i <= target; i += step) {
        if (i <= target) {
          milestones.push(i);
        }
      }
      // Ensure the final target is included
      if (milestones[milestones.length - 1] !== target) {
        milestones.push(target);
      }
      return milestones.slice(0, 6); // Limit to 6 milestones
    } else {
      // For smaller targets, create proportional milestones
      const step = Math.max(1, Math.floor(target / 6));
      for (let i = step; i <= target; i += step) {
        milestones.push(i);
      }
      if (milestones[milestones.length - 1] !== target) {
        milestones.push(target);
      }
      return milestones.slice(0, 6);
    }
  };

  const milestones = generateMilestones();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner Section */}
      <div 
        className="relative h-96 bg-gradient-to-br from-red-500 to-red-700 overflow-hidden"
        style={{
          backgroundImage: challenge.image ? `url(${challenge.image})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {!challenge.image && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Target className="w-32 h-32 text-white opacity-30" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <Link
            to="/challenges"
            className="bg-white/90 hover:bg-white text-[#1F1F1F] px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>

        {/* Challenge Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/70 to-transparent">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {challenge.title.toUpperCase()}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Challenge Goal */}
            <div className="mb-6">
              <p className="text-lg text-gray-700 mb-2 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#1F1F1F]" />
                {getChallengeGoalText(challenge)} on MapMyFitness between {new Date(challenge.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} and {new Date(challenge.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(challenge.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} - {new Date(challenge.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                {daysUntilStart > 0 ? (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Starts in {daysUntilStart} day{daysUntilStart !== 1 ? 's' : ''}
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Ends in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Challenge Overview */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1F1F1F]">CHALLENGE OVERVIEW</h2>
              <div className="space-y-4 text-gray-700">
                <p>{challenge.description}</p>
                {challenge.requirements && challenge.requirements.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Requirements:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {challenge.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Rules Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1F1F1F]">RULES</h2>
              <ul className="space-y-2 text-gray-700">
                <li>• You must complete {challenge.targetValue} {challenge.unit} to satisfy the challenge goal.</li>
                <li>• All workouts count toward your challenge goal.</li>
                <li>• Each recorded activity must be at least five minutes in duration.</li>
                <li>• A maximum of one workout per day will count toward the challenge.</li>
                <li>• Holiday cheer optional (but encouraged).</li>
              </ul>
            </div>

            {/* Prizes Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#1F1F1F]">PRIZES</h2>
              <p className="text-gray-700 mb-2">
                Complete {challenge.targetValue} {challenge.unit} during the challenge period to earn a Challenge Completion badge to showcase your achievement on MapMyFitness.
                {challenge.badgeReward && (
                  <span className="font-semibold"> As a bonus, all challenge participants get an exclusive 20% off code from Competitive Cyclist to use on one full-priced item!</span>
                )}
              </p>
              <a href="#" className="text-blue-600 hover:underline text-sm">
                View Full Legal Rules &gt;
              </a>
            </div>

            {/* Progress Section (if joined) */}
            {isJoined && (
              <div className="mb-8 p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
                <h3 className="text-xl font-bold mb-4 text-[#1F1F1F]">Your Progress</h3>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">
                      Progress: {participant?.progress || 0} / {challenge.targetValue} {challenge.unit}
                    </span>
                    <span className="font-bold text-[#1F1F1F]">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full rounded-full h-3 bg-gray-200">
                    <div
                      className="h-3 rounded-full bg-[#1F1F1F] transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                {participant?.completed && (
                  <div className="flex items-center gap-2 text-green-600 font-semibold">
                    <CheckCircle2 className="w-5 h-5" />
                    Challenge Completed!
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Join Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Disclaimer */}
              <p className="text-xs text-gray-500 mb-4">
                By joining the Challenge, I acknowledge the MapMyFitness{' '}
                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>, the MapMyFitness{' '}
                <a href="#" className="text-blue-600 hover:underline">Terms & Conditions</a> and the{' '}
                <a href="#" className="text-blue-600 hover:underline">Official Challenge Rules</a>.
              </p>

              {/* Join Button */}
              {!isJoined ? (
                <div>
                  <button
                    onClick={handleJoinChallenge}
                    disabled={joining}
                    className="w-full bg-[#1F1F1F] text-white px-6 py-4 rounded-lg hover:bg-gray-800 transition-all duration-200 font-bold uppercase text-sm mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {joining ? 'Joining...' : 'Join Challenge'}
                  </button>
                  
                  {/* Promotional Email Checkbox */}
                  <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={promoEmail}
                      onChange={(e) => setPromoEmail(e.target.checked)}
                      className="mt-1"
                    />
                    <span>Yes, I wish to receive promotional emails from the challenge sponsor.</span>
                  </label>
                </div>
              ) : (
                <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
                    <CheckCircle2 className="w-5 h-5" />
                    You've joined this challenge!
                  </div>
                  <p className="text-sm text-gray-700">
                    Keep logging your activities to complete the challenge and earn your badge.
                  </p>
                </div>
              )}

              {/* Milestones Section */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4 text-[#1F1F1F]">MILESTONES</h3>
                {/* First milestone - larger, highlighted */}
                {milestones.length > 0 && (
                  <div className="mb-4">
                    <div className="bg-[#1F1F1F] text-white p-6 rounded-lg text-center border-2 border-red-500">
                      {challenge.badgeReward && (
                        <div className="text-xs mb-2 opacity-75 font-semibold">
                          {challenge.badgeReward.name?.toUpperCase() || 'BADGE'}
                        </div>
                      )}
                      <div className="text-4xl font-bold mb-1">{milestones[0]}</div>
                      <div className="text-sm opacity-75">
                        {challenge.unit === 'workouts' ? 'ACTIVITIES' : challenge.unit.toUpperCase()}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Join to earn {milestones[0]} {challenge.unit === 'workouts' ? 'Activities' : challenge.unit}
                    </p>
                  </div>
                )}
                
                {/* Remaining milestones */}
                {milestones.length > 1 && (
                  <div className="grid grid-cols-3 gap-3">
                    {milestones.slice(1).map((milestone, idx) => {
                      const isCompleted = participant && participant.progress >= milestone;
                      return (
                        <div
                          key={idx + 1}
                          className={`p-4 rounded-lg text-center border-2 ${
                            isCompleted
                              ? 'bg-[#1F1F1F] text-white border-[#1F1F1F]'
                              : 'bg-white text-[#1F1F1F] border-gray-300'
                          }`}
                        >
                          {challenge.badgeReward && (
                            <div className={`text-xs mb-1 ${isCompleted ? 'opacity-75' : 'opacity-50'}`}>
                              {challenge.badgeReward.name?.toUpperCase() || 'BADGE'}
                            </div>
                          )}
                          <div className="text-2xl font-bold">{milestone}</div>
                          <div className={`text-xs mt-1 ${isCompleted ? 'opacity-75' : 'opacity-50'}`}>
                            {challenge.unit === 'workouts' ? 'ACTIVITIES' : challenge.unit.toUpperCase()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Badge Reward */}
              {challenge.badgeReward && (
                <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-yellow-600" />
                    <span className="font-semibold text-yellow-700">Badge Reward</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    {challenge.badgeReward.name}
                  </p>
                  {challenge.badgeReward.description && (
                    <p className="text-xs text-yellow-600 mt-1">
                      {challenge.badgeReward.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail;

