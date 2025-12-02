const Diet = require('../models/Diet');

const getDietEntries = async (req, res) => {
  try {
    const { mealType, startDate, endDate } = req.query;
    let query = { user: req.user._id };

    if (mealType) {
      query.mealType = mealType;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const dietEntries = await Diet.find(query).sort({ date: -1 });
    res.json(dietEntries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDietEntry = async (req, res) => {
  try {
    const dietEntry = await Diet.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (dietEntry) {
      res.json(dietEntry);
    } else {
      res.status(404).json({ message: 'Diet entry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDietEntry = async (req, res) => {
  try {
    const { mealType, foodName, calories, protein, carbs, fats, date, notes } = req.body;

    const dietEntry = await Diet.create({
      user: req.user._id,
      mealType,
      foodName,
      calories,
      protein,
      carbs,
      fats,
      date: date || new Date(),
      notes,
    });

    res.status(201).json(dietEntry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDietEntry = async (req, res) => {
  try {
    const dietEntry = await Diet.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (dietEntry) {
      dietEntry.mealType = req.body.mealType || dietEntry.mealType;
      dietEntry.foodName = req.body.foodName || dietEntry.foodName;
      dietEntry.calories = req.body.calories !== undefined ? req.body.calories : dietEntry.calories;
      dietEntry.protein = req.body.protein !== undefined ? req.body.protein : dietEntry.protein;
      dietEntry.carbs = req.body.carbs !== undefined ? req.body.carbs : dietEntry.carbs;
      dietEntry.fats = req.body.fats !== undefined ? req.body.fats : dietEntry.fats;
      dietEntry.date = req.body.date || dietEntry.date;
      dietEntry.notes = req.body.notes !== undefined ? req.body.notes : dietEntry.notes;

      const updatedDietEntry = await dietEntry.save();
      res.json(updatedDietEntry);
    } else {
      res.status(404).json({ message: 'Diet entry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDietEntry = async (req, res) => {
  try {
    const dietEntry = await Diet.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (dietEntry) {
      await dietEntry.deleteOne();
      res.json({ message: 'Diet entry removed' });
    } else {
      res.status(404).json({ message: 'Diet entry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDailySummary = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const summary = await Diet.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: '$mealType',
          totalCalories: { $sum: '$calories' },
          totalProtein: { $sum: '$protein' },
          totalCarbs: { $sum: '$carbs' },
          totalFats: { $sum: '$fats' },
        },
      },
    ]);

    const total = summary.reduce(
      (acc, item) => ({
        calories: acc.calories + item.totalCalories,
        protein: acc.protein + item.totalProtein,
        carbs: acc.carbs + item.totalCarbs,
        fats: acc.fats + item.totalFats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    res.json({ summary, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDietEntries,
  getDietEntry,
  createDietEntry,
  updateDietEntry,
  deleteDietEntry,
  getDailySummary,
};

