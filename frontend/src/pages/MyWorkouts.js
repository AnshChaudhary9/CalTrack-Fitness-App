import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../utils/api';
import {
  Plus,
  Filter,
  Clock,
  Flame,
  Calendar,
  Edit,
  Trash2,
  Activity,
  X,
  Loader,
  Search,
  CheckCircle2,
  Circle,
  Dumbbell,
  Target,
} from 'lucide-react';

// Workout name suggestions by type
const workoutNameSuggestions = {
  Cardio: [
    'Morning Run',
    'Evening Jog',
    'Treadmill Session',
    'HIIT Cardio',
    'Stair Climbing',
    'Elliptical Training',
    'Rowing Machine',
    'Jump Rope',
    'Dance Cardio',
    'Aerobic Workout',
    'Zumba Class',
    'Kickboxing',
    'Step Aerobics',
    'Indoor Cycling',
    'Cross Trainer',
    'Battle Ropes',
    'Sprint Intervals',
    'Tabata Workout',
    'Circuit Cardio',
    'Fat Burn Cardio',
  ],
  Strength: [
    'Full Body Strength',
    'Upper Body Workout',
    'Lower Body Workout',
    'Push Day',
    'Pull Day',
    'Leg Day',
    'Chest & Triceps',
    'Back & Biceps',
    'Shoulders & Arms',
    'Core Strength',
    'Chest Day',
    'Back Day',
    'Shoulder Day',
    'Arm Day',
    'Glute Workout',
    'Quad Focus',
    'Hamstring Focus',
    'Full Body Circuit',
    'Powerlifting Session',
    'Bodybuilding Routine',
    'Functional Strength',
    'Compound Movements',
    'Isolation Workout',
  ],
  Yoga: [
    'Morning Yoga Flow',
    'Evening Yoga',
    'Yoga for Flexibility',
    'Power Yoga',
    'Yin Yoga',
    'Vinyasa Flow',
    'Hatha Yoga',
    'Restorative Yoga',
    'Yoga Stretch',
    'Sun Salutation',
    'Ashtanga Yoga',
    'Bikram Yoga',
    'Hot Yoga',
    'Yoga for Beginners',
    'Advanced Yoga',
    'Yoga for Stress Relief',
    'Yoga for Back Pain',
    'Yoga Meditation',
    'Chair Yoga',
    'Prenatal Yoga',
  ],
  Swimming: [
    'Pool Swimming',
    'Freestyle Swim',
    'Backstroke Session',
    'Breaststroke',
    'Butterfly Stroke',
    'Swimming Laps',
    'Water Aerobics',
    'Open Water Swim',
    'Swim Training',
    'Endurance Swim',
    'Sprint Swim',
    'Swim Workout',
    'Aqua Jogging',
    'Water Polo',
    'Synchronized Swimming',
  ],
  Cycling: [
    'Road Cycling',
    'Mountain Biking',
    'Indoor Cycling',
    'Spin Class',
    'Bike Commute',
    'Long Distance Ride',
    'Interval Cycling',
    'Recovery Ride',
    'Hill Climbing',
    'Speed Training',
    'Endurance Ride',
    'Bike Tour',
    'Cycling Workout',
    'Stationary Bike',
    'Outdoor Cycling',
  ],
  Running: [
    '5K Run',
    '10K Run',
    'Long Distance Run',
    'Sprint Training',
    'Trail Running',
    'Interval Running',
    'Tempo Run',
    'Easy Run',
    'Marathon Training',
    'Half Marathon',
    'Fartlek Run',
    'Hill Run',
    'Track Workout',
    'Jogging Session',
    'Speed Work',
    'Recovery Run',
    'Base Run',
    'Long Run',
  ],
  Other: [
    'Pilates Session',
    'Pilates Core',
    'Bodyweight Workout',
    'Circuit Training',
    'CrossFit',
    'Boxing Training',
    'Martial Arts',
    'Dance Practice',
    'Rock Climbing',
    'Hiking',
    'Barre Workout',
    'TRX Training',
    'Kettlebell Workout',
    'Resistance Band',
    'Calisthenics',
    'Parkour',
    'Rowing',
    'Skating',
    'Tennis',
    'Basketball',
    'Soccer',
    'Volleyball',
    'Badminton',
    'Squash',
    'Racquetball',
    'Golf',
    'Tennis Practice',
    'Rugby',
    'Football',
    'Baseball',
    'Softball',
    'Cricket',
    'Archery',
    'Fencing',
    'Wrestling',
    'Jiu-Jitsu',
    'Karate',
    'Taekwondo',
    'Muay Thai',
    'MMA Training',
    'Dance Fitness',
    'Zumba',
    'Aerobics',
    'Step Class',
    'Bootcamp',
    'HIIT Workout',
    'Tabata',
    'EMOM',
    'AMRAP',
    'Functional Training',
    'Mobility Work',
    'Stretching',
    'Flexibility Training',
    'Balance Workout',
    'Coordination Training',
    'Agility Training',
    'Plyometrics',
    'Jump Training',
  ],
};

