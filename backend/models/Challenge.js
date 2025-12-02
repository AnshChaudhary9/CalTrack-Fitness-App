const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a challenge title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a challenge description'],
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Workout', 'Calorie', 'Distance', 'Duration', 'Custom'],
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Intermediate',
  },
  duration: {
    type: Number,
    required: [true, 'Please provide challenge duration in days'],
    min: 1,
  },
  targetValue: {
    type: Number,
    required: [true, 'Please provide target value'],
    min: 0,
  },
  unit: {
    type: String,
    required: true,
    enum: ['workouts', 'calories', 'km', 'miles', 'minutes', 'hours', 'other'],
  },
  badgeReward: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge',
  },
  requirements: [{
    type: String,
    trim: true,
  }],
  image: {
    type: String,
    default: null,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    progress: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Challenge', challengeSchema);

