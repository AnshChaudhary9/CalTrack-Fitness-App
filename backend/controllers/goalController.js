const Goal = require('../models/Goal');

const getGoals = async (req, res) => {
  try {
    const { status } = req.query;
    let query = { user: req.user._id };

    if (status) {
      query.status = status;
    }

    const goals = await Goal.find(query).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (goal) {
      res.json(goal);
    } else {
      res.status(404).json({ message: 'Goal not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createGoal = async (req, res) => {
  try {
    const { title, description, targetValue, currentValue, unit, targetDate } = req.body;

    const goal = await Goal.create({
      user: req.user._id,
      title,
      description,
      targetValue,
      currentValue: currentValue || 0,
      unit,
      targetDate,
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (goal) {
      goal.title = req.body.title || goal.title;
      goal.description = req.body.description !== undefined ? req.body.description : goal.description;
      goal.targetValue = req.body.targetValue !== undefined ? req.body.targetValue : goal.targetValue;
      goal.currentValue = req.body.currentValue !== undefined ? req.body.currentValue : goal.currentValue;
      goal.unit = req.body.unit || goal.unit;
      goal.targetDate = req.body.targetDate || goal.targetDate;
      goal.status = req.body.status || goal.status;

      if (goal.currentValue >= goal.targetValue && goal.status === 'active') {
        goal.status = 'completed';
      }

      const updatedGoal = await goal.save();
      res.json(updatedGoal);
    } else {
      res.status(404).json({ message: 'Goal not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (goal) {
      await goal.deleteOne();
      res.json({ message: 'Goal removed' });
    } else {
      res.status(404).json({ message: 'Goal not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGoals,
  getGoal,
  createGoal,
  updateGoal,
  deleteGoal,
};

