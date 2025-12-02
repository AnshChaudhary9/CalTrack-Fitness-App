const mongoose = require('mongoose');

const foodDatabaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide food name'],
    trim: true,
    index: true,
  },
  brand: {
    type: String,
    trim: true,
    default: '',
  },
  category: {
    type: String,
    required: true,
    enum: ['Fruits', 'Vegetables', 'Grains', 'Proteins', 'Dairy', 'Snacks', 'Beverages', 'Other'],
    default: 'Other',
  },
  servingSize: {
    amount: {
      type: Number,
      required: true,
      default: 100,
    },
    unit: {
      type: String,
      required: true,
      default: 'g',
      enum: ['g', 'ml', 'oz', 'cup', 'tbsp', 'tsp', 'piece', 'serving'],
    },
  },
  calories: {
    type: Number,
    required: [true, 'Please provide calories per serving'],
    min: 0,
  },
  protein: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  carbs: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  fats: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  fiber: {
    type: Number,
    default: 0,
    min: 0,
  },
  sugar: {
    type: Number,
    default: 0,
    min: 0,
  },
  sodium: {
    type: Number,
    default: 0,
    min: 0,
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
  image: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for search
foodDatabaseSchema.index({ name: 'text', brand: 'text' });

module.exports = mongoose.model('FoodDatabase', foodDatabaseSchema);

