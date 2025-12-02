const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a goal title'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  targetValue: {
    type: Number,
    required: [true, 'Please provide a target value'],
    min: 0,
  },
  currentValue: {
    type: Number,
    default: 0,
    min: 0,
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'lbs', 'workouts', 'calories', 'days', 'other'],
  },
  targetDate: {
    type: Date,
    required: [true, 'Please provide a target date'],
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Calculate progress percentage
goalSchema.virtual('progress').get(function () {
  if (this.targetValue === 0) return 0;
  const progress = (this.currentValue / this.targetValue) * 100;
  return Math.min(progress, 100);
});

module.exports = mongoose.model('Goal', goalSchema);

