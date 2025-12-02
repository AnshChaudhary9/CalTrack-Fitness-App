import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Plus, UtensilsCrossed, Calendar, Flame, Beef, Wheat, Droplets, FileText, Edit, Trash2, X, Loader, Search } from 'lucide-react';
import { searchFood, getFoodInfo } from '../utils/foodDatabase';

const Diet = () => {
  const [dietEntries, setDietEntries] = useState([]);
  const [dailySummary, setDailySummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState({
    mealType: 'Breakfast',
    foodName: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [foodSearchResults, setFoodSearchResults] = useState([]);
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const searchInputRef = useRef(null);
  const searchResultsRef = useRef(null);

  useEffect(() => {
    fetchDietEntries();
    fetchDailySummary();
  }, [selectedDate]);

  const fetchDietEntries = async () => {
    try {
      const params = new URLSearchParams();
      params.append('startDate', selectedDate);
      params.append('endDate', selectedDate);
      
      const res = await api.get(`/diet?${params.toString()}`);
      setDietEntries(res.data);
    } catch (error) {
      console.error('Error fetching diet entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDailySummary = async () => {
    try {
      const res = await api.get(`/diet/summary?date=${selectedDate}`);
      setDailySummary(res.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEntry) {
        await api.put(`/diet/${editingEntry._id}`, formData);
      } else {
        await api.post('/diet', formData);
      }
      setShowModal(false);
      setEditingEntry(null);
      setFormData({
        mealType: 'Breakfast',
        foodName: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
        date: selectedDate,
        notes: '',
      });
      setShowFoodSearch(false);
      setFoodSearchResults([]);
      fetchDietEntries();
      fetchDailySummary();
    } catch (error) {
      console.error('Error saving diet entry:', error);
      alert('Error saving diet entry');
    }
  };

  const handleFoodSearch = (query) => {
    if (query.length >= 2) {
      const results = searchFood(query);
      setFoodSearchResults(results);
      setShowFoodSearch(true);
    } else {
      setFoodSearchResults([]);
      setShowFoodSearch(false);
    }
  };

  const handleFoodSelect = (food) => {
    setFormData({
      ...formData,
      foodName: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fats: food.fats,
    });
    setShowFoodSearch(false);
    setFoodSearchResults([]);
  };

  const handleFoodNameChange = (value) => {
    setFormData({ ...formData, foodName: value });
    handleFoodSearch(value);
    
    // Try to auto-populate if exact match found
    if (value.length >= 2) {
      const foodInfo = getFoodInfo(value);
      if (foodInfo && foodInfo.name.toLowerCase() === value.toLowerCase()) {
        setTimeout(() => {
          setFormData(prev => ({
            ...prev,
            foodName: foodInfo.name,
            calories: foodInfo.calories,
            protein: foodInfo.protein,
            carbs: foodInfo.carbs,
            fats: foodInfo.fats,
          }));
          setShowFoodSearch(false);
        }, 100);
      }
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({
      mealType: entry.mealType,
      foodName: entry.foodName,
      calories: entry.calories,
      protein: entry.protein,
      carbs: entry.carbs,
      fats: entry.fats,
      date: new Date(entry.date).toISOString().split('T')[0],
      notes: entry.notes || '',
    });
    setShowModal(true);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowFoodSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await api.delete(`/diet/${id}`);
        fetchDietEntries();
        fetchDailySummary();
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
  const mealIcons = {
    Breakfast: '🌅',
    Lunch: '☀️',
    Dinner: '🌙',
    Snack: '🍎',
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Sub Navigation */}
        <div className="mb-8 border-b-2 border-gray-200">
          <div className="flex gap-4">
            <Link
              to="/diet"
              className="px-4 py-2 text-[#1F1F1F] font-medium border-b-2 border-[#1F1F1F]"
            >
              Food Diary
            </Link>
            <Link
              to="/food-database"
              className="px-4 py-2 text-gray-600 hover:text-[#1F1F1F] font-medium transition-colors border-b-2 border-transparent hover:border-gray-300"
            >
              Database
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 animate-fade-in">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-[#1F1F1F]">
              Diet Log
            </h1>
            <p className="text-gray-600">
              Track your nutrition and meals
            </p>
          </div>
          <button
            onClick={() => {
            setEditingEntry(null);
            setFormData({
              mealType: 'Breakfast',
              foodName: '',
              calories: '',
              protein: '',
              carbs: '',
              fats: '',
              date: selectedDate,
              notes: '',
            });
            setShowFoodSearch(false);
            setFoodSearchResults([]);
            setShowModal(true);
            }}
            className="flex items-center gap-2 bg-[#1F1F1F] text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-200 font-semibold"
          >
            <Plus className="w-5 h-5" />
            Add Meal
          </button>
        </div>

        {/* Date Selector */}
        <div className="mb-6 animate-fade-in">
          <label className="block mb-2 font-semibold text-[#1F1F1F]">
            <Calendar className="w-4 h-4 inline mr-1" />
            Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] transition-all duration-200 bg-white text-[#1F1F1F]"
          />
        </div>

        {/* Daily Summary */}
        {dailySummary && (
          <div className="bg-white border-2 border-gray-200 p-6 rounded-lg mb-6 animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 text-[#1F1F1F]">
              Daily Summary
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-[#1F1F1F] text-white border-2 border-[#1F1F1F]">
                <p className="text-sm opacity-90 mb-1">Total Calories</p>
                <p className="text-3xl font-bold">{dailySummary.total.calories}</p>
              </div>
              <div className="p-4 rounded-lg bg-[#1F1F1F] text-white border-2 border-[#1F1F1F]">
                <p className="text-sm opacity-90 mb-1">Protein (g)</p>
                <p className="text-3xl font-bold">{dailySummary.total.protein.toFixed(1)}</p>
              </div>
              <div className="p-4 rounded-lg bg-[#1F1F1F] text-white border-2 border-[#1F1F1F]">
                <p className="text-sm opacity-90 mb-1">Carbs (g)</p>
                <p className="text-3xl font-bold">{dailySummary.total.carbs.toFixed(1)}</p>
              </div>
              <div className="p-4 rounded-lg bg-[#1F1F1F] text-white border-2 border-[#1F1F1F]">
                <p className="text-sm opacity-90 mb-1">Fats (g)</p>
                <p className="text-3xl font-bold">{dailySummary.total.fats.toFixed(1)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Diet Entries by Meal Type */}
        {mealTypes.map((mealType, index) => {
          const meals = dietEntries.filter((entry) => entry.mealType === mealType);
          return (
            <div 
              key={mealType} 
              className="bg-white border-2 border-gray-200 p-6 rounded-lg mb-6 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{mealIcons[mealType]}</span>
                <h2 className="text-xl font-bold text-[#1F1F1F]">
                  {mealType}
                </h2>
              </div>
              {meals.length === 0 ? (
                <p className="text-gray-500">
                  No {mealType.toLowerCase()} entries
                </p>
              ) : (
                <div className="space-y-4">
                  {meals.map((entry) => (
                    <div 
                      key={entry._id} 
                      className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50 hover:border-[#1F1F1F] transition-all duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2 text-[#1F1F1F]">
                            {entry.foodName}
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Flame className="w-4 h-4 text-[#1F1F1F]" />
                              <span className="text-gray-600">
                                {entry.calories} cal
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Beef className="w-4 h-4 text-[#1F1F1F]" />
                              <span className="text-gray-600">
                                {entry.protein}g protein
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Wheat className="w-4 h-4 text-[#1F1F1F]" />
                              <span className="text-gray-600">
                                {entry.carbs}g carbs
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Droplets className="w-4 h-4 text-[#1F1F1F]" />
                              <span className="text-gray-600">
                                {entry.fats}g fats
                              </span>
                            </div>
                          </div>
                          {entry.notes && (
                            <div className="mt-3 flex items-start gap-2 pt-3 border-t border-gray-300">
                              <FileText className="w-4 h-4 mt-1 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                {entry.notes}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEdit(entry)}
                            className="flex items-center gap-1 bg-[#1F1F1F] hover:bg-gray-800 text-white px-3 py-2 rounded-lg transition-all duration-200 text-sm font-semibold"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(entry._id)}
                            className="flex items-center gap-1 bg-[#1F1F1F] hover:bg-gray-800 text-white px-3 py-2 rounded-lg transition-all duration-200 text-sm font-semibold"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-[#1F1F1F]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#1F1F1F]">
                  {editingEntry ? 'Edit Meal' : 'Add Meal'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingEntry(null);
                    setShowFoodSearch(false);
                    setFoodSearchResults([]);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-2 font-semibold text-[#1F1F1F]">
                    Meal Type
                  </label>
                  <select
                    value={formData.mealType}
                    onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] transition-all duration-200 bg-white text-[#1F1F1F]"
                    required
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>
                <div className="relative">
                  <label className="block mb-2 font-semibold text-[#1F1F1F]">
                    <Search className="w-4 h-4 inline mr-1" />
                    Food Name (Start typing to search)
                  </label>
                  <div className="relative" ref={searchInputRef}>
                    <input
                      type="text"
                      value={formData.foodName}
                      onChange={(e) => handleFoodNameChange(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] transition-all duration-200 bg-white text-[#1F1F1F]"
                      required
                      placeholder="e.g., chicken, oatmeal, apple..."
                    />
                    {showFoodSearch && foodSearchResults.length > 0 && (
                      <div
                        ref={searchResultsRef}
                        className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto rounded-lg shadow-xl border-2 bg-white border-gray-200"
                      >
                        {foodSearchResults.map((food, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleFoodSelect(food)}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors border-b border-gray-100 ${
                              index === 0 ? 'rounded-t-lg' : ''
                            } ${
                              index === foodSearchResults.length - 1 ? 'rounded-b-lg border-b-0' : ''
                            }`}
                          >
                            <div className="font-semibold text-[#1F1F1F]">
                              {food.name}
                            </div>
                            <div className="text-sm mt-1 text-gray-600">
                              {food.calories} cal • {food.protein}g protein • {food.carbs}g carbs • {food.fats}g fats
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
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
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-2 font-semibold text-[#1F1F1F]">
                      Protein (g)
                    </label>
                    <input
                      type="number"
                      value={formData.protein}
                      onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] transition-all duration-200 bg-white text-[#1F1F1F]"
                      required
                      min="0"
                      step="0.1"
                      placeholder="25"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-[#1F1F1F]">
                      Carbs (g)
                    </label>
                    <input
                      type="number"
                      value={formData.carbs}
                      onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] transition-all duration-200 bg-white text-[#1F1F1F]"
                      required
                      min="0"
                      step="0.1"
                      placeholder="30"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-[#1F1F1F]">
                      Fats (g)
                    </label>
                    <input
                      type="number"
                      value={formData.fats}
                      onChange={(e) => setFormData({ ...formData, fats: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] transition-all duration-200 bg-white text-[#1F1F1F]"
                      required
                      min="0"
                      step="0.1"
                      placeholder="10"
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
                    placeholder="Add any notes..."
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-[#1F1F1F] text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-all duration-200 font-semibold"
                  >
                    {editingEntry ? 'Update Meal' : 'Add Meal'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingEntry(null);
                      setShowFoodSearch(false);
                      setFoodSearchResults([]);
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

export default Diet;
