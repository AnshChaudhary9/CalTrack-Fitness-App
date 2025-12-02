import { useState, useEffect } from 'react';
import api from '../utils/api';

const Goals = ({ darkMode }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetValue: '',
    currentValue: '0',
    unit: 'kg',
    targetDate: '',
  });

  useEffect(() => {
    fetchGoals();
  }, [filterStatus]);

  const fetchGoals = async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);
      
      const res = await api.get(`/goals?${params.toString()}`);
      setGoals(res.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGoal) {
        await api.put(`/goals/${editingGoal._id}`, formData);
      } else {
        await api.post('/goals', formData);
      }
      setShowModal(false);
      setEditingGoal(null);
      setFormData({
        title: '',
        description: '',
        targetValue: '',
        currentValue: '0',
        unit: 'kg',
        targetDate: '',
      });
      fetchGoals();
    } catch (error) {
      console.error('Error saving goal:', error);
      alert('Error saving goal');
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || '',
      targetValue: goal.targetValue,
      currentValue: goal.currentValue,
      unit: goal.unit,
      targetDate: new Date(goal.targetDate).toISOString().split('T')[0],
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await api.delete(`/goals/${id}`);
        fetchGoals();
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

  const calculateProgress = (current, target) => {
    if (target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 animate-fade-in">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-[#1F1F1F]">
              Goals
            </h1>
            <p className="text-gray-600">
              Set and track your fitness goals
            </p>
          </div>
          <button
            onClick={() => {
              setEditingGoal(null);
              setFormData({
                title: '',
                description: '',
                targetValue: '',
                currentValue: '0',
                unit: 'kg',
                targetDate: '',
              });
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-[#1F1F1F] text-white px-6 py-3 rounded-xl hover:bg-[#3A3A3A] transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
          >
            + Set Goal
          </button>
        </div>

        {/* Filter */}
        <div className="mb-6 animate-fade-in">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] transition-all duration-200 bg-white text-[#1F1F1F]"
          >
            <option value="">All Goals</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Goals List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal, index) => {
            const progress = calculateProgress(goal.currentValue, goal.targetValue);
            const daysRemaining = Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24));
            
            return (
              <div
                key={goal._id}
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
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1 text-[#1F1F1F]">
                      {goal.title}
                    </h3>
                    {goal.description && (
                      <p className="text-sm text-gray-600">
                        {goal.description}
                      </p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold text-white ${getStatusColor(goal.status)}`}>
                    {goal.status}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">
                      {goal.currentValue} / {goal.targetValue} {goal.unit}
                    </span>
                    <span className="font-bold text-[#1F1F1F]">
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full rounded-full h-4 bg-gray-200">
                    <div
                      className={`h-4 rounded-full transition-all duration-500 ${getStatusColor(goal.status)}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-sm mb-4 text-gray-600">
                  <p>Target Date: {new Date(goal.targetDate).toLocaleDateString()}</p>
                  {daysRemaining > 0 && goal.status === 'active' && (
                    <p className="text-green-600">{daysRemaining} days remaining</p>
                  )}
                  {daysRemaining < 0 && goal.status === 'active' && (
                    <p className="text-red-500">Overdue by {Math.abs(daysRemaining)} days</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(goal)}
                    className="flex-1 bg-[#1F1F1F] hover:bg-[#3A3A3A] text-white px-4 py-2 rounded-lg transition-all duration-200 font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(goal._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 font-semibold"
                  >
                    Delete
                  </button>
                </div>
            </div>
          );
        })}
          {goals.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <p className="text-xl font-semibold mb-2">No goals found</p>
              <p>Set your first goal to get started!</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#1F1F1F]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div 
            className="p-6 rounded-xl w-full max-w-md shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#1F1F1F]">
                {editingGoal ? 'Edit Goal' : 'Set New Goal'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingGoal(null);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 font-semibold text-[#1F1F1F]">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] transition-all duration-200 bg-white text-[#1F1F1F]"
                  required
                  placeholder="e.g., Lose 5kg"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-[#1F1F1F]">
                  Description (optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] transition-all duration-200 bg-white text-[#1F1F1F]"
                  rows="3"
                  placeholder="Add a description..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-semibold text-[#1F1F1F]">
                    Current Value
                  </label>
                  <input
                    type="number"
                    value={formData.currentValue}
                    onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] transition-all duration-200 bg-white text-[#1F1F1F]"
                    required
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-[#1F1F1F]">
                    Target Value
                  </label>
                  <input
                    type="number"
                    value={formData.targetValue}
                    onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] transition-all duration-200 bg-white text-[#1F1F1F]"
                    required
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 font-semibold text-[#1F1F1F]">
                  Unit
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] transition-all duration-200 bg-white text-[#1F1F1F]"
                  required
                >
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                  <option value="workouts">workouts</option>
                  <option value="calories">calories</option>
                  <option value="days">days</option>
                  <option value="other">other</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 font-semibold text-[#1F1F1F]">
                  Target Date
                </label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] transition-all duration-200 bg-white text-[#1F1F1F]"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#1F1F1F] hover:bg-[#3A3A3A] text-white px-4 py-3 rounded-lg transition-all duration-200 font-semibold"
                >
                  {editingGoal ? 'Update Goal' : 'Create Goal'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingGoal(null);
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
  );
};

export default Goals;

