import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import SuggestedWorkouts from './pages/SuggestedWorkouts';
import MyWorkouts from './pages/MyWorkouts';
import Diet from './pages/Diet';
import Goals from './pages/Goals';
import Progress from './pages/Progress';
import BMI from './pages/BMI';
import Calendar from './pages/Calendar';
import Leaderboard from './pages/Leaderboard';
import Community from './pages/Community';
import Challenges from './pages/Challenges';
import ChallengeDetail from './pages/ChallengeDetail';
import FoodDatabase from './pages/FoodDatabase';
import ExerciseDatabase from './pages/ExerciseDatabase';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col relative">
          <Navbar />
          <div className="flex-1 relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workouts"
              element={
                <ProtectedRoute>
                  <Navigate to="/workouts/suggested" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workouts/suggested"
              element={
                <ProtectedRoute>
                  <SuggestedWorkouts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workouts/my"
              element={
                <ProtectedRoute>
                  <MyWorkouts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/diet"
              element={
                <ProtectedRoute>
                  <Diet />
                </ProtectedRoute>
              }
            />
            <Route
              path="/goals"
              element={
                <ProtectedRoute>
                  <Goals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <Progress />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bmi"
              element={
                <ProtectedRoute>
                  <BMI />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/community"
              element={
                <ProtectedRoute>
                  <Community />
                </ProtectedRoute>
              }
            />
            <Route
              path="/challenges"
              element={
                <ProtectedRoute>
                  <Challenges />
                </ProtectedRoute>
              }
            />
            <Route
              path="/challenges/:id"
              element={
                <ProtectedRoute>
                  <ChallengeDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/food-database"
              element={
                <ProtectedRoute>
                  <FoodDatabase />
                </ProtectedRoute>
              }
            />
            <Route
              path="/exercise-database"
              element={
                <ProtectedRoute>
                  <ExerciseDatabase />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route path="/home" element={<Navigate to="/" />} />
          </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

