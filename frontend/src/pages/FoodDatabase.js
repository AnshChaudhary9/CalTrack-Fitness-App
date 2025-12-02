import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { searchFood } from '../utils/foodDatabase';
import { 
  Search, 
  X,
  UtensilsCrossed,
  Loader
} from 'lucide-react';

const FoodDatabase = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [matchingFoods, setMatchingFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dbFoods, setDbFoods] = useState([]);

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      setMatchingFoods([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchDatabaseFoods();
  }, []);

  const fetchDatabaseFoods = async () => {
    try {
      const res = await api.get('/food-database');
      setDbFoods(res.data);
    } catch (error) {
      console.error('Error fetching database foods:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setMatchingFoods([]);
      return;
    }

    setLoading(true);
    try {
      // First try local food database
      const localResults = searchFood(searchQuery);
      
      // Also search backend database
      let backendResults = [];
      try {
        const res = await api.get(`/food-database?search=${encodeURIComponent(searchQuery)}`);
        backendResults = res.data || [];
      } catch (error) {
        console.error('Error searching backend:', error);
      }

      // Combine and deduplicate results
      const allResults = [...localResults, ...backendResults];
      const uniqueResults = allResults.reduce((acc, food) => {
        const key = `${food.name}-${food.brand || ''}`;
        if (!acc.find(f => `${f.name}-${f.brand || ''}` === key)) {
          acc.push(food);
        }
        return acc;
      }, []);

      setMatchingFoods(uniqueResults.slice(0, 50)); // Limit to 50 results
    } catch (error) {
      console.error('Error searching foods:', error);
      setMatchingFoods([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setMatchingFoods([]);
  };

  const formatServingSize = (food) => {
    if (food.servingSize) {
      if (typeof food.servingSize === 'object') {
        return `${food.servingSize.amount} ${food.servingSize.unit}`;
      }
      return food.servingSize;
    }
    return '100 gram';
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Sub Navigation */}
        <div className="mb-8 border-b-2 border-gray-200">
          <div className="flex gap-4">
            <Link
              to="/diet"
              className="px-4 py-2 text-gray-600 hover:text-[#1F1F1F] font-medium transition-colors border-b-2 border-transparent hover:border-gray-300"
            >
              Food Diary
            </Link>
            <Link
              to="/food-database"
              className="px-4 py-2 text-[#1F1F1F] font-medium border-b-2 border-[#1F1F1F]"
            >
              Database
            </Link>
          </div>
        </div>

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-[#1F1F1F]">
            Calorie Chart, Nutrition Facts for Food
          </h1>
          <p className="text-lg text-gray-600">
            Search for a food, brand, or restaurant
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-full pl-12 pr-12 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] bg-white text-[#1F1F1F] text-lg"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#1F1F1F] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Matching Foods Section */}
        {searchQuery && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4 text-[#1F1F1F]">Matching Foods:</h2>
            {loading ? (
              <div className="flex items-center justify-center py-16 border-2 border-gray-200 rounded-lg bg-white">
                <Loader className="w-8 h-8 animate-spin text-[#1F1F1F]" />
              </div>
            ) : matchingFoods.length > 0 ? (
              <div className="border-2 border-gray-200 rounded-lg bg-white max-h-[600px] overflow-y-auto">
                <div className="divide-y divide-gray-200">
                  {matchingFoods.map((food, index) => (
                    <div
                      key={index}
                      className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-[#1F1F1F] mb-1">
                            {food.name}
                          </h3>
                          {food.brand && (
                            <p className="text-sm text-gray-600 mb-2">
                              {food.brand}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{formatServingSize(food)}</span>
                            <span className="font-semibold text-[#1F1F1F]">
                              {food.calories || 0} Calories
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border-2 border-gray-200 rounded-lg bg-white p-16 text-center">
                <UtensilsCrossed className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No matching foods found</p>
                <p className="text-sm text-gray-500 mt-2">Try a different search term</p>
              </div>
            )}
          </div>
        )}

        {/* Empty State - Show when no search */}
        {!searchQuery && (
          <div className="border-2 border-gray-200 rounded-lg bg-white p-16 text-center">
            <UtensilsCrossed className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-2">Start searching for foods</p>
            <p className="text-sm text-gray-500">Enter a food name, brand, or restaurant above</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDatabase;
