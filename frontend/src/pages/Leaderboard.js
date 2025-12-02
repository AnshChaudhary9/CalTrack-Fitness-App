import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Trophy, Medal, Award, Loader, Activity, Flame } from 'lucide-react';

const Leaderboard = ({ darkMode }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [type, setType] = useState('workouts');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [type]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const endpoint = type === 'workouts' ? '/leaderboard/workouts' : '/leaderboard/calories';
      const res = await api.get(endpoint);
      setLeaderboard(res.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-600" />;
      default:
        return <span className="text-lg font-bold">#{rank}</span>;
    }
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
              Community Leaderboard
            </h1>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              See how you rank among fitness enthusiasts
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setType('workouts')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-semibold ${
                type === 'workouts'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : darkMode
                  ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Activity className="w-4 h-4" />
              By Workouts
            </button>
            <button
              onClick={() => setType('calories')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-semibold ${
                type === 'calories'
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg'
                  : darkMode
                  ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Flame className="w-4 h-4" />
              By Calories
            </button>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-xl overflow-hidden animate-fade-in`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                <tr>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Rank
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Name
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {type === 'workouts' ? 'Total Workouts' : 'Total Calories'}
                  </th>
                  {type === 'calories' && (
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Total Workouts
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-slate-700' : 'divide-gray-200'}`}>
                {leaderboard.length === 0 ? (
                  <tr>
                    <td 
                      colSpan={type === 'calories' ? 4 : 3} 
                      className={`px-6 py-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                    >
                      No leaderboard data available
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((user, index) => (
                    <tr
                      key={user._id}
                      className={`transition-colors duration-200 ${
                        darkMode 
                          ? 'hover:bg-slate-700' 
                          : 'hover:bg-gray-50'
                      } ${
                        user.rank <= 3 
                          ? darkMode
                            ? 'bg-yellow-900/20'
                            : 'bg-yellow-50'
                          : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center w-12">
                          {getRankIcon(user.rank)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {user.name}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {type === 'workouts'
                            ? user.totalWorkouts
                            : user.totalCalories.toLocaleString()}
                        </div>
                      </td>
                      {type === 'calories' && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {user.totalWorkouts}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {leaderboard.length > 0 && (
          <div className={`mt-6 p-4 rounded-xl ${
            darkMode 
              ? 'bg-blue-900/20 border border-blue-800 text-blue-300' 
              : 'bg-blue-50 border border-blue-200 text-blue-700'
          } animate-fade-in`}>
            <p className="text-sm flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Top performers are highlighted in gold. Keep pushing to reach the top!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
