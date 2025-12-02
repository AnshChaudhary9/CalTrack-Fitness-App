const UserGoals = require('../models/UserGoals');

const getUserGoals = async (req, res) => {
  try {
    let userGoals = await UserGoals.findOne({ user: req.user._id });

    if (!userGoals) {
      return res.json(null);
    }

    res.json(userGoals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createOrUpdateUserGoals = async (req, res) => {
  try {
    const { primaryGoal, focusArea, trainingLevel, workoutType } = req.body;

    if (!primaryGoal) {
      return res.status(400).json({ message: 'Primary goal is required' });
    }
    if (!trainingLevel) {
      return res.status(400).json({ message: 'Training level is required' });
    }
    if (!focusArea || !Array.isArray(focusArea) || focusArea.length === 0) {
      return res.status(400).json({ message: 'At least one focus area is required' });
    }
    if (!workoutType || !Array.isArray(workoutType) || workoutType.length === 0) {
      return res.status(400).json({ message: 'At least one workout type is required' });
    }

    let userGoals = await UserGoals.findOne({ user: req.user._id });

    if (userGoals) {
      userGoals.primaryGoal = primaryGoal;
      userGoals.focusArea = focusArea;
      userGoals.trainingLevel = trainingLevel;
      userGoals.workoutType = workoutType;
      userGoals.updatedAt = new Date();
      await userGoals.save();
    } else {
      userGoals = await UserGoals.create({
        user: req.user._id,
        primaryGoal,
        focusArea,
        trainingLevel,
        workoutType,
      });
    }

    res.json(userGoals);
  } catch (error) {
    console.error('Error saving user goals:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message).join(', ');
      return res.status(400).json({ message: messages });
    }
    res.status(500).json({ message: error.message || 'Error saving goals' });
  }
};

module.exports = {
  getUserGoals,
  createOrUpdateUserGoals,
};

