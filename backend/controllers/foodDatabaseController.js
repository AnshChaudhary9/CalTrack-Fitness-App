const FoodDatabase = require('../models/FoodDatabase');

const searchFoods = async (req, res) => {
  try {
    const { search, category, limit } = req.query;
    let query = {};

    if (category) query.category = category;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ];
    }

    const foods = await FoodDatabase.find(query)
      .limit(parseInt(limit) || 50)
      .sort({ verified: -1, name: 1 });

    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFood = async (req, res) => {
  try {
    const food = await FoodDatabase.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    res.json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createFood = async (req, res) => {
  try {
    const food = await FoodDatabase.create({
      ...req.body,
      isCustom: true,
      createdBy: req.user._id,
    });

    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPopularFoods = async (req, res) => {
  try {
    const foods = await FoodDatabase.find({ verified: true })
      .limit(20)
      .sort({ name: 1 });

    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  searchFoods,
  getFood,
  createFood,
  getPopularFoods,
};

