const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a workout name'],
    trim: true,
  },
  type: {
    type: String,
    required: [true, 'Please provide a workout type'],
    enum: ['Cardio', 'Strength', 'Yoga', 'Swimming', 'Cycling', 'Running', 'Other'],
  },
  duration: {
    type: Number,
    required: [true, 'Please provide duration in minutes'],
    min: 1,
  },
  calories: {
    type: Number,
    required: [true, 'Please provide calories burned'],
    min: 0,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  notes: {
    type: String,
    trim: true,
    default: '',
  },
  exerciseDatabaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExerciseDatabase',
    default: null,
  },
  sets: [{
    reps: Number,
    weight: Number,
    rest: Number, // seconds
  }],
  distance: {
    type: Number,
    default: 0,
  },
  route: {
    name: String,
    location: String,
    elevation: Number,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  isSuggested: {
    type: Boolean,
    default: false,
  },
  suggestedWorkoutId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SuggestedWorkout',
    default: null,
  },
  exercises: [{
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExerciseDatabase',
    },
    sets: Number,
    reps: Number,
    weight: Number,
    rest: Number, // seconds
    completed: {
      type: Boolean,
      default: false,
    },
    notes: String,
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Workout', workoutSchema);

