import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import api from '../utils/api';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TrendingUp, Loader } from 'lucide-react';

const Progress = ({ darkMode }) => {
  const { user } = useContext(AuthContext);
  const [workoutData, setWorkoutData] = useState([]);
  const [calorieData, setCalorieData] = useState([]);
  const [weightData, setWeightData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    fetchProgressData();
  }, [timeRange]);

  const fetchProgressData = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      if (timeRange === 'week') {
        startDate.setDate(endDate.getDate() - 7);
      } else if (timeRange === 'month') {
        startDate.setMonth(endDate.getMonth() - 1);
      } else {
        startDate.setMonth(endDate.getMonth() - 3);
      }

      const [workoutsRes, dietRes] = await Promise.all([
        api.get(`/workouts?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`),
        api.get(`/diet?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`),
      ]);

      // Process workout data (only completed workouts)
      const workoutMap = {};
      workoutsRes.data.forEach((workout) => {
        if (!workout.completed) return; // Only count completed workouts
        const date = new Date(workout.date).toLocaleDateString();
        if (!workoutMap[date]) {
          workoutMap[date] = { date, workouts: 0, caloriesBurned: 0 };
        }
        workoutMap[date].workouts += 1;
        workoutMap[date].caloriesBurned += workout.calories;
      });

      // Process diet data
      const dietMap = {};
      dietRes.data.forEach((entry) => {
        const date = new Date(entry.date).toLocaleDateString();
        if (!dietMap[date]) {
          dietMap[date] = { date, caloriesConsumed: 0 };
        }
        dietMap[date].caloriesConsumed += entry.calories;
      });

      // Combine data
      const allDates = new Set([...Object.keys(workoutMap), ...Object.keys(dietMap)]);
      const combinedData = Array.from(allDates)
        .sort()
        .map((date) => ({
          date,
          workouts: workoutMap[date]?.workouts || 0,
          caloriesBurned: workoutMap[date]?.caloriesBurned || 0,
          caloriesConsumed: dietMap[date]?.caloriesConsumed || 0,
          netCalories: (dietMap[date]?.caloriesConsumed || 0) - (workoutMap[date]?.caloriesBurned || 0),
        }));

      setWorkoutData(combinedData);
      setCalorieData(combinedData);

      // Weight data from user profile
      if (user?.weightHistory && user.weightHistory.length > 0) {
        const weightChartData = user.weightHistory
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map((entry) => ({
            date: new Date(entry.date).toLocaleDateString(),
            weight: entry.weight,
          }));
        setWeightData(weightChartData);
      }
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Custom tooltip with proper dark mode styling
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg shadow-xl border-2 ${
          darkMode 
            ? 'bg-slate-800 border-slate-600 text-white' 
            : 'bg-white border-gray-200 text-gray-800'
        }`}>
          <p className={`font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900' : ''} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 animate-fade-in">
          <div>
            <h1 className={`text-4xl md:text-5xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Progress Tracking
            </h1>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Visualize your fitness journey
            </p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className={`px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
              darkMode 
                ? 'bg-slate-800 text-white border-gray-600' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last 3 Months</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Weekly Calorie Intake */}
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} p-6 rounded-2xl shadow-xl animate-fade-in`}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Weekly Calorie Intake
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={calorieData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#475569' : '#e2e8f0'} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: darkMode ? '#cbd5e1' : '#475569' }}
                  stroke={darkMode ? '#475569' : '#cbd5e1'}
                />
                <YAxis 
                  tick={{ fill: darkMode ? '#cbd5e1' : '#475569' }}
                  stroke={darkMode ? '#475569' : '#cbd5e1'}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ color: darkMode ? '#cbd5e1' : '#475569' }}
                />
                <Bar dataKey="caloriesConsumed" fill="#8884d8" name="Calories Consumed" />
                <Bar dataKey="caloriesBurned" fill="#82ca9d" name="Calories Burned" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Workouts Per Week */}
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} p-6 rounded-2xl shadow-xl animate-fade-in`}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className={`w-6 h-6 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Workouts Per Week
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={workoutData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#475569' : '#e2e8f0'} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: darkMode ? '#cbd5e1' : '#475569' }}
                  stroke={darkMode ? '#475569' : '#cbd5e1'}
                />
                <YAxis 
                  tick={{ fill: darkMode ? '#cbd5e1' : '#475569' }}
                  stroke={darkMode ? '#475569' : '#cbd5e1'}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ color: darkMode ? '#cbd5e1' : '#475569' }}
                />
                <Bar dataKey="workouts" fill="#ffc658" name="Number of Workouts" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weight vs Time */}
        {weightData.length > 0 && (
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} p-6 rounded-2xl shadow-xl mb-6 animate-fade-in`}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Weight vs Time
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#475569' : '#e2e8f0'} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: darkMode ? '#cbd5e1' : '#475569' }}
                  stroke={darkMode ? '#475569' : '#cbd5e1'}
                />
                <YAxis 
                  tick={{ fill: darkMode ? '#cbd5e1' : '#475569' }}
                  stroke={darkMode ? '#475569' : '#cbd5e1'}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ color: darkMode ? '#cbd5e1' : '#475569' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Weight (kg)" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Calorie Surplus/Deficit */}
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} p-6 rounded-2xl shadow-xl animate-fade-in`}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className={`w-6 h-6 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Daily Calorie Surplus/Deficit
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={calorieData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#475569' : '#e2e8f0'} />
              <XAxis 
                dataKey="date" 
                tick={{ fill: darkMode ? '#cbd5e1' : '#475569' }}
                stroke={darkMode ? '#475569' : '#cbd5e1'}
              />
              <YAxis 
                tick={{ fill: darkMode ? '#cbd5e1' : '#475569' }}
                stroke={darkMode ? '#475569' : '#cbd5e1'}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ color: darkMode ? '#cbd5e1' : '#475569' }}
              />
              <Bar dataKey="netCalories" name="Net Calories (Consumed - Burned)">
                {calorieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.netCalories > 0 ? '#ff6b6b' : '#51cf66'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className={`mt-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Positive values (red) indicate surplus, negative values (green) indicate deficit
          </p>
        </div>
      </div>
    </div>
  );
};

export default Progress;
