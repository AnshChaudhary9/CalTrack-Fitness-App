import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Logo from './Logo';
import { 
  Activity, 
  Calendar, 
  Target, 
  TrendingUp, 
  Trophy, 
  UtensilsCrossed,
  LayoutDashboard,
  Menu,
  X,
  LogOut,
  User,
  Users,
  Settings
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/workouts', label: 'Workouts', icon: Activity },
    { to: '/diet', label: 'Food Diary', icon: UtensilsCrossed },
    { to: '/community', label: 'Community', icon: Users },
    { to: '/challenges', label: 'Challenges', icon: Target },
    { to: '/progress', label: 'Progress', icon: TrendingUp },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  // Pre-login navigation (for home, login, register pages)
  if (!user) {
    return (
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Logo />
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/workouts" className="text-[#1F1F1F] hover:text-[#6F6F6F] font-medium transition-colors">
                Workouts
              </Link>
              <Link to="/community" className="text-[#1F1F1F] hover:text-[#6F6F6F] font-medium transition-colors">
                Community
              </Link>
              <Link to="/challenges" className="text-[#1F1F1F] hover:text-[#6F6F6F] font-medium transition-colors">
                Challenges
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-[#1F1F1F] hover:text-[#6F6F6F] font-medium transition-colors"
              >
                LOG IN
              </Link>
              <Link
                to="/register"
                className="bg-[#1F1F1F] text-white px-6 py-2 font-medium hover:bg-[#3A3A3A] transition-colors"
              >
                SIGN UP
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Logged-in navigation
  return (
    <nav className="sticky top-0 z-50 py-4" style={{ background: 'transparent' }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo on the left with liquid glass effect */}
          <Link 
            to="/dashboard" 
            className="flex items-center gap-2 flex-shrink-0 hover:opacity-90 transition-opacity"
          >
            <div 
              className="p-2.5 rounded-xl" 
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div className="text-[#1F1F1F]">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-shrink-0"
                >
                  {/* Woman figure */}
                  <g>
                    {/* Head */}
                    <circle cx="30" cy="25" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
                    
                    {/* Body outline */}
                    <path
                      d="M 30 33 L 30 65"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    
                    {/* Left arm (bent, hand on neck) */}
                    <path
                      d="M 30 40 Q 20 35 18 30"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    
                    {/* Right arm */}
                    <path
                      d="M 30 40 L 40 50"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    
                    {/* Legs */}
                    <path
                      d="M 30 65 L 25 85"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M 30 65 L 35 85"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    
                    {/* Sports bra (filled black) */}
                    <rect x="25" y="33" width="10" height="8" fill="currentColor" />
                    
                    {/* Leggings (filled black) */}
                    <path
                      d="M 28 50 L 28 65 L 32 65 L 32 50 Z"
                      fill="currentColor"
                    />
                    
                    {/* Ponytail (filled black) */}
                    <path
                      d="M 22 25 Q 15 20 12 15 Q 10 10 15 8 Q 20 6 22 10"
                      fill="currentColor"
                    />
                    
                    {/* Small watch on right wrist */}
                    <rect x="38" y="48" width="4" height="3" stroke="currentColor" strokeWidth="1" fill="none" rx="0.5" />
                  </g>
                  
                  {/* Large Smartwatch */}
                  <g>
                    {/* Watch body */}
                    <rect x="55" y="20" width="35" height="45" rx="3" fill="none" stroke="currentColor" strokeWidth="3" />
                    
                    {/* Watch screen */}
                    <rect x="58" y="23" width="29" height="39" rx="2" fill="white" stroke="currentColor" strokeWidth="1" />
                    
                    {/* Watch button/crown */}
                    <rect x="92" y="38" width="3" height="8" fill="currentColor" rx="1" />
                    
                    {/* Watch strap */}
                    <rect x="55" y="65" width="35" height="8" fill="currentColor" />
                    
                    {/* Icons in 2x2 grid */}
                    {/* Heartbeat icon (top-left) */}
                    <g transform="translate(62, 28)">
                      <path d="M 4 6 Q 6 2 8 6 Q 10 2 12 6 L 12 10" stroke="currentColor" strokeWidth="2" fill="none" />
                      <path d="M 6 4 L 6 8 L 10 8 L 10 4" fill="currentColor" />
                    </g>
                    
                    {/* Water drop icon (top-right) */}
                    <g transform="translate(75, 28)">
                      <path d="M 6 2 Q 8 6 6 10 Q 4 8 6 2" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </g>
                    
                    {/* Bar graph icon (bottom-left) */}
                    <g transform="translate(62, 45)">
                      <rect x="2" y="6" width="2" height="4" fill="currentColor" />
                      <rect x="5" y="4" width="2" height="6" fill="currentColor" />
                      <rect x="8" y="2" width="2" height="8" fill="currentColor" />
                    </g>
                    
                    {/* Dumbbell icon (bottom-right) */}
                    <g transform="translate(75, 45)">
                      <rect x="2" y="4" width="8" height="2" fill="currentColor" />
                      <rect x="0" y="3" width="2" height="4" fill="currentColor" />
                      <rect x="10" y="3" width="2" height="4" fill="currentColor" />
                    </g>
                  </g>
                  
                  {/* Decorative elements - movement lines */}
                  <g opacity="0.3">
                    <path d="M 20 15 Q 15 10 10 8" stroke="currentColor" strokeWidth="1" fill="none" />
                    <path d="M 25 80 Q 20 75 15 70" stroke="currentColor" strokeWidth="1" fill="none" />
                    <circle cx="42" cy="52" r="1.5" fill="currentColor" />
                    <circle cx="45" cy="50" r="1" fill="currentColor" />
                  </g>
                </svg>
              </div>
            </div>
          </Link>

          {/* Pill-shaped navigation bar - centered with liquid glass effect */}
          <div className="flex-1 flex justify-center">
            <div 
              className="rounded-full px-6 py-3 shadow-2xl border border-white/20"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)',
              }}
            >
              <div className="hidden md:flex items-center space-x-4 flex-nowrap">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.to || 
                                   (link.to === '/workouts' && location.pathname.startsWith('/workouts'));
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center gap-2 px-3 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
                        isActive 
                          ? 'bg-white/20 text-[#1F1F1F] shadow-lg backdrop-blur-sm' 
                          : 'hover:bg-white/10 text-[#1F1F1F]/90 hover:text-[#1F1F1F]'
                      }`}
                      style={isActive ? {
                        boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.4), 0 4px 12px 0 rgba(0, 0, 0, 0.1)',
                      } : {}}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="whitespace-nowrap">{link.label}</span>
                    </Link>
                  );
                })}
              </div>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors text-[#1F1F1F]"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* User actions - on the right with liquid glass effect */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <Link
              to="/profile"
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-[#1F1F1F] hover:opacity-90 transition-all border border-white/20 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)',
              }}
            >
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">{user.name}</span>
            </Link>
            <Link
              to="/settings"
              className="p-2 rounded-full text-[#1F1F1F] hover:opacity-90 transition-all border border-white/20 shadow-lg"
              title="Settings"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)',
              }}
            >
              <Settings className="w-5 h-5" />
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-[#1F1F1F] px-4 py-2 rounded-full hover:opacity-90 transition-all font-medium border border-white/20 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)',
              }}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && user && (
          <div 
            className="md:hidden mt-4 rounded-2xl p-4 space-y-2 border border-white/20 shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)',
            }}
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-[#1F1F1F]/5 transition-colors text-[#1F1F1F] font-medium"
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <Link
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-[#1F1F1F]/5 transition-colors text-[#1F1F1F] font-medium"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>
            <Link
              to="/settings"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-[#1F1F1F]/5 transition-colors text-[#1F1F1F] font-medium"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
