import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { searchWorkout, getWorkoutInfo, calculateCalories } from '../utils/workoutDatabase';
import { 
  Plus, 
  Filter, 
  Clock, 
  Flame, 
  Calendar, 
  FileText, 
  Edit, 
  Trash2, 
  Activity,
  X,
  Loader,
  Search,
  CheckCircle2,
  Circle,
  Dumbbell
} from 'lucide-react';

const Workouts = () => {
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
  const [workoutSearchResults, setWorkoutSearchResults] = useState([]);
  const [showWorkoutSearch, setShowWorkoutSearch] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [completingWorkoutId, setCompletingWorkoutId] = useState(null);
  const searchInputRef = useRef(null);
  const searchResultsRef = useRef(null);

  useEffect(() => {
    fetchWorkouts();
  }, [filterType, sortBy]);

  const fetchWorkouts = async () => {
    try {
      const params = new URLSearchParams();
      if (filterType) params.append('type', filterType);
      if (sortBy) params.append('sort', sortBy === 'date-asc' ? 'date-asc' : sortBy === 'type' ? 'type' : 'date-desc');
      
      const res = await api.get(`/workouts?${params.toString()}`);
      // Ensure completed field exists for all workouts
      setWorkouts(res.data.map(w => ({ ...w, completed: w.completed || false })));
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkoutNameChange = (value) => {
    setFormData({ ...formData, name: value });
    setSelectedWorkout(null); // Reset selected workout when name changes
    
    if (value.length >= 2) {
      const results = searchWorkout(value);
      setWorkoutSearchResults(results);
      setShowWorkoutSearch(true);
    } else {
      setWorkoutSearchResults([]);
      setShowWorkoutSearch(false);
    }
  };

  const handleWorkoutSelect = (workout) => {
    const duration = formData.duration || workout.duration;
    const calculatedCalories = calculateCalories(workout, parseFloat(duration) || workout.duration);
    
    setSelectedWorkout(workout);
    setFormData({
      ...formData,
      name: workout.name,
      type: workout.type,
      duration: duration.toString(),
      calories: calculatedCalories.toString(),
      notes: workout.notes || '',
      sets: '',
      reps: '',
    });
    setShowWorkoutSearch(false);
    setWorkoutSearchResults([]);
  };

  const handleDurationChange = (value) => {
    const duration = parseFloat(value) || 0;
    setFormData({ ...formData, duration: value });
    
    // Recalculate calories if a workout is selected
    if (selectedWorkout && duration > 0) {
      const calculatedCalories = calculateCalories(selectedWorkout, duration);
      setFormData(prev => ({ ...prev, duration: value, calories: calculatedCalories.toString() }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingWorkout) {
        await api.put(`/workouts/${editingWorkout._id}`, formData);
      } else {
        await api.post('/workouts', formData);
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
      setShowWorkoutSearch(false);
      setWorkoutSearchResults([]);
      setSelectedWorkout(null);
      fetchWorkouts();
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('Error saving workout');
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
      duration: workout.duration,
      calories: workout.calories,
      date: new Date(workout.date).toISOString().split('T')[0],
      notes: workout.notes || '',
      sets: setsValue,
      reps: repsValue,
    });
    setShowWorkoutSearch(false);
    setWorkoutSearchResults([]);
    setSelectedWorkout(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await api.delete(`/workouts/${id}`);
        fetchWorkouts();
      } catch (error) {
        console.error('Error deleting workout:', error);
      }
    }
  };

  const handleToggleComplete = async (workout) => {
    if (completingWorkoutId === workout._id) return; // Prevent double-clicks
    
    setCompletingWorkoutId(workout._id);
    try {
      const res = await api.put(`/workouts/${workout._id}/complete`);
      // Update local state immediately for better UX using functional update
      setWorkouts(prevWorkouts => 
        prevWorkouts.map(w => 
          w._id === workout._id 
            ? { ...w, completed: res.data.completed || false, completedAt: res.data.completedAt || null }
            : w
        )
      );
      // Dispatch custom event to notify other pages (like Challenges)
      console.log('Dispatching workoutCompleted event...');
      window.dispatchEvent(new CustomEvent('workoutCompleted', { 
        detail: { workout: res.data } 
      }));
    } catch (error) {
      console.error('Error toggling workout completion:', error);
      alert(error.response?.data?.message || 'Error updating workout completion');
      // Refresh workouts on error to ensure UI is in sync
      fetchWorkouts();
    } finally {
      setCompletingWorkoutId(null);
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      Cardio: 'bg-red-100 text-red-700 border-red-300',
      Strength: 'bg-blue-100 text-blue-700 border-blue-300',
      Yoga: 'bg-green-100 text-green-700 border-green-300',
      Swimming: 'bg-cyan-100 text-cyan-700 border-cyan-300',
      Cycling: 'bg-orange-100 text-orange-700 border-orange-300',
      Running: 'bg-purple-100 text-purple-700 border-purple-300',
      Other: 'bg-gray-100 text-gray-700 border-gray-300',
    };
    return colors[type] || colors.Other;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-[#1F1F1F]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 animate-fade-in">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-[#1F1F1F]">
              Workout Tracker
            </h1>
            <p className="text-gray-600">
              Track and manage your fitness activities
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
                sets: '',
                reps: '',
              });
              setShowWorkoutSearch(false);
              setWorkoutSearchResults([]);
              setSelectedWorkout(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-[#1F1F1F] text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-200 font-semibold"
          >
            <Plus className="w-5 h-5" />
            Add Workout
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4 animate-fade-in">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] transition-all duration-200 bg-white text-[#1F1F1F]"
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
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] transition-all duration-200 bg-white text-[#1F1F1F]"
          >
            <option value="date-desc">Date (Newest)</option>
            <option value="date-asc">Date (Oldest)</option>
            <option value="type">Type</option>
          </select>
        </div>

        {/* Workouts List */}
        {workouts.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl font-semibold mb-2">No workouts found</p>
            <p>Add your first workout to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((workout, index) => (
              <div
                key={workout._id}
                className="bg-white border-2 border-gray-200 p-6 rounded-lg hover:border-[#1F1F1F] transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleToggleComplete(workout);
                      }}
                      disabled={completingWorkoutId === workout._id}
                      className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title={workout.completed ? 'Mark as incomplete' : 'Mark as completed'}
                    >
                      {workout.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                      )}
                    </button>
                    <h3 className={`text-xl font-bold ${workout.completed ? 'text-gray-500 line-through' : 'text-[#1F1F1F]'}`}>
                      {workout.name}
                    </h3>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold border-2 ${getTypeColor(workout.type)}`}>
                    {workout.type}
                  </span>
                </div>
                <div className="space-y-3 mb-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{workout.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#1F1F1F]" />
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
                      <div className="flex items-center gap-2">
                        <Dumbbell className="w-4 h-4" />
                        <span>
                          {setsCount} sets
                          {repsCount ? ` × ${repsCount} reps` : ''}
                        </span>
                      </div>
                    );
                  })()}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(workout.date).toLocaleDateString()}</span>
                  </div>
                  {workout.notes && (
                    <div className="flex items-start gap-2 pt-2 border-t border-gray-300">
                      <FileText className="w-4 h-4 mt-1" />
                      <span className="text-sm">{workout.notes}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(workout)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#1F1F1F] hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-all duration-200 font-semibold"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(workout._id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-200 font-semibold"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-[#1F1F1F]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#1F1F1F]">
                  {editingWorkout ? 'Edit Workout' : 'Add Workout'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingWorkout(null);
                    setShowWorkoutSearch(false);
                    setWorkoutSearchResults([]);
                    setSelectedWorkout(null);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <label className="block mb-2 font-semibold text-[#1F1F1F]">
                    <Search className="w-4 h-4 inline mr-1" />
                    Workout Name (Start typing to search)
                  </label>
                  <div className="relative" ref={searchInputRef}>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleWorkoutNameChange(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] transition-all duration-200 bg-white text-[#1F1F1F]"
                      required
                      placeholder="e.g., Running, Yoga, Strength..."
                    />
                    {showWorkoutSearch && workoutSearchResults.length > 0 && (
                      <div
                        ref={searchResultsRef}
                        className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto rounded-lg shadow-xl border-2 bg-white border-gray-200"
                      >
                        {workoutSearchResults.map((workout, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleWorkoutSelect(workout)}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors border-b border-gray-100 ${
                              index === 0 ? 'rounded-t-lg' : ''
                            } ${
                              index === workoutSearchResults.length - 1 ? 'rounded-b-lg border-b-0' : ''
                            }`}
                          >
                            <div className="font-semibold text-[#1F1F1F]">
                              {workout.name}
                            </div>
                            <div className="text-sm mt-1 text-gray-600">
                              {workout.type} • {workout.duration} min • {workout.calories} cal
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-[#1F1F1F]">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] transition-all duration-200 bg-white text-[#1F1F1F]"
                    required
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
                    <label className="block mb-2 font-semibold text-[#1F1F1F]">
                      Duration (min)
                    </label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => handleDurationChange(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] transition-all duration-200 bg-white text-[#1F1F1F]"
                      required
                      min="1"
                      placeholder="30"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-[#1F1F1F]">
                      Calories
                    </label>
                    <input
                      type="number"
                      value={formData.calories}
                      onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] transition-all duration-200 bg-white text-[#1F1F1F]"
                      required
                      min="0"
                      placeholder="300"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 font-semibold text-[#1F1F1F]">
                      Sets (optional)
                    </label>
                    <input
                      type="number"
                      value={formData.sets}
                      onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] transition-all duration-200 bg-white text-[#1F1F1F]"
                      min="0"
                      placeholder="e.g. 3"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-[#1F1F1F]">
                      Reps (optional)
                    </label>
                    <input
                      type="number"
                      value={formData.reps}
                      onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] transition-all duration-200 bg-white text-[#1F1F1F]"
                      min="0"
                      placeholder="e.g. 12"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-[#1F1F1F]">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] transition-all duration-200 bg-white text-[#1F1F1F]"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-[#1F1F1F]">
                    Notes (optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] transition-all duration-200 bg-white text-[#1F1F1F]"
                    rows="3"
                    placeholder="Add any notes about your workout..."
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-[#1F1F1F] text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-all duration-200 font-semibold"
                  >
                    {editingWorkout ? 'Update Workout' : 'Add Workout'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingWorkout(null);
                      setShowWorkoutSearch(false);
                      setWorkoutSearchResults([]);
                      setSelectedWorkout(null);
                    }}
                    className="flex-1 px-4 py-3 rounded-lg transition-all duration-200 font-semibold bg-gray-200 hover:bg-gray-300 text-[#1F1F1F]"
                  >
                    Cancel
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

export default Workouts;
