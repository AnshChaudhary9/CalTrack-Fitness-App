import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import api from '../utils/api';
import { Calendar as CalendarIcon, Activity, UtensilsCrossed, Loader } from 'lucide-react';

const CalendarPage = ({ darkMode }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [workouts, setWorkouts] = useState([]);
  const [dietEntries, setDietEntries] = useState([]);
  const [events, setEvents] = useState({});
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    loadDateEvents(selectedDate);
  }, [selectedDate, workouts, dietEntries]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(endDate.getMonth() - 1);
      endDate.setMonth(endDate.getMonth() + 1);

      const [workoutsRes, dietRes] = await Promise.all([
        api.get(`/workouts?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`),
        api.get(`/diet?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`),
      ]);

      // Store raw data
      setWorkouts(workoutsRes.data || []);
      setDietEntries(dietRes.data || []);

      // Create events map with explicit type and name fields
      const eventsMap = {};
      
      // Process workouts
      (workoutsRes.data || []).forEach((workout) => {
        if (!workout || !workout.date) return;
        try {
          const date = new Date(workout.date).toISOString().split('T')[0];
          if (!eventsMap[date]) eventsMap[date] = [];
          // Ensure workout has name and type - set type first, then spread workout
          eventsMap[date].push({ 
            ...workout,
            type: 'workout', // Override any existing type field
            name: workout.name || 'Workout', // Ensure name exists
            calories: workout.calories || 0,
            duration: workout.duration || 0,
          });
        } catch (error) {
          console.error('Error processing workout:', workout, error);
        }
      });
      
      // Process diet entries
      (dietRes.data || []).forEach((entry) => {
        if (!entry || !entry.date) return;
        try {
          const date = new Date(entry.date).toISOString().split('T')[0];
          if (!eventsMap[date]) eventsMap[date] = [];
          eventsMap[date].push({ 
            ...entry,
            type: 'diet', // Override any existing type field
            foodName: entry.foodName || entry.mealType || 'Meal',
            mealType: entry.mealType || 'Meal',
            calories: entry.calories || 0,
          });
        } catch (error) {
          console.error('Error processing diet entry:', entry, error);
        }
      });
      
      setEvents(eventsMap);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDateEvents = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayWorkouts = workouts
      .filter((w) => {
        if (!w || !w.date) return false;
        const workoutDate = new Date(w.date).toISOString().split('T')[0];
        return workoutDate === dateStr;
      })
      .map((w) => {
        // Ensure type is set correctly - spread first, then override type
        const event = {
          ...w,
          type: 'workout', // Always override to ensure correct type
          name: w.name || w.title || 'Workout',
          calories: w.calories || 0,
          duration: w.duration || 0,
        };
        console.log('Processing workout event:', event);
        return event;
      });
    const dayDiet = dietEntries
      .filter((d) => {
        if (!d || !d.date) return false;
        const dietDate = new Date(d.date).toISOString().split('T')[0];
        return dietDate === dateStr;
      })
      .map((d) => {
        // Ensure type is set correctly - spread first, then override type
        const event = {
          ...d,
          type: 'diet', // Always override to ensure correct type
          foodName: d.foodName || d.mealType || 'Meal',
          mealType: d.mealType || 'Meal',
          calories: d.calories || 0,
        };
        return event;
      });
    
    console.log('Selected events for date:', dateStr, {
      workouts: dayWorkouts,
      diet: dayDiet,
      all: [...dayWorkouts, ...dayDiet]
    });
    
    setSelectedEvents([...dayWorkouts, ...dayDiet]);
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      const dayEvents = events[dateStr] || [];
      if (dayEvents.length > 0) {
        return (
          <div className="flex gap-1 justify-center mt-1">
            {dayEvents.map((event, idx) => {
              const eventName = event.type === 'workout' 
                ? (event.name || 'Workout')
                : (event.foodName || event.mealType || 'Meal');
              const eventCalories = event.calories || 0;
              return (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full ${
                    event.type === 'workout' ? 'bg-blue-500' : 'bg-green-500'
                  }`}
                  title={`${eventName} - ${eventCalories} cal`}
                />
              );
            })}
          </div>
        );
      }
    }
    return null;
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      if (events[dateStr] && events[dateStr].length > 0) {
        return 'has-events';
      }
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
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-gray-50 to-purple-50'} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 animate-fade-in">
          <h1 className={`text-4xl md:text-5xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Calendar
          </h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            View your workouts and meals on the calendar
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} p-6 rounded-2xl shadow-xl animate-fade-in`}>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileContent={tileContent}
                tileClassName={tileClassName}
                className={`${darkMode ? 'react-calendar-dark' : ''}`}
              />
              <style>{`
                .react-calendar {
                  width: 100%;
                  border: none;
                  font-family: inherit;
                  background: ${darkMode ? '#1e293b' : 'transparent'};
                }
                .react-calendar__navigation {
                  background: ${darkMode ? '#334155' : '#f1f5f9'};
                  border-radius: 0.5rem;
                  margin-bottom: 1rem;
                }
                .react-calendar__navigation button {
                  color: ${darkMode ? '#e2e8f0' : '#1e293b'};
                  font-weight: 600;
                }
                .react-calendar__navigation button:hover {
                  background: ${darkMode ? '#475569' : '#e2e8f0'};
                }
                .react-calendar__tile {
                  color: ${darkMode ? '#e2e8f0' : '#1e293b'};
                  border-radius: 0.5rem;
                }
                .react-calendar__tile:hover {
                  background: ${darkMode ? '#475569' : '#f1f5f9'};
                }
                .react-calendar__tile--active {
                  background: #3b82f6 !important;
                  color: white !important;
                }
                .react-calendar__tile--now {
                  background: ${darkMode ? '#334155' : '#e0e7ff'};
                  border: 2px solid #3b82f6;
                }
                .react-calendar__tile.has-events {
                  background: ${darkMode ? '#1e3a8a' : '#dbeafe'};
                }
                .react-calendar__month-view__weekdays {
                  color: ${darkMode ? '#94a3b8' : '#64748b'};
                  font-weight: 600;
                }
              `}</style>
            </div>
          </div>

          {/* Events List */}
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} p-6 rounded-2xl shadow-xl animate-fade-in`}>
            <div className="flex items-center gap-2 mb-4">
              <CalendarIcon className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {selectedDate.toLocaleDateString()}
              </h2>
            </div>
            <div className="space-y-3">
              {selectedEvents.length === 0 ? (
                <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No events for this date
                </p>
              ) : (
                selectedEvents.map((event, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 hover-lift ${
                      event.type === 'workout'
                        ? darkMode
                          ? 'bg-blue-900/30 border-blue-700'
                          : 'bg-blue-50 border-blue-200'
                        : darkMode
                        ? 'bg-green-900/30 border-green-700'
                        : 'bg-green-50 border-green-200'
                    }`}
                  >
                    {event.type === 'workout' ? (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-5 h-5 text-blue-500" />
                          <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {event.name || event.title || 'Workout'}
                          </div>
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Workout • {event.duration || 0} min • {event.calories || 0} cal
                        </div>
                      </div>
                    ) : event.type === 'diet' ? (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <UtensilsCrossed className="w-5 h-5 text-green-500" />
                          <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {event.foodName || event.mealType || 'Meal'}
                          </div>
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {event.mealType || 'Meal'} • {event.calories || 0} cal
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-5 h-5 text-gray-500" />
                          <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {event.name || event.foodName || event.mealType || 'Event'}
                          </div>
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {event.calories || 0} cal
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
