import { useState } from 'react';
import { X, Target, Save } from 'lucide-react';
import api from '../utils/api';

const WorkoutGoalsModal = ({ isOpen, onClose, onSave, existingGoals }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    primaryGoal: existingGoals?.primaryGoal || '',
    focusArea: existingGoals?.focusArea || [],
    trainingLevel: existingGoals?.trainingLevel || '',
    workoutType: existingGoals?.workoutType || [],
  });
  const [saving, setSaving] = useState(false);

  const primaryGoals = [
    'Lose Weight',
    'Gain Weight',
    'Gain Muscle Mass',
    'Build Strength',
    'Improve Endurance',
    'Maintain Fitness',
  ];

  const focusAreas = [
    'Full Body',
    'Upper Body',
    'Lower Body',
    'Chest',
    'Back',
    'Shoulders',
    'Arms',
    'Legs',
    'Abs/Core',
  ];

  const workoutTypes = [
    'Gym Workouts',
    'Home Workouts',
    'Cardio',
    'Yoga',
    'Bodyweight',
  ];

  const trainingLevels = ['Beginner', 'Intermediate', 'Advanced'];

  const handleFocusAreaToggle = (area) => {
    setFormData(prev => ({
      ...prev,
      focusArea: prev.focusArea.includes(area)
        ? prev.focusArea.filter(a => a !== area)
        : [...prev.focusArea, area],
    }));
  };

  const handleWorkoutTypeToggle = (type) => {
    setFormData(prev => ({
      ...prev,
      workoutType: prev.workoutType.includes(type)
        ? prev.workoutType.filter(t => t !== type)
        : [...prev.workoutType, type],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 4) {
      // Validate before moving to next step
      if (step === 1 && !formData.primaryGoal) {
        alert('Please select your primary goal');
        return;
      }
      if (step === 2 && formData.focusArea.length === 0) {
        alert('Please select at least one focus area');
        return;
      }
      if (step === 3 && formData.workoutType.length === 0) {
        alert('Please select at least one workout type');
        return;
      }
      setStep(step + 1);
      return;
    }

    // Final step - validate and save goals
    if (!formData.primaryGoal) {
      alert('Please select your primary goal');
      return;
    }
    if (formData.focusArea.length === 0) {
      alert('Please select at least one focus area');
      return;
    }
    if (formData.workoutType.length === 0) {
      alert('Please select at least one workout type');
      return;
    }
    if (!formData.trainingLevel) {
      alert('Please select your training level');
      return;
    }

    setSaving(true);
    try {
      const response = await api.post('/user/goals', {
        primaryGoal: formData.primaryGoal,
        focusArea: formData.focusArea,
        trainingLevel: formData.trainingLevel,
        workoutType: formData.workoutType,
      });
      if (onSave) {
        onSave(response.data);
      }
      onClose();
    } catch (error) {
      console.error('Error saving goals:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error saving goals';
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#1F1F1F]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#1F1F1F] flex items-center gap-2">
            <Target className="w-6 h-6" />
            Set Your Fitness Goals
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Step 1: Primary Goal */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#1F1F1F] mb-4">
                What is your primary goal?
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {primaryGoals.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setFormData({ ...formData, primaryGoal: goal })}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      formData.primaryGoal === goal
                        ? 'border-[#1F1F1F] bg-[#1F1F1F] text-white'
                        : 'border-gray-300 hover:border-[#1F1F1F] bg-white text-[#1F1F1F]'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Focus Area */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#1F1F1F] mb-4">
                What muscles do you want to focus on? (Select all that apply)
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {focusAreas.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => handleFocusAreaToggle(area)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.focusArea.includes(area)
                        ? 'border-[#1F1F1F] bg-[#1F1F1F] text-white'
                        : 'border-gray-300 hover:border-[#1F1F1F] bg-white text-[#1F1F1F]'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Workout Type */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#1F1F1F] mb-4">
                Preferred style of training? (Select all that apply)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {workoutTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleWorkoutTypeToggle(type)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      formData.workoutType.includes(type)
                        ? 'border-[#1F1F1F] bg-[#1F1F1F] text-white'
                        : 'border-gray-300 hover:border-[#1F1F1F] bg-white text-[#1F1F1F]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Training Level */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#1F1F1F] mb-4">
                Your training level?
              </h3>
              <div className="space-y-3">
                {trainingLevels.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({ ...formData, trainingLevel: level })}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      formData.trainingLevel === level
                        ? 'border-[#1F1F1F] bg-[#1F1F1F] text-white'
                        : 'border-gray-300 hover:border-[#1F1F1F] bg-white text-[#1F1F1F]'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => step > 1 ? setStep(step - 1) : onClose()}
              className="px-6 py-3 rounded-lg font-semibold bg-gray-200 hover:bg-gray-300 text-[#1F1F1F] transition-colors"
            >
              {step > 1 ? 'Back' : 'Cancel'}
            </button>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`w-2 h-2 rounded-full ${
                    s === step ? 'bg-[#1F1F1F]' : s < step ? 'bg-gray-400' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <button
              type="submit"
              disabled={
                saving || 
                (step === 1 && !formData.primaryGoal) || 
                (step === 2 && formData.focusArea.length === 0) ||
                (step === 3 && formData.workoutType.length === 0) ||
                (step === 4 && (!formData.trainingLevel || formData.focusArea.length === 0 || formData.workoutType.length === 0))
              }
              className="px-6 py-3 rounded-lg font-semibold bg-[#1F1F1F] hover:bg-gray-800 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                'Saving...'
              ) : step === 4 ? (
                <>
                  <Save className="w-4 h-4" />
                  Save Goals
                </>
              ) : (
                'Next'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkoutGoalsModal;

