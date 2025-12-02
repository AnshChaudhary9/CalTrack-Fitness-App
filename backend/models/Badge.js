const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a badge name'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a badge description'],
    trim: true,
  },
  icon: {
    type: String,
    default: '🏆',
  },
  category: {
    type: String,
    required: true,
    enum: ['Workout', 'Challenge', 'Streak', 'Achievement', 'Community', 'Special'],
    default: 'Achievement',
  },
  rarity: {
    type: String,
    enum: ['Common', 'Rare', 'Epic', 'Legendary'],
    default: 'Common',
  },
  points: {
    type: Number,
    default: 10,
    min: 0,
  },
  image: {
    type: String,
    default: null,
  },
  requirements: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Badge', badgeSchema);

