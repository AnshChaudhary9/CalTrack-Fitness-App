import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { 
  Activity, 
  Flame, 
  Target, 
  Plus, 
  Apple, 
  TrendingUp,
  Quote,
  Sparkles,
  Calculator,
  Ruler,
  Scale,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar as CalendarIcon,
  Award,
  UtensilsCrossed
} from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Dashboard = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalCalories: 0,
    totalGoals: 0,
  });
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(true);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [todaySummary, setTodaySummary] = useState({
    caloriesBurned: 0,
    caloriesConsumed: 0,
    workouts: 0,
  });
  const [upcomingGoals, setUpcomingGoals] = useState([]);
  
  // BMI Calculator state
  const [heightUnit, setHeightUnit] = useState('metric'); // 'metric' (cm) or 'imperial' (ft/in)
  const [weightUnit, setWeightUnit] = useState('metric'); // 'metric' (kg) or 'imperial' (lbs)
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [heightFeet, setHeightFeet] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const [weightLbs, setWeightLbs] = useState('');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');
  const [bmiLoading, setBmiLoading] = useState(false);
  const [bmiMessage, setBmiMessage] = useState({ type: '', text: '' });
  
  // Calendar state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarEvents, setCalendarEvents] = useState({});
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    fetchQuote();
    fetchCalendarEvents();
  }, []);

  useEffect(() => {
    loadDateEvents(selectedDate);
  }, [selectedDate, calendarEvents]);

  const fetchDashboardData = async () => {
    try {
      const [workoutsRes, goalsRes, dietRes, recentWorkoutsRes] = await Promise.all([
        api.get('/workouts/stats'),
        api.get('/goals'),
        api.get('/diet/summary'),
        api.get('/workouts?limit=3'),
      ]);

      setStats({
        totalWorkouts: workoutsRes.data.totalWorkouts || 0,
        totalCalories: workoutsRes.data.totalCalories || 0,
        totalGoals: goalsRes.data.length || 0,
      });

      // Today's summary
      const today = new Date().toISOString().split('T')[0];
      const todayWorkouts = recentWorkoutsRes.data.filter(w => 
        w.date && w.date.startsWith(today)
      );
      
      setTodaySummary({
        caloriesBurned: todayWorkouts.reduce((sum, w) => sum + (w.calories || 0), 0),
        caloriesConsumed: dietRes.data?.total?.calories || 0,
        workouts: todayWorkouts.length,
      });

      setRecentWorkouts(recentWorkoutsRes.data.slice(0, 3) || []);
      
      // Upcoming goals (not completed)
      const activeGoals = goalsRes.data.filter(g => !g.completed).slice(0, 3);
      setUpcomingGoals(activeGoals);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCalendarEvents = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(endDate.getMonth() - 1);
      endDate.setMonth(endDate.getMonth() + 1);

      const [workoutsRes, dietRes] = await Promise.all([
        api.get(`/workouts?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`),
        api.get(`/diet?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`),
      ]);

      // Create events map
      const eventsMap = {};
      workoutsRes.data.forEach((workout) => {
        const date = new Date(workout.date).toISOString().split('T')[0];
        if (!eventsMap[date]) eventsMap[date] = [];
        // Ensure workout has name and type
        eventsMap[date].push({ 
          type: 'workout', 
          name: workout.name || 'Workout',
          calories: workout.calories || 0,
          duration: workout.duration || 0,
          date: workout.date,
          ...workout 
        });
      });
      dietRes.data.forEach((entry) => {
        const date = new Date(entry.date).toISOString().split('T')[0];
        if (!eventsMap[date]) eventsMap[date] = [];
        eventsMap[date].push({ 
          type: 'diet', 
          foodName: entry.foodName || entry.mealType || 'Meal',
          mealType: entry.mealType || 'Meal',
          calories: entry.calories || 0,
          date: entry.date,
          ...entry 
        });
      });
      setCalendarEvents(eventsMap);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    }
  };

  const loadDateEvents = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDateEvents(calendarEvents[dateStr] || []);
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      const dayEvents = calendarEvents[dateStr] || [];
      if (dayEvents.length > 0) {
        return (
          <div className="flex gap-0.5 justify-center mt-1">
            {dayEvents.slice(0, 3).map((event, idx) => {
              const eventName = event.type === 'workout' 
                ? (event.name || 'Workout')
                : (event.foodName || event.mealType || 'Meal');
              const eventCalories = event.calories || 0;
              return (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full ${
                    event.type === 'workout' ? 'bg-blue-500' : 'bg-green-500'
                  }`}
                  title={`${eventName} - ${eventCalories} cal`}
                />
              );
            })}
            {dayEvents.length > 3 && (
              <div 
                className="w-1.5 h-1.5 rounded-full bg-gray-400" 
                title={`${dayEvents.length - 3} more events`} 
              />
            )}
          </div>
        );
      }
    }
    return null;
  };

  const fetchQuote = async () => {
    try {
      const response = await fetch('https://zenquotes.io/api/today');
      const data = await response.json();
      if (data && data[0]) {
        setQuote(`${data[0].q} - ${data[0].a}`);
      }
    } catch (error) {
      setQuote('The only bad workout is the one that didn\'t happen.');
    }
  };

  const calculateBMI = (h, w) => {
    let heightInMeters, weightInKg;
    
    // Convert height to meters
    if (heightUnit === 'metric') {
      if (h && h > 0) {
        heightInMeters = h / 100; // Convert cm to meters
      } else if (height && parseFloat(height) > 0) {
        heightInMeters = parseFloat(height) / 100;
      } else {
        return;
      }
    } else {
      const totalInches = (parseFloat(heightFeet) || 0) * 12 + (parseFloat(heightInches) || 0);
      if (totalInches <= 0) return;
      heightInMeters = totalInches * 0.0254;
    }
    
    // Convert weight to kg
    if (weightUnit === 'metric') {
      if (w && w > 0) {
        weightInKg = w;
      } else if (weight && parseFloat(weight) > 0) {
        weightInKg = parseFloat(weight);
      } else {
        return;
      }
    } else {
      if (!weightLbs || parseFloat(weightLbs) <= 0) return;
      weightInKg = parseFloat(weightLbs) / 2.20462;
    }
    
    if (heightInMeters > 0 && weightInKg > 0) {
      const bmiValue = weightInKg / (heightInMeters * heightInMeters);
      setBmi(bmiValue.toFixed(1));

      if (bmiValue < 18.5) {
        setCategory('Underweight');
      } else if (bmiValue < 25) {
        setCategory('Normal');
      } else if (bmiValue < 30) {
        setCategory('Overweight');
      } else {
        setCategory('Obese');
      }
    }
  };

  const handleBMICalculate = () => {
    // Validate height
    const hasHeight = heightUnit === 'metric' 
      ? (height && parseFloat(height) > 0)
      : ((heightFeet || heightInches) && ((parseFloat(heightFeet) || 0) * 12 + (parseFloat(heightInches) || 0)) > 0);
    
    // Validate weight
    const hasWeight = weightUnit === 'metric'
      ? (weight && parseFloat(weight) > 0)
      : (weightLbs && parseFloat(weightLbs) > 0);
    
    if (hasHeight && hasWeight) {
      calculateBMI(null, null);
    } else {
      setBmiMessage({ type: 'error', text: 'Please enter both height and weight' });
      setTimeout(() => setBmiMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleBMISave = async () => {
    let heightInCm, weightInKg;
    
    // Convert height to cm
    if (heightUnit === 'metric') {
      if (!height || parseFloat(height) <= 0) {
        setBmiMessage({ type: 'error', text: 'Please enter height' });
        setTimeout(() => setBmiMessage({ type: '', text: '' }), 3000);
        return;
      }
      heightInCm = parseFloat(height);
    } else {
      const totalInches = (parseFloat(heightFeet) || 0) * 12 + (parseFloat(heightInches) || 0);
      if (totalInches <= 0) {
        setBmiMessage({ type: 'error', text: 'Please enter height' });
        setTimeout(() => setBmiMessage({ type: '', text: '' }), 3000);
        return;
      }
      heightInCm = totalInches * 2.54;
    }
    
    // Convert weight to kg
    if (weightUnit === 'metric') {
      if (!weight || parseFloat(weight) <= 0) {
        setBmiMessage({ type: 'error', text: 'Please enter weight' });
        setTimeout(() => setBmiMessage({ type: '', text: '' }), 3000);
        return;
      }
      weightInKg = parseFloat(weight);
    } else {
      if (!weightLbs || parseFloat(weightLbs) <= 0) {
        setBmiMessage({ type: 'error', text: 'Please enter weight' });
        setTimeout(() => setBmiMessage({ type: '', text: '' }), 3000);
        return;
      }
      weightInKg = parseFloat(weightLbs) / 2.20462;
    }

    setBmiLoading(true);
    try {
      await api.put('/auth/profile', {
        height: heightInCm,
        weight: weightInKg,
      });
      updateUser({
        height: heightInCm,
        weight: weightInKg,
      });
      setBmiMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setBmiMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setBmiMessage({ type: 'error', text: 'Error updating profile' });
      setTimeout(() => setBmiMessage({ type: '', text: '' }), 3000);
    } finally {
      setBmiLoading(false);
    }
  };

  const getCategoryColor = () => {
    switch (category) {
      case 'Underweight':
        return 'text-blue-600';
      case 'Normal':
        return 'text-green-600';
      case 'Overweight':
        return 'text-yellow-600';
      case 'Obese':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getCategoryBgColor = () => {
    switch (category) {
      case 'Underweight':
        return 'bg-blue-600';
      case 'Normal':
        return 'bg-green-600';
      case 'Overweight':
        return 'bg-yellow-600';
      case 'Obese':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="spinner"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Workouts',
      value: stats.totalWorkouts,
      icon: Activity,
    },
    {
      title: 'Calories Burned',
      value: stats.totalCalories.toLocaleString(),
      icon: Flame,
    },
    {
      title: 'Active Goals',
      value: stats.totalGoals,
      icon: Target,
    },
  ];

  const quickActions = [
    {
      title: 'Add Workout',
      icon: Plus,
      to: '/workouts',
    },
    {
      title: 'Log Meal',
      icon: Apple,
      to: '/diet',
    },
    {
      title: 'Set Goal',
      icon: Target,
      to: '/goals',
    },
    {
      title: 'View Progress',
      icon: TrendingUp,
      to: '/progress',
    },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Background Image - covers entire page including footer */}
      <div 
        className="fixed inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Welcome Header - Centered */}
        <div className="mb-8 animate-fade-in text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-[#1F1F1F]">
            Hey {user?.name}!! Welcome to CalTrack
          </h1>
          <p className="text-lg text-gray-600">
            Let's make today count 💪
          </p>
        </div>

        {/* Motivational Quote - Centered with Liquid Glass Effect */}
        {quote && (
          <div className="mb-8 flex justify-center animate-scale-in">
            <div 
              className="max-w-2xl w-full p-6 rounded-xl text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <p className="text-lg md:text-xl text-[#1F1F1F] font-medium leading-relaxed">
                "{quote}"
              </p>
            </div>
          </div>
        )}

        {/* Today's Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div 
            className="p-6 rounded-xl shadow-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Today's Workouts</p>
                <p className="text-2xl font-bold text-[#1F1F1F]">{todaySummary.workouts}</p>
              </div>
              <Activity className="w-8 h-8 text-[#1F1F1F]" />
            </div>
          </div>
          <div 
            className="p-6 rounded-xl shadow-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Calories Burned</p>
                <p className="text-2xl font-bold text-[#1F1F1F]">{todaySummary.caloriesBurned}</p>
              </div>
              <Flame className="w-8 h-8 text-[#1F1F1F]" />
            </div>
          </div>
          <div 
            className="p-6 rounded-xl shadow-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Calories Consumed</p>
                <p className="text-2xl font-bold text-[#1F1F1F]">{todaySummary.caloriesConsumed}</p>
              </div>
              <Apple className="w-8 h-8 text-[#1F1F1F]" />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="p-6 rounded-xl shadow-lg hover:opacity-90 transition-all duration-300 animate-fade-in"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium mb-2 text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-4xl font-bold text-[#1F1F1F]">
                      {stat.value}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#1F1F1F]">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* BMI Calculator */}
          <div className="lg:col-span-1 bg-white/95 backdrop-blur-sm border-2 border-gray-200 p-6 rounded-lg animate-fade-in shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-6 h-6 text-[#1F1F1F]" />
              <h2 className="text-2xl font-bold text-[#1F1F1F]">BMI Calculator</h2>
            </div>

            {bmiMessage.text && (
              <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
                bmiMessage.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {bmiMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span>{bmiMessage.text}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Height Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-[#1F1F1F]">
                    <Ruler className="w-4 h-4 inline mr-1" />
                    Height
                  </label>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (heightUnit === 'imperial' && (heightFeet || heightInches)) {
                          const totalInches = (parseFloat(heightFeet) || 0) * 12 + (parseFloat(heightInches) || 0);
                          setHeight((totalInches * 2.54).toFixed(1));
                        }
                        setHeightUnit('metric');
                        setHeightFeet('');
                        setHeightInches('');
                        setBmi(null);
                        setCategory('');
                      }}
                      className={`px-2 py-1 rounded text-xs font-semibold border transition-all ${
                        heightUnit === 'metric'
                          ? 'bg-[#1F1F1F] text-white border-[#1F1F1F]'
                          : 'bg-white text-[#1F1F1F] border-gray-300 hover:border-[#1F1F1F]'
                      }`}
                    >
                      cm
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (heightUnit === 'metric' && height) {
                          const totalInches = parseFloat(height) / 2.54;
                          setHeightFeet(Math.floor(totalInches / 12).toString());
                          setHeightInches(Math.round(totalInches % 12).toString());
                        }
                        setHeightUnit('imperial');
                        setHeight('');
                        setBmi(null);
                        setCategory('');
                      }}
                      className={`px-2 py-1 rounded text-xs font-semibold border transition-all ${
                        heightUnit === 'imperial'
                          ? 'bg-[#1F1F1F] text-white border-[#1F1F1F]'
                          : 'bg-white text-[#1F1F1F] border-gray-300 hover:border-[#1F1F1F]'
                      }`}
                    >
                      ft/in
                    </button>
                  </div>
                </div>
                {heightUnit === 'metric' ? (
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => {
                      setHeight(e.target.value);
                    }}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] bg-white text-[#1F1F1F] text-sm"
                    placeholder="e.g., 175"
                  />
                ) : (
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input
                        type="number"
                        value={heightFeet}
                        onChange={(e) => {
                          setHeightFeet(e.target.value);
                        }}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] bg-white text-[#1F1F1F] text-sm"
                        placeholder="Feet"
                        min="0"
                        max="10"
                      />
                      <span className="text-xs text-gray-500 mt-1 block">Feet</span>
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        value={heightInches}
                        onChange={(e) => {
                          setHeightInches(e.target.value);
                        }}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] bg-white text-[#1F1F1F] text-sm"
                        placeholder="Inches"
                        min="0"
                        max="11"
                      />
                      <span className="text-xs text-gray-500 mt-1 block">Inches</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Weight Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-[#1F1F1F]">
                    <Scale className="w-4 h-4 inline mr-1" />
                    Weight
                  </label>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (weightUnit === 'imperial' && weightLbs) {
                          setWeight((parseFloat(weightLbs) / 2.20462).toFixed(1));
                        }
                        setWeightUnit('metric');
                        setWeightLbs('');
                        setBmi(null);
                        setCategory('');
                      }}
                      className={`px-2 py-1 rounded text-xs font-semibold border transition-all ${
                        weightUnit === 'metric'
                          ? 'bg-[#1F1F1F] text-white border-[#1F1F1F]'
                          : 'bg-white text-[#1F1F1F] border-gray-300 hover:border-[#1F1F1F]'
                      }`}
                    >
                      kg
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (weightUnit === 'metric' && weight) {
                          setWeightLbs((parseFloat(weight) * 2.20462).toFixed(1));
                        }
                        setWeightUnit('imperial');
                        setWeight('');
                        setBmi(null);
                        setCategory('');
                      }}
                      className={`px-2 py-1 rounded text-xs font-semibold border transition-all ${
                        weightUnit === 'imperial'
                          ? 'bg-[#1F1F1F] text-white border-[#1F1F1F]'
                          : 'bg-white text-[#1F1F1F] border-gray-300 hover:border-[#1F1F1F]'
                      }`}
                    >
                      lbs
                    </button>
                  </div>
                </div>
                {weightUnit === 'metric' ? (
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => {
                      setWeight(e.target.value);
                    }}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] bg-white text-[#1F1F1F] text-sm"
                    placeholder="e.g., 70"
                  />
                ) : (
                  <input
                    type="number"
                    value={weightLbs}
                    onChange={(e) => {
                      setWeightLbs(e.target.value);
                    }}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] bg-white text-[#1F1F1F] text-sm"
                    placeholder="e.g., 154"
                    min="1"
                    max="1000"
                    step="0.1"
                  />
                )}
              </div>

              {bmi && (
                <div className={`p-4 rounded-lg ${getCategoryBgColor()} text-white text-center`}>
                  <div className="text-4xl font-bold mb-1">{bmi}</div>
                  <div className="text-sm font-medium">{category}</div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleBMICalculate}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#1F1F1F] text-white px-3 py-2 rounded-lg hover:bg-[#3A3A3A] transition-colors text-sm font-semibold"
                >
                  <Calculator className="w-4 h-4" />
                  Calculate
                </button>
                <button
                  onClick={handleBMISave}
                  disabled={bmiLoading || (heightUnit === 'metric' ? !height : (!heightFeet && !heightInches)) || (weightUnit === 'metric' ? !weight : !weightLbs)}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#3A3A3A] text-white px-3 py-2 rounded-lg hover:bg-[#3A3A3A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
                >
                  <Save className="w-4 h-4" />
                  {bmiLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>

          {/* Recent Workouts */}
          <div className="lg:col-span-1 bg-white/95 backdrop-blur-sm border-2 border-gray-200 p-6 rounded-lg animate-fade-in shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-6 h-6 text-[#1F1F1F]" />
                <h2 className="text-2xl font-bold text-[#1F1F1F]">Recent Workouts</h2>
              </div>
              <Link to="/workouts" className="text-sm text-gray-600 hover:text-[#1F1F1F]">
                View All
              </Link>
            </div>
            {recentWorkouts.length > 0 ? (
              <div className="space-y-3">
                {recentWorkouts.map((workout, index) => (
                  <div key={workout._id || index} className="p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-[#1F1F1F]">{workout.type}</p>
                      {workout.calories && (
                        <span className="text-sm text-gray-600">{workout.calories} cal</span>
                      )}
                    </div>
                    {workout.duration && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>{workout.duration} min</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent workouts</p>
                <Link to="/workouts" className="text-sm text-[#1F1F1F] hover:underline mt-2 inline-block">
                  Add your first workout
                </Link>
              </div>
            )}
          </div>

          {/* Calendar Widget */}
          <div className="lg:col-span-1 bg-white/95 backdrop-blur-sm border-2 border-gray-200 p-6 rounded-lg animate-fade-in shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-6 h-6 text-[#1F1F1F]" />
                <h2 className="text-2xl font-bold text-[#1F1F1F]">Calendar</h2>
              </div>
              <Link to="/calendar" className="text-sm text-gray-600 hover:text-[#1F1F1F]">
                View Full
              </Link>
            </div>
            
            <div className="mb-4">
              <style>{`
                .react-calendar {
                  width: 100%;
                  border: none;
                  font-family: inherit;
                }
                .react-calendar__navigation {
                  display: flex;
                  height: 44px;
                  margin-bottom: 1em;
                }
                .react-calendar__navigation button {
                  min-width: 44px;
                  background: none;
                  font-size: 16px;
                  font-weight: 600;
                  color: #1F1F1F;
                }
                .react-calendar__navigation button:enabled:hover,
                .react-calendar__navigation button:enabled:focus {
                  background-color: #f0f0f0;
                }
                .react-calendar__tile {
                  max-width: 100%;
                  padding: 8px 4px;
                  background: none;
                  text-align: center;
                  line-height: 16px;
                  font-size: 13px;
                  color: #1F1F1F;
                }
                .react-calendar__tile:enabled:hover,
                .react-calendar__tile:enabled:focus {
                  background-color: #f0f0f0;
                  border-radius: 4px;
                }
                .react-calendar__tile--active {
                  background: #1F1F1F !important;
                  color: white !important;
                  border-radius: 4px;
                }
                .react-calendar__tile--now {
                  background: #f5f5f5;
                  border-radius: 4px;
                }
                .react-calendar__month-view__weekdays {
                  text-align: center;
                  text-transform: uppercase;
                  font-weight: 600;
                  font-size: 11px;
                  color: #6F6F6F;
                }
                .react-calendar__month-view__weekdays__weekday {
                  padding: 0.5em;
                }
                .react-calendar__month-view__days__day--neighboringMonth {
                  color: #AFAFAF;
                }
              `}</style>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileContent={tileContent}
                className="w-full"
              />
            </div>

          </div>

          {/* Upcoming Goals */}
          <div className="lg:col-span-1 bg-white/95 backdrop-blur-sm border-2 border-gray-200 p-6 rounded-lg animate-fade-in shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-6 h-6 text-[#1F1F1F]" />
                <h2 className="text-2xl font-bold text-[#1F1F1F]">Active Goals</h2>
              </div>
              <Link to="/goals" className="text-sm text-gray-600 hover:text-[#1F1F1F]">
                View All
              </Link>
            </div>
            {upcomingGoals.length > 0 ? (
              <div className="space-y-3">
                {upcomingGoals.map((goal, index) => (
                  <div key={goal._id || index} className="p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="w-4 h-4 text-[#1F1F1F]" />
                      <p className="font-semibold text-[#1F1F1F]">{goal.title}</p>
                    </div>
                    {goal.target && (
                      <p className="text-sm text-gray-600">
                        Target: {goal.target} {goal.unit || ''}
                      </p>
                    )}
                    {goal.deadline && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <CalendarIcon className="w-3 h-3" />
                        <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No active goals</p>
                <Link to="/goals" className="text-sm text-[#1F1F1F] hover:underline mt-2 inline-block">
                  Set a new goal
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/95 backdrop-blur-sm border-2 border-gray-200 p-6 rounded-lg mb-8 animate-fade-in shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-[#1F1F1F]" />
            <h2 className="text-2xl font-bold text-[#1F1F1F]">
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  to={action.to}
                  className="group relative overflow-hidden bg-[#1F1F1F] text-white p-6 rounded-lg hover:bg-[#3A3A3A] transition-all duration-300 animate-scale-in border-2 border-[#1F1F1F]"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <Icon className="w-8 h-8" />
                    <span className="font-semibold text-center">{action.title}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
