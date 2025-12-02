import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Calculator, Ruler, Scale, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

const BMI = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [unitSystem, setUnitSystem] = useState('metric'); // 'metric' or 'imperial'
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [heightFeet, setHeightFeet] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const [weightLbs, setWeightLbs] = useState('');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const calculateBMI = (h, w) => {
    if (h && w && h > 0 && w > 0) {
      let heightInMeters, weightInKg;
      
      if (unitSystem === 'metric') {
        heightInMeters = h / 100; // Convert cm to meters
        weightInKg = w;
      } else {
        // Convert feet and inches to meters
        const totalInches = (parseFloat(heightFeet) || 0) * 12 + (parseFloat(heightInches) || 0);
        heightInMeters = totalInches * 0.0254;
        // Convert lbs to kg
        weightInKg = (parseFloat(weightLbs) || 0) / 2.20462;
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
    }
  };

  const handleCalculate = () => {
    if (unitSystem === 'metric') {
      if (height && weight) {
        calculateBMI(parseFloat(height), parseFloat(weight));
      } else {
        setMessage({ type: 'error', text: 'Please enter both height and weight' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } else {
      if ((heightFeet || heightInches) && weightLbs) {
        calculateBMI(null, null);
      } else {
        setMessage({ type: 'error', text: 'Please enter both height and weight' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    }
  };

  const handleSave = async () => {
    let heightInCm, weightInKg;
    
    if (unitSystem === 'metric') {
      if (!height || !weight) {
        setMessage({ type: 'error', text: 'Please enter both height and weight' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        return;
      }
      heightInCm = parseFloat(height);
      weightInKg = parseFloat(weight);
    } else {
      if ((!heightFeet && !heightInches) || !weightLbs) {
        setMessage({ type: 'error', text: 'Please enter both height and weight' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        return;
      }
      // Convert imperial to metric
      const totalInches = (parseFloat(heightFeet) || 0) * 12 + (parseFloat(heightInches) || 0);
      heightInCm = totalInches * 2.54;
      weightInKg = parseFloat(weightLbs) / 2.20462;
    }

    setLoading(true);
    try {
      await api.put('/auth/profile', {
        height: heightInCm,
        weight: weightInKg,
      });
      updateUser({
        height: heightInCm,
        weight: weightInKg,
      });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Error updating profile' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-[#1F1F1F]">
            BMI Calculator
          </h1>
          <p className="text-gray-600">
            Calculate your Body Mass Index
          </p>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 animate-fade-in border-2 ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="bg-white border-2 border-gray-200 p-6 rounded-lg animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-6 h-6 text-[#1F1F1F]" />
              <h2 className="text-2xl font-bold text-[#1F1F1F]">
                Enter Your Details
              </h2>
            </div>
            <div className="space-y-4">
              {/* Unit System Toggle */}
              <div className="mb-4">
                <label className="block mb-3 font-bold text-lg text-[#1F1F1F]">
                  Choose Unit System
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setUnitSystem('metric');
                      // Clear imperial values
                      setHeightFeet('');
                      setHeightInches('');
                      setWeightLbs('');
                    }}
                    className={`flex-1 px-6 py-3 rounded-lg border-2 transition-all font-bold text-base ${
                      unitSystem === 'metric'
                        ? 'bg-[#1F1F1F] text-white border-[#1F1F1F] shadow-lg'
                        : 'bg-white text-[#1F1F1F] border-gray-300 hover:border-[#1F1F1F] hover:shadow-md'
                    }`}
                  >
                    Metric (cm/kg)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUnitSystem('imperial');
                      // Convert metric to imperial if values exist
                      if (height) {
                        const totalInches = parseFloat(height) / 2.54;
                        setHeightFeet(Math.floor(totalInches / 12).toString());
                        setHeightInches(Math.round(totalInches % 12).toString());
                      }
                      if (weight) {
                        setWeightLbs((parseFloat(weight) * 2.20462).toFixed(1));
                      }
                      // Clear metric values
                      setHeight('');
                      setWeight('');
                    }}
                    className={`flex-1 px-6 py-3 rounded-lg border-2 transition-all font-bold text-base ${
                      unitSystem === 'imperial'
                        ? 'bg-[#1F1F1F] text-white border-[#1F1F1F] shadow-lg'
                        : 'bg-white text-[#1F1F1F] border-gray-300 hover:border-[#1F1F1F] hover:shadow-md'
                    }`}
                  >
                    Imperial (ft/in, lbs)
                  </button>
                </div>
              </div>

              {unitSystem === 'metric' ? (
                <>
                  <div>
                    <label className="block mb-2 font-semibold text-[#1F1F1F]">
                      <Ruler className="w-4 h-4 inline mr-1" />
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => {
                        setHeight(e.target.value);
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] bg-white text-[#1F1F1F] transition-colors"
                      placeholder="e.g., 175"
                      min="1"
                      max="300"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold text-[#1F1F1F]">
                      <Scale className="w-4 h-4 inline mr-1" />
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => {
                        setWeight(e.target.value);
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] bg-white text-[#1F1F1F] transition-colors"
                      placeholder="e.g., 70"
                      min="1"
                      max="500"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block mb-2 font-semibold text-[#1F1F1F]">
                      <Ruler className="w-4 h-4 inline mr-1" />
                      Height
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <input
                          type="number"
                          value={heightFeet}
                          onChange={(e) => {
                            setHeightFeet(e.target.value);
                          }}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] bg-white text-[#1F1F1F] transition-colors"
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
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] bg-white text-[#1F1F1F] transition-colors"
                          placeholder="Inches"
                          min="0"
                          max="11"
                        />
                        <span className="text-xs text-gray-500 mt-1 block">Inches</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold text-[#1F1F1F]">
                      <Scale className="w-4 h-4 inline mr-1" />
                      Weight (lbs)
                    </label>
                    <input
                      type="number"
                      value={weightLbs}
                      onChange={(e) => {
                        setWeightLbs(e.target.value);
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1F1F1F] bg-white text-[#1F1F1F] transition-colors"
                      placeholder="e.g., 154"
                      min="1"
                      max="1000"
                      step="0.1"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleCalculate}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#1F1F1F] text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                >
                  <Calculator className="w-5 h-5" />
                  Calculate BMI
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading || (unitSystem === 'metric' ? (!height || !weight) : (!heightFeet && !heightInches || !weightLbs))}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  <Save className="w-5 h-5" />
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white border-2 border-gray-200 p-6 rounded-lg animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 text-[#1F1F1F]">
              Your BMI Result
            </h2>
            {bmi ? (
              <div className="text-center">
                <div className={`mb-6 p-8 rounded-lg ${getCategoryBgColor()} text-white`}>
                  <div className="text-7xl font-bold mb-2">{bmi}</div>
                  <div className={`text-3xl font-bold bg-white/20 rounded-lg px-4 py-2 inline-block ${getCategoryColor()}`}>
                    {category}
                  </div>
                </div>
                <div className="mt-8 space-y-3 text-left text-gray-700">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">Underweight: &lt; 18.5</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Normal: 18.5 - 24.9</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium">Overweight: 25 - 29.9</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="font-medium">Obese: ≥ 30</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Enter your height and weight to calculate your BMI</p>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-white border-2 border-gray-200 p-6 rounded-lg mt-6 animate-fade-in">
          <h2 className="text-2xl font-bold mb-4 text-[#1F1F1F]">
            About BMI
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Body Mass Index (BMI) is a measure of body fat based on height and weight. 
            It provides a general indication of whether a person has a healthy body weight. 
            However, BMI doesn't account for muscle mass, bone density, or overall body composition, 
            so it should be used as a general guide rather than a definitive measure of health.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BMI;
