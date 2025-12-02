const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const autoSeedExercises = require('./utils/seedExercises');

dotenv.config();

connectDB().then(async () => {
  await autoSeedExercises();
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userGoalsRoutes'));
app.use('/api/workouts', require('./routes/workoutRoutes'));
app.use('/api/diet', require('./routes/dietRoutes'));
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));
app.use('/api/challenges', require('./routes/challengeRoutes'));
app.use('/api/badges', require('./routes/badgeRoutes'));
app.use('/api/community', require('./routes/communityRoutes'));
app.use('/api/food-database', require('./routes/foodDatabaseRoutes'));
app.use('/api/exercise-database', require('./routes/exerciseDatabaseRoutes'));

app.get('/api/health', (req, res) => {
  res.json({ message: 'Fitness Tracker API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