// Calories burned per minute by workout type (average for 70kg person)
// This should match backend/utils/calculateCalories.js for consistency
const caloriesPerMinute = {
  // Base types
  Cardio: 10,
  Strength: 6,
  Yoga: 3,
  Swimming: 10,
  Cycling: 8,
  Running: 11,
  Other: 7,
  
  // Cardio workouts
  'HIIT Cardio': 12,
  'Treadmill Session': 11,
  'Stair Climbing': 12,
  'Jump Rope': 12,
  'Dance Cardio': 8,
  'Zumba Class': 8,
  'Kickboxing': 10,
  'Morning Run': 11,
  'Evening Jog': 10,
  'Sprint Training': 13,
  'Interval Running': 12,
  'Tempo Run': 11,
  'Trail Running': 11,
  'Marathon Training': 11,
  'Long Distance Run': 10,
  'Burpees': 12,
  'Jump Squats': 10,
  'Box Jumps': 10,
  'Battle Ropes': 12,
  'Mountain Climbers': 9,
  'High Knees': 8,
  'Plank Jacks': 9,
  'Rowing Machine': 10,
  'Elliptical': 9,
  'Stair Climber': 11,
  'Spin Class': 9,
  'Indoor Cycling': 8,
  'Road Cycling': 8,
  'Mountain Biking': 9,
  'Swimming Laps': 10,
  'Pool Swimming': 10,
  'Freestyle Swim': 10,
  'Water Aerobics': 6,
  
  // Strength workouts
  'Full Body Strength': 7,
  'Upper Body Workout': 6,
  'Lower Body Workout': 7,
  'Push Day': 6,
  'Pull Day': 6,
  'Leg Day': 7,
  'Chest Day': 6,
  'Back Day': 6,
  'Shoulder Day': 6,
  'Arm Day': 5,
  'Core Strength': 5,
  'Powerlifting Session': 5,
  'Bodybuilding Routine': 6,
  'Functional Strength': 7,
  'Compound Movements': 7,
  'Kettlebell Swings': 10,
  'Circuit Training': 10,
  
  // Yoga
  'Morning Yoga Flow': 3,
  'Evening Yoga': 3,
  'Power Yoga': 5,
  'Vinyasa Flow': 4,
  'Hatha Yoga': 3,
  'Yin Yoga': 2,
  'Restorative Yoga': 2,
  'Ashtanga Yoga': 5,
  'Hot Yoga': 6,
  'Bikram Yoga': 6,
  
  // Pilates
  'Pilates Session': 4,
  'Pilates Core': 4,
  'Pilates Core & Abs Workout': 5,
  'Pilates Core Strength Workout': 5,
  
  // Bodyweight
  'Bodyweight Workout': 8,
  'Bodyweight HIIT Blast': 11,
  'Calisthenics': 8,
  'Full Body Circuit': 9,
  
  // Other
  'CrossFit': 12,
  'Boxing Training': 10,
  'Martial Arts': 8,
  'Rock Climbing': 8,
  'Hiking': 6,
  'Barre Workout': 5,
  'TRX Training': 8,
  'Bootcamp': 11,
  'HIIT Workout': 12,
  'Tabata': 13,
  'EMOM': 10,
  'AMRAP': 10,
  'Functional Training': 8,
  'Mobility Work': 3,
  'Stretching': 2,
  'Flexibility Training': 3,
  'Balance Workout': 4,
  'Plyometrics': 10,
  'Kettlebell Workout': 9,
};

