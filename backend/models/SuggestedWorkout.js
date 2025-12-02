const mongoose = require('mongoose');

const suggestedWorkoutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  targetMuscleGroup: [{
    type: String,
    enum: ['Full Body', 'Upper Body', 'Lower Body', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Abs/Core'],
  }],
  estimatedCaloriesBurned: {
    type: Number,
    default: 0,
    min: 0,
  },
  numberOfExercises: {
    type: Number,
    default: 0,
    min: 0,
  },
  duration: {
    type: Number, // in minutes
    required: true,
    min: 1,
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true,
  },
  equipment: [{
    type: String,
    enum: ['None', 'Dumbbells', 'Barbell', 'Resistance Bands', 'Machine', 'Cable', 'Body Weight', 'Kettlebell', 'Pull-up Bar', 'Bench', 'Other'],
  }],
  exercises: [{
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExerciseDatabase',
      required: true,
    },
    sets: {
      type: Number,
      default: 3,
    },
    reps: {
      type: Number,
      default: 10,
    },
    rest: {
      type: Number, // seconds
      default: 60,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  }],
  // Criteria for when this workout should be suggested
  goalCriteria: [{
    type: String,
    enum: ['Lose Weight', 'Gain Weight', 'Gain Muscle Mass', 'Build Strength', 'Improve Endurance', 'Maintain Fitness'],
  }],
  focusAreaCriteria: [{
    type: String,
    enum: ['Full Body', 'Upper Body', 'Lower Body', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Abs/Core'],
  }],
  trainingLevelCriteria: [{
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
  }],
  workoutTypeCriteria: [{
    type: String,
    enum: ['Gym Workouts', 'Home Workouts', 'Cardio', 'Yoga', 'Bodyweight'],
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SuggestedWorkout', suggestedWorkoutSchema);

