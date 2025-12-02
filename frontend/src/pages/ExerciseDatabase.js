import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { 
  Search, 
  Filter, 
  Plus, 
  Activity,
  Loader,
  Dumbbell,
  Heart,
  Target,
  Zap
} from 'lucide-react';

const ExerciseDatabase = ({ darkMode }) => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [equipment, setEquipment] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Other',
    muscleGroups: [],
    equipment: [],
    difficulty: 'Intermediate',
    instructions: [''],
    caloriesPerMinute: 0,
  });

  useEffect(() => {
    fetchExercises();
  }, [searchQuery, category, muscleGroup, equipment]);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (category) params.append('category', category);
      if (muscleGroup) params.append('muscleGroup', muscleGroup);
      if (equipment) params.append('equipment', equipment);
      
      const res = await api.get(`/exercise-database?${params.toString()}`);
      setExercises(res.data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const instructions = formData.instructions.filter(inst => inst.trim() !== '');
      await api.post('/exercise-database', {
        ...formData,
        instructions,
      });
      alert('Custom exercise added successfully!');
      setShowModal(false);
      setFormData({
        name: '',
        description: '',
        category: 'Other',
        muscleGroups: [],
        equipment: [],
        difficulty: 'Intermediate',
        instructions: [''],
        caloriesPerMinute: 0,
      });
      fetchExercises();
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding exercise');
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Cardio':
        return <Heart className="w-5 h-5" />;
      case 'Strength':
        return <Dumbbell className="w-5 h-5" />;
      case 'Flexibility':
        return <Target className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const categories = ['Cardio', 'Strength', 'Flexibility', 'Balance', 'Sports', 'Other'];
  const muscleGroups = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Full Body', 'Cardio'];
  const equipmentTypes = ['None', 'Dumbbells', 'Barbell', 'Resistance Bands', 'Machine', 'Cable', 'Body Weight', 'Other'];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-gray-50 to-blue-50'} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 animate-fade-in">
          <div>
            <h1 className={`text-4xl md:text-5xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Exercise Database
            </h1>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Discover exercises, learn proper form, and build your workout library
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/workouts"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
            >
              <Activity className="w-5 h-5" />
              Exercise Diary
            </Link>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
            >
              <Plus className="w-5 h-5" />
              Add Custom Exercise
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-wrap gap-4 animate-fade-in">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search exercises..."
                className={`w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                  darkMode 
                    ? 'bg-slate-800 text-white border-gray-600' 
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
              />
            </div>
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
              darkMode 
                ? 'bg-slate-800 text-white border-gray-600' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={muscleGroup}
            onChange={(e) => setMuscleGroup(e.target.value)}
            className={`px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
              darkMode 
                ? 'bg-slate-800 text-white border-gray-600' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          >
            <option value="">All Muscle Groups</option>
            {muscleGroups.map(mg => (
              <option key={mg} value={mg}>{mg}</option>
            ))}
          </select>
          <select
            value={equipment}
            onChange={(e) => setEquipment(e.target.value)}
            className={`px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
              darkMode 
                ? 'bg-slate-800 text-white border-gray-600' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          >
            <option value="">All Equipment</option>
            {equipmentTypes.map(eq => (
              <option key={eq} value={eq}>{eq}</option>
            ))}
          </select>
        </div>

        {/* Exercises Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : exercises.length === 0 ? (
          <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl font-semibold mb-2">No exercises found</p>
            <p>Try a different search or add a custom exercise!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises.map((exercise, index) => (
              <div
                key={exercise._id}
                className={`${darkMode ? 'bg-slate-800' : 'bg-white'} p-6 rounded-2xl shadow-xl hover-lift transition-all duration-300 animate-fade-in`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white">
                      {getCategoryIcon(exercise.category)}
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {exercise.name}
                      </h3>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {exercise.difficulty}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${darkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                    {exercise.category}
                  </span>
                </div>

                {exercise.description && (
                  <p className={`text-sm mb-4 line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {exercise.description}
                  </p>
                )}

                <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-blue-50'}`}>
                  {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
                    <div className="mb-2">
                      <span className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Muscle Groups:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {exercise.muscleGroups.map((mg, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-1 rounded text-xs ${darkMode ? 'bg-slate-600 text-gray-300' : 'bg-white text-gray-700'}`}
                          >
                            {mg}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {exercise.caloriesPerMinute > 0 && (
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        ~{exercise.caloriesPerMinute} cal/min
                      </span>
                    </div>
                  )}
                </div>

                {exercise.isCustom && (
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Custom exercise
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add Custom Exercise Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-[#1F1F1F]/50 flex items-center justify-center z-50 p-4">
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Add Custom Exercise
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Exercise Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode ? 'bg-slate-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode ? 'bg-slate-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                    }`}
                    rows="3"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode ? 'bg-slate-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                      }`}
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Difficulty
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode ? 'bg-slate-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                      }`}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Calories per Minute
                  </label>
                  <input
                    type="number"
                    value={formData.caloriesPerMinute}
                    onChange={(e) => setFormData({ ...formData, caloriesPerMinute: parseFloat(e.target.value) })}
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode ? 'bg-slate-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                    }`}
                    min="0"
                    step="0.1"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                  >
                    Add Exercise
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

export default ExerciseDatabase;

