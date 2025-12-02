import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../utils/api';
import WorkoutGoalsModal from '../components/WorkoutGoalsModal';
import {
  Target,
  Settings,
  Plus,
  Clock,
  Flame,
  Dumbbell,
  Loader,
  AlertCircle,
  CheckCircle2,
  Activity,
} from 'lucide-react';

const SuggestedWorkouts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [suggestedWorkouts, setSuggestedWorkouts] = useState([]);
  const [userGoals, setUserGoals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [addingWorkoutId, setAddingWorkoutId] = useState(null);

  useEffect(() => {
    fetchUserGoals();
  }, []);

  useEffect(() => {
    if (userGoals !== null) {
      if (!userGoals) {
        // No goals set, show modal
        setShowGoalsModal(true);
        setLoading(false); // Stop loading even if no goals
      } else {
        // Goals exist, fetch suggested workouts
        fetchSuggestedWorkouts();
      }
    }
  }, [userGoals]);

  const fetchUserGoals = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/goals');
      setUserGoals(res.data);
      // If no goals, stop loading here
      if (!res.data) {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching user goals:', error);
      setUserGoals(null);
      setLoading(false); // Stop loading on error
    }
  };

  const fetchSuggestedWorkouts = async () => {
    try {
      setLoading(true);
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );
      
      const apiPromise = api.get('/workouts/suggested');
      const res = await Promise.race([apiPromise, timeoutPromise]);
      
      setSuggestedWorkouts(res.data || []);
    } catch (error) {
      console.error('Error fetching suggested workouts:', error);
      setSuggestedWorkouts([]);
      // Only show alert for non-timeout errors
      if (error.message !== 'Request timeout') {
        alert(error.response?.data?.message || 'Error loading suggested workouts. The exercise database may need to be seeded.');
      } else {
        alert('Request timed out. The exercise database may need to be seeded. Please check the backend server.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoalsSaved = (goals) => {
    setUserGoals(goals);
    setShowGoalsModal(false);
    fetchSuggestedWorkouts();
  };

  const handleAddToMyWorkouts = async (workout) => {
    setAddingWorkoutId(workout._id || workout.title);
    try {
      // Check if it's a dynamic workout (has _id starting with "dynamic-") or a real MongoDB ObjectId
      const isDynamicWorkout = !workout._id || workout._id.toString().startsWith('dynamic-');
      
      console.log('Adding workout to My Workouts:', {
        workoutTitle: workout.title,
        isDynamic: isDynamicWorkout,
        workoutId: workout._id,
      });
      
      const response = await api.post('/workouts/my/add-suggested', {
        suggestedWorkoutId: !isDynamicWorkout ? workout._id : null,
        name: workout.title || workout.name || 'Workout',
        date: new Date().toISOString(),
        workoutData: isDynamicWorkout ? workout : null, // Always send workoutData for dynamic workouts
      });
      
      console.log('Workout added successfully:', response.data);
      
      if (response.data) {
        alert('Workout added to My Workouts!');
        // Small delay to ensure backend has saved the workout
        setTimeout(() => {
          navigate('/workouts/my');
        }, 500);
      }
    } catch (error) {
      console.error('Error adding workout:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || 'Error adding workout';
      alert(errorMessage);
    } finally {
      setAddingWorkoutId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-[#1F1F1F]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-2 mb-6 flex gap-2">
          <Link
            to="/workouts/suggested"
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
              location.pathname === '/workouts/suggested'
                ? 'bg-[#1F1F1F] text-white'
                : 'bg-gray-100 text-[#1F1F1F] hover:bg-gray-200'
            }`}
          >
            <Target className="w-4 h-4" />
            Suggested Workouts
          </Link>
          <Link
            to="/workouts/my"
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
              location.pathname === '/workouts/my'
                ? 'bg-[#1F1F1F] text-white'
                : 'bg-gray-100 text-[#1F1F1F] hover:bg-gray-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            My Workouts
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#1F1F1F] flex items-center gap-3">
                <Target className="w-8 h-8" />
                Suggested Workouts
              </h1>
              <p className="text-gray-600 mt-2">
                Personalized workouts based on your fitness goals
              </p>
            </div>
            <button
              onClick={() => setShowGoalsModal(true)}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-[#1F1F1F] font-semibold flex items-center gap-2 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Change Goals
            </button>
          </div>
        </div>

        {/* Goals Summary */}
        {userGoals && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-[#1F1F1F] mb-3">Your Goals</h2>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="px-3 py-1 bg-[#1F1F1F] text-white rounded-full">
                {userGoals.primaryGoal}
              </div>
              <div className="px-3 py-1 bg-gray-200 text-[#1F1F1F] rounded-full">
                {userGoals.trainingLevel}
              </div>
              {userGoals.focusArea.map((area, idx) => (
                <div key={idx} className="px-3 py-1 bg-gray-200 text-[#1F1F1F] rounded-full">
                  {area}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Workouts Grid */}
        {!userGoals ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#1F1F1F] mb-2">Set Your Fitness Goals</h3>
            <p className="text-gray-600 mb-6">
              To get personalized workout suggestions, please set your fitness goals first.
            </p>
            <button
              onClick={() => setShowGoalsModal(true)}
              className="px-6 py-3 rounded-lg bg-[#1F1F1F] hover:bg-gray-800 text-white font-semibold transition-colors"
            >
              Set Goals
            </button>
          </div>
        ) : suggestedWorkouts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#1F1F1F] mb-2">No Suggested Workouts</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find workouts matching your goals. Try adjusting your preferences or wait a moment for the database to auto-seed.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  fetchSuggestedWorkouts();
                }}
                className="px-6 py-3 rounded-lg bg-[#1F1F1F] hover:bg-gray-800 text-white font-semibold transition-colors flex items-center gap-2"
              >
                <Loader className="w-4 h-4" />
                Refresh Workouts
              </button>
              <button
                onClick={() => setShowGoalsModal(true)}
                className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-[#1F1F1F] font-semibold transition-colors"
              >
                Update Goals
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedWorkouts.map((workout, idx) => (
              <div
                key={workout._id || idx}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#1F1F1F] flex-1">
                    {workout.title}
                  </h3>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    workout.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                    workout.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {workout.difficulty}
                  </span>
                </div>

                {workout.description && (
                  <p className="text-gray-600 text-sm mb-4">{workout.description}</p>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Dumbbell className="w-4 h-4" />
                    <span>{workout.numberOfExercises || workout.exercises?.length || 0} exercises</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{workout.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Flame className="w-4 h-4" />
                    <span>~{workout.estimatedCaloriesBurned || 0} calories</span>
                  </div>
                  {workout.targetMuscleGroup && workout.targetMuscleGroup.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {workout.targetMuscleGroup.map((muscle, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {muscle}
                        </span>
                      ))}
                    </div>
                  )}
                  {workout.equipment && workout.equipment.length > 0 && (
                    <div className="text-xs text-gray-500 mt-2">
                      Equipment: {workout.equipment.join(', ')}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleAddToMyWorkouts(workout)}
                  disabled={addingWorkoutId === (workout._id || workout.title)}
                  className="w-full px-4 py-2 rounded-lg bg-[#1F1F1F] hover:bg-gray-800 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {addingWorkoutId === (workout._id || workout.title) ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Add to My Workouts
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Goals Modal */}
        <WorkoutGoalsModal
          isOpen={showGoalsModal}
          onClose={() => {
            setShowGoalsModal(false);
            // If no goals exist, still allow closing but show message
            if (!userGoals) {
              setLoading(false);
            }
          }}
          onSave={handleGoalsSaved}
          existingGoals={userGoals}
        />
      </div>
    </div>
  );
};

export default SuggestedWorkouts;

