import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff, Calendar, AlertCircle, Loader, Info } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthdate: '',
    gender: '',
    country: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    // Combine first and last name for registration
    const name = `${formData.firstName} ${formData.lastName}`.trim();
    const result = await register(name, formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-[#1F1F1F] mb-2 text-center">Welcome to CalTrack</h1>
          <p className="text-center text-gray-600 mb-8">
            Already a member?{' '}
            <Link to="/login" className="underline text-[#1F1F1F] hover:text-gray-600">
              Log In
            </Link>
          </p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[#1F1F1F] font-medium mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#1F1F1F] transition-colors"
                placeholder="Enter First Name"
                required
              />
            </div>

            <div>
              <label className="block text-[#1F1F1F] font-medium mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#1F1F1F] transition-colors"
                placeholder="Enter Last Name"
                required
              />
            </div>

            <div>
              <label className="block text-[#1F1F1F] font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#1F1F1F] transition-colors"
                placeholder="Enter Email"
                required
              />
            </div>

            <div>
              <label className="block text-[#1F1F1F] font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#1F1F1F] transition-colors pr-12"
                  placeholder="Enter Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#1F1F1F]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[#1F1F1F] font-medium mb-2">
                Birthdate
                <span className="ml-1 text-gray-400">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#1F1F1F] transition-colors pr-12"
                  placeholder="dd-mm-yyyy"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[#1F1F1F] font-medium mb-2 flex items-center gap-1">
                Gender
                <Info className="w-4 h-4 text-gray-400" />
                <span className="ml-1 text-gray-400">(Optional)</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#1F1F1F] transition-colors appearance-none bg-white"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-[#1F1F1F] font-medium mb-2">
                Country/Region
                <span className="ml-1 text-gray-400">(Optional)</span>
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#1F1F1F] transition-colors"
                placeholder="Enter Country/Region"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1F1F1F] text-white py-3 px-4 font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                'SIGN UP'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
