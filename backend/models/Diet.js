const mongoose = require('mongoose');

const dietSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mealType: {
    type: String,
    required: [true, 'Please provide meal type'],
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
  },
  foodName: {
    type: String,
    required: [true, 'Please provide food name'],
    trim: true,
  },
  foodDatabaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodDatabase',
    default: null,
  },
  servingSize: {
    amount: {
      type: Number,
      default: 1,
    },
    unit: {
      type: String,
      default: 'serving',
    },
  },
  calories: {
    type: Number,
    required: [true, 'Please provide calories'],
    min: 0,
  },
  protein: {
    type: Number,
    required: [true, 'Please provide protein in grams'],
    min: 0,
    default: 0,
  },
  carbs: {
    type: Number,
    required: [true, 'Please provide carbs in grams'],
    min: 0,
    default: 0,
  },
  fats: {
    type: Number,
    required: [true, 'Please provide fats in grams'],
    min: 0,
    default: 0,
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
}, {
  timestamps: true,
});

module.exports = mongoose.model('Diet', dietSchema);

