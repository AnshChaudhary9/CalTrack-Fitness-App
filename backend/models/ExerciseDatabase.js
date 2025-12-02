const mongoose = require('mongoose');

const exerciseDatabaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide exercise name'],
    trim: true,
    index: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  category: {
    type: String,
    required: true,
    enum: ['Cardio', 'Strength', 'Flexibility', 'Balance', 'Sports', 'Yoga', 'Pilates', 'Bodyweight', 'Other'],
    default: 'Other',
  },
  targetMuscles: [{
    type: String,
    enum: ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Arms', 'Legs', 'Quadriceps', 'Hamstrings', 'Glutes', 'Calves', 'Core', 'Abs', 'Full Body', 'Cardio'],
  }],
  secondaryMuscles: [{
    type: String,
    enum: ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Arms', 'Legs', 'Quadriceps', 'Hamstrings', 'Glutes', 'Calves', 'Core', 'Abs', 'Full Body', 'Cardio'],
  }],
  muscleGroups: [{ // Keep for backward compatibility
    type: String,
    enum: ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Full Body', 'Cardio'],
  }],
  equipment: [{
    type: String,
    enum: ['None', 'Dumbbells', 'Barbell', 'Resistance Bands', 'Machine', 'Cable', 'Body Weight', 'Kettlebell', 'Pull-up Bar', 'Bench', 'Other'],
  }],
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate',
  },
  instructions: {
    type: String,
    trim: true,
    default: '',
  },
  instructionsArray: [{ // Keep array format for backward compatibility
    type: String,
    trim: true,
  }],
  // Sets and reps based on goals
  repsForGoals: {
    'Lose Weight': { min: Number, max: Number },
    'Gain Weight': { min: Number, max: Number },
    'Gain Muscle Mass': { min: Number, max: Number },
    'Build Strength': { min: Number, max: Number },
    'Improve Endurance': { min: Number, max: Number },
    'Maintain Fitness': { min: Number, max: Number },
  },
  setsForGoals: {
    'Lose Weight': { min: Number, max: Number },
    'Gain Weight': { min: Number, max: Number },
    'Gain Muscle Mass': { min: Number, max: Number },
    'Build Strength': { min: Number, max: Number },
    'Improve Endurance': { min: Number, max: Number },
    'Maintain Fitness': { min: Number, max: Number },
  },
  caloriesBurnedEstimate: {
    type: Number,
    default: 0,
    min: 0,
  },
  caloriesPerMinute: { // Keep for backward compatibility
    type: Number,
    default: 0,
    min: 0,
  },
  image: {
    type: String,
    default: null,
  },
  videoUrl: {
    type: String,
    default: null,
  },
  isCustom: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for search
exerciseDatabaseSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('ExerciseDatabase', exerciseDatabaseSchema);

