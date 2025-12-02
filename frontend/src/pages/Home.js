import { Link, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  Target, 
  Activity, 
  TrendingUp, 
  Users, 
  Award,
  CheckCircle2,
  ArrowRight,
  Play,
  BarChart3,
  Zap
} from 'lucide-react';

const Home = () => {
  const { user, loading } = useContext(AuthContext);

  // Redirect logged-in users to dashboard
  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }
  const features = [
    {
      icon: Target,
      title: 'Set Goals',
      description: 'Define your fitness goals and track your progress with detailed analytics.',
    },
    {
      icon: Activity,
      title: 'Log Workouts',
      description: 'Easily track your gym workouts, set training plans, and discover new routines.',
    },
    {
      icon: TrendingUp,
      title: 'Stay on Track',
      description: 'Visualize your progress and reach your fitness goals with personalized insights.',
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'Smarter Training',
      description: 'Turn your phone into your personal fitness partner. Track workouts, visualize progress, and get personalized workout plans to help you achieve your goals.',
    },
    {
      icon: Activity,
      title: 'Custom Workouts',
      description: 'No matter what level you\'re at, CalTrack is there to help you achieve your goals of being happy and healthy.',
    },
    {
      icon: Users,
      title: 'Strong Community',
      description: 'Create custom challenges, push yourself and your friends. Get motivation and support from the entire CalTrack community.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Gym Image */}
      <section className="relative h-[600px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920')`,
            filter: 'blur(3px) brightness(0.4)',
            transform: 'scale(1.05)',
          }}
        ></div>
        <div className="relative z-10 flex items-center justify-end h-full">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl ml-auto text-right text-white">
              <h1 className="text-6xl md:text-8xl font-bold mb-6">
                REACH YOUR BEST
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
                The top-rated fitness app with thousands of users. CalTrack keeps you safe and motivated with live training, mobile coaching, custom workouts, and performance insights. Join challenges, climb leaderboards, and earn rewards that push your limits.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-end">
                <Link
                  to="/register"
                  className="bg-white text-[#1F1F1F] px-8 py-4 font-medium hover:bg-gray-100 transition-colors inline-block text-center"
                >
                  SIGN UP
                </Link>
              </div>
              <p className="text-gray-300 text-sm">
                Already a member?{' '}
                <Link to="/login" className="underline hover:text-white">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Set Goals. Log Workouts. Stay on Track Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1F1F1F] mb-6">
                SET GOALS. LOG WORKOUTS. STAY ON TRACK.
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Easily track your gym workouts, set training plans, explore our exercise video library, and discover new workout routines to exceed your fitness goals.
              </p>
              <Link
                to="/register"
                className="inline-block bg-[#1F1F1F] text-white px-8 py-4 font-medium hover:bg-gray-800 transition-colors"
              >
                GET STARTED
              </Link>
            </div>
            <div className="relative">
              <div 
                className="w-full h-[500px] rounded-lg bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800')`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenge Banner Section */}
      <section className="py-16 bg-[#1F1F1F] text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative">
              <div 
                className="w-full h-[300px] rounded-lg bg-cover bg-center border-4 border-red-600"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800')`,
                }}
              >
                <div className="absolute inset-0 bg-[#1F1F1F]/40 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-bold mb-2">12</div>
                    <div className="text-2xl font-bold">DAYS OF FITMAS</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                12 DAYS OF FITMAS CHALLENGE
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Log 12 activities on CalTrack between November 25 and December 26. Push your limits and earn exclusive rewards!
              </p>
              <Link
                to="/challenges"
                className="inline-block bg-white text-[#1F1F1F] px-8 py-4 font-medium hover:bg-gray-100 transition-colors"
              >
                JOIN CHALLENGE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Push Your Limits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1F1F1F] mb-6">
            PUSH YOUR LIMITS
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Hit Milestones and PR's by taking on a new challenge every month.
          </p>
          <Link
            to="/challenges"
            className="inline-block bg-[#1F1F1F] text-white px-8 py-4 font-medium hover:bg-gray-800 transition-colors"
          >
            JOIN A CHALLENGE
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 border-2 border-gray-200 hover:border-[#1F1F1F] transition-colors text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[#1F1F1F] flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1F1F1F] mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Built to Make You Better Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1F1F1F] mb-12">
                BUILT TO MAKE YOU BETTER
              </h2>
              <div className="space-y-8">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index}>
                      <div className="flex items-start gap-4 mb-3">
                        <div className="w-12 h-12 rounded-lg bg-[#1F1F1F] flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-[#1F1F1F]">{benefit.title}</h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed ml-16">
                        {benefit.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-white border-2 border-gray-200 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#1F1F1F]">Performance Insights</h3>
                <BarChart3 className="w-6 h-6 text-[#1F1F1F]" />
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Workouts This Week</span>
                    <span className="text-sm font-bold text-[#1F1F1F]">5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#1F1F1F] h-2 rounded-full" style={{ width: '71%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Calories Burned</span>
                    <span className="text-sm font-bold text-[#1F1F1F]">2,450</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#1F1F1F] h-2 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Active Streak</span>
                    <span className="text-sm font-bold text-[#1F1F1F]">7 days</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#1F1F1F] h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <Link
                    to="/progress"
                    className="flex items-center gap-2 text-[#1F1F1F] hover:text-gray-600 font-medium transition-colors"
                  >
                    View All Data
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#1F1F1F] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Fitness Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already achieving their fitness goals with CalTrack.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-[#1F1F1F] px-8 py-4 font-medium hover:bg-gray-100 transition-colors inline-block"
            >
              SIGN UP NOW
            </Link>
            <Link
              to="/login"
              className="bg-transparent border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-[#1F1F1F] transition-colors inline-block"
            >
              LOG IN
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
