const mongoose = require('mongoose');

const userGoalsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  primaryGoal: {
    type: String,
    required: true,
    enum: ['Lose Weight', 'Gain Weight', 'Gain Muscle Mass', 'Build Strength', 'Improve Endurance', 'Maintain Fitness'],
  },
  focusArea: [{
    type: String,
    enum: ['Full Body', 'Upper Body', 'Lower Body', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Abs/Core'],
  }],
  trainingLevel: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
  },
  workoutType: [{
    type: String,
    enum: ['Gym Workouts', 'Home Workouts', 'Cardio', 'Yoga', 'Bodyweight'],
  }],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('UserGoals', userGoalsSchema);