const MyWorkouts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [filterType, setFilterType] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [formData, setFormData] = useState({
    name: '',
    type: 'Cardio',
    duration: '',
    calories: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    sets: '',
    reps: '',
  });
  const [workoutNameSuggestionsList, setWorkoutNameSuggestionsList] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [completingWorkoutId, setCompletingWorkoutId] = useState(null);
  const [deletingWorkoutId, setDeletingWorkoutId] = useState(null);

  useEffect(() => {
    fetchWorkouts();
  }, [filterType, sortBy]);

  // Refresh workouts when navigating to this page
  useEffect(() => {
    if (location.pathname === '/workouts/my') {
      fetchWorkouts();
    }
  }, [location.pathname]);

  // Update workout name suggestions when type changes
  useEffect(() => {
    setWorkoutNameSuggestionsList(workoutNameSuggestions[formData.type] || []);
  }, [formData.type]);

  // Auto-calculate calories based on duration and type/name
  useEffect(() => {
    // Skip auto-calculation when editing (user can manually set calories)
    if (editingWorkout) return;
    
    if (formData.duration && formData.type) {
      const duration = parseFloat(formData.duration);
      if (!isNaN(duration) && duration > 0) {
        // First try to match by workout name for more specific calorie rates
        let caloriesPerMin = caloriesPerMinute[formData.name] || null;
        
        // If no specific match, use type-based rate
        if (!caloriesPerMin) {
          caloriesPerMin = caloriesPerMinute[formData.type] || 7;
        }
        
        const calculatedCalories = Math.round(duration * caloriesPerMin);
        
        // Always update calories when duration, type, or name changes
        setFormData((prev) => {
          // Only update if the calculated value is different
          if (prev.calories !== calculatedCalories.toString()) {
            return {
              ...prev,
              calories: calculatedCalories.toString(),
            };
          }
          return prev;
        });
      } else {
        // Clear calories if duration is invalid
        setFormData((prev) => ({
          ...prev,
          calories: '',
        }));
      }
    } else {
      // Clear calories if duration or type is missing
      setFormData((prev) => ({
        ...prev,
        calories: '',
      }));
    }
  }, [formData.duration, formData.type, formData.name, editingWorkout]);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/workouts/my');
      let workouts = res.data;

      // Apply filters
      if (filterType) {
        workouts = workouts.filter(w => w.type === filterType);
      }

      // Apply sorting
      workouts.sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.date) - new Date(a.date);
        } else if (sortBy === 'date-asc') {
          return new Date(a.date) - new Date(b.date);
        } else if (sortBy === 'type') {
          return a.type.localeCompare(b.type);
        }
        return 0;
      });

      setWorkouts(workouts);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (workout) => {
    if (completingWorkoutId === workout._id) return;

    setCompletingWorkoutId(workout._id);
    try {
      const res = await api.put(`/workouts/${workout._id}/complete`);
      setWorkouts(prevWorkouts =>
        prevWorkouts.map(w =>
          w._id === workout._id
            ? { ...w, completed: res.data.completed || false, completedAt: res.data.completedAt || null }
            : w
        )
      );
      window.dispatchEvent(new CustomEvent('workoutCompleted', { detail: { workout: res.data } }));
    } catch (error) {
      console.error('Error toggling workout completion:', error);
      alert(error.response?.data?.message || 'Error updating workout completion');
      fetchWorkouts();
    } finally {
      setCompletingWorkoutId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) {
      return;
    }

    setDeletingWorkoutId(id);
    try {
      await api.delete(`/workouts/${id}`);
      setWorkouts(prevWorkouts => prevWorkouts.filter(w => w._id !== id));
    } catch (error) {
      console.error('Error deleting workout:', error);
      alert(error.response?.data?.message || 'Error deleting workout');
    } finally {
      setDeletingWorkoutId(null);
    }
  };

  const handleEdit = (workout) => {
    setEditingWorkout(workout);
    const structuredSets = Array.isArray(workout.sets) ? workout.sets : [];
    const fallbackExercise = workout.exercises && workout.exercises.length > 0 ? workout.exercises[0] : null;
    const fallbackNumber = !Array.isArray(workout.sets) && typeof workout.sets === 'number' ? workout.sets : null;
    const setsValue =
      structuredSets.length > 0
        ? structuredSets.length.toString()
        : fallbackExercise?.sets
          ? fallbackExercise.sets.toString()
          : fallbackNumber
            ? fallbackNumber.toString()
            : '';
    const repsValue =
      structuredSets.length > 0
        ? (structuredSets[0]?.reps !== undefined ? structuredSets[0].reps.toString() : '')
        : fallbackExercise?.reps
          ? fallbackExercise.reps.toString()
          : typeof workout.reps === 'number'
            ? workout.reps.toString()
            : '';

    setFormData({
      name: workout.name,
      type: workout.type,
      duration: workout.duration.toString(),
      calories: workout.calories.toString(),
      date: new Date(workout.date).toISOString().split('T')[0],
      notes: workout.notes || '',
      sets: setsValue,
      reps: repsValue,
    });
    setWorkoutNameSuggestionsList(workoutNameSuggestions[workout.type] || []);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.type || !formData.duration || !formData.date) {
      alert('Please fill in all required fields (Name, Type, Duration, Date)');
      return;
    }
    
    try {
      // Always let backend calculate calories - don't send calories field
      const payload = {
        name: formData.name,
        type: formData.type,
        duration: parseInt(formData.duration),
        date: formData.date,
        notes: formData.notes || '',
        sets: formData.sets ? parseInt(formData.sets) : undefined,
        reps: formData.reps ? parseInt(formData.reps) : undefined,
      };
      
      console.log('Submitting workout with payload:', payload);
      
      if (editingWorkout) {
        await api.put(`/workouts/${editingWorkout._id}`, payload);
      } else {
        await api.post('/workouts', payload);
      }
      setShowModal(false);
      setEditingWorkout(null);
      setFormData({
        name: '',
        type: 'Cardio',
        duration: '',
        calories: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        sets: '',
        reps: '',
      });
      fetchWorkouts();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving workout');
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
                <Activity className="w-8 h-8" />
                My Workouts
              </h1>
              <p className="text-gray-600 mt-2">
                Your saved and created workouts
              </p>
            </div>
            <button
              onClick={() => {
                setEditingWorkout(null);
                setFormData({
                  name: '',
                  type: 'Cardio',
                  duration: '',
                  calories: '',
                  date: new Date().toISOString().split('T')[0],
                  notes: '',
                });
                setWorkoutNameSuggestionsList(workoutNameSuggestions['Cardio'] || []);
                setShowModal(true);
              }}
              className="px-4 py-2 rounded-lg bg-[#1F1F1F] hover:bg-gray-800 text-white font-semibold flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Workout
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F1F1F]"
          >
            <option value="">All Types</option>
            <option value="Cardio">Cardio</option>
            <option value="Strength">Strength</option>
            <option value="Yoga">Yoga</option>
            <option value="Swimming">Swimming</option>
            <option value="Cycling">Cycling</option>
            <option value="Running">Running</option>
            <option value="Other">Other</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F1F1F]"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="type">By Type</option>
          </select>
        </div>

        {/* Workouts List */}
        {workouts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#1F1F1F] mb-2">No Workouts Yet</h3>
            <p className="text-gray-600 mb-6">
              Start by adding a workout or adding one from Suggested Workouts.
            </p>
            <button
              onClick={() => navigate('/workouts/suggested')}
              className="px-6 py-3 rounded-lg bg-[#1F1F1F] hover:bg-gray-800 text-white font-semibold transition-colors"
            >
              Browse Suggested Workouts
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((workout) => (
              <div
                key={workout._id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleToggleComplete(workout);
                      }}
                      className="mt-1"
                      disabled={completingWorkoutId === workout._id}
                    >
                      {workout.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    <div className="flex-1">
                      <h3
                        className={`text-xl font-bold text-[#1F1F1F] ${
                          workout.completed ? 'line-through text-gray-400' : ''
                        }`}
                      >
                        {workout.name}
                      </h3>
                      <span className="inline-block px-2 py-1 mt-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {workout.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{workout.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Flame className="w-4 h-4" />
                    <span>{workout.calories} calories</span>
                  </div>
                  {(() => {
                    const structuredSets = Array.isArray(workout.sets) ? workout.sets : [];
                    const fallbackExercise = workout.exercises && workout.exercises.length > 0 ? workout.exercises[0] : null;
                    const fallbackNumber = !Array.isArray(workout.sets) && typeof workout.sets === 'number' ? workout.sets : null;
                    const setsCount =
                      structuredSets.length > 0
                        ? structuredSets.length
                        : fallbackExercise?.sets ?? fallbackNumber;
                    const repsCount =
                      structuredSets.length > 0
                        ? structuredSets[0]?.reps
                        : fallbackExercise?.reps ?? (typeof workout.reps === 'number' ? workout.reps : null);

                    if (!setsCount) {
                      return null;
                    }

                    return (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Dumbbell className="w-4 h-4" />
                        <span>
                          {setsCount} sets
                          {repsCount ? ` × ${repsCount} reps` : ''}
                        </span>
                      </div>
                    );
                  })()}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(workout.date).toLocaleDateString()}</span>
                  </div>
                  {workout.exercises && workout.exercises.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Dumbbell className="w-4 h-4" />
                      <span>{workout.exercises.length} exercises</span>
                    </div>
                  )}
                </div>

                {workout.notes && (
                  <p className="text-sm text-gray-600 mb-4">{workout.notes}</p>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(workout)}
                    className="flex-1 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-[#1F1F1F] font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(workout._id)}
                    disabled={deletingWorkoutId === workout._id}
                    className="px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {deletingWorkoutId === workout._id ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-[#1F1F1F]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#1F1F1F]">
                  {editingWorkout ? 'Edit Workout' : 'Add Workout'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingWorkout(null);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-semibold text-[#1F1F1F] mb-1">
                    Workout Name
                  </label>
                  <input
                    type="text"
                    list="workout-names"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F1F1F]"
                    placeholder="Type or select a workout name"
                    required
                  />
                  <datalist id="workout-names">
                    {workoutNameSuggestionsList.map((suggestion, index) => (
                      <option key={index} value={suggestion} />
                    ))}
                  </datalist>
                  {showSuggestions && workoutNameSuggestionsList.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {workoutNameSuggestionsList
                        .filter((suggestion) =>
                          suggestion.toLowerCase().includes(formData.name.toLowerCase())
                        )
                        .map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, name: suggestion });
                              setShowSuggestions(false);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1F1F1F] mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => {
                      setFormData({ ...formData, type: e.target.value });
                      // Clear name when type changes to show new suggestions
                      if (formData.name && !workoutNameSuggestions[e.target.value]?.includes(formData.name)) {
                        setFormData(prev => ({ ...prev, type: e.target.value, name: '' }));
                      } else {
                        setFormData(prev => ({ ...prev, type: e.target.value }));
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F1F1F]"
                  >
                    <option value="Cardio">Cardio</option>
                    <option value="Strength">Strength</option>
                    <option value="Yoga">Yoga</option>
                    <option value="Swimming">Swimming</option>
                    <option value="Cycling">Cycling</option>
                    <option value="Running">Running</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1F1F1F] mb-1">
                      Duration (min)
                    </label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F1F1F]"
                      required
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1F1F1F] mb-1">
                      Calories
                      <span className="text-xs text-gray-500 ml-2">(auto-calculated)</span>
                    </label>
                    <input
                      type="number"
                      value={formData.calories || ''}
                      onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F1F1F] bg-gray-50"
                      min="0"
                      readOnly={!editingWorkout}
                      title={!editingWorkout ? "Calories are auto-calculated based on duration and type. You can manually override if needed." : "You can edit calories manually"}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1F1F1F] mb-1">
                      Sets (optional)
                    </label>
                    <input
                      type="number"
                      value={formData.sets}
                      onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F1F1F]"
                      min="0"
                      placeholder="e.g. 3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1F1F1F] mb-1">
                      Reps (optional)
                    </label>
                    <input
                      type="number"
                      value={formData.reps}
                      onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F1F1F]"
                      min="0"
                      placeholder="e.g. 12"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1F1F1F] mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F1F1F]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1F1F1F] mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F1F1F]"
                    rows="3"
                  />
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingWorkout(null);
                    }}
                    className="flex-1 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-[#1F1F1F] font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 rounded-lg bg-[#1F1F1F] hover:bg-gray-800 text-white font-semibold transition-colors"
                  >
                    {editingWorkout ? 'Update' : 'Add'} Workout
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

export default MyWorkouts;

