const Workout = require('../models/Workout');
const User = require('../models/User');

const getWorkoutLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Workout.aggregate([
      {
        $group: {
          _id: '$user',
          totalWorkouts: { $sum: 1 },
          totalCalories: { $sum: '$calories' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      {
        $unwind: '$userInfo',
      },
      {
        $project: {
          _id: 1,
          name: '$userInfo.name',
          email: '$userInfo.email',
          totalWorkouts: 1,
          totalCalories: 1,
        },
      },
      {
        $sort: { totalWorkouts: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    const rankedLeaderboard = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    res.json(rankedLeaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCalorieLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Workout.aggregate([
      {
        $group: {
          _id: '$user',
          totalCalories: { $sum: '$calories' },
          totalWorkouts: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      {
        $unwind: '$userInfo',
      },
      {
        $project: {
          _id: 1,
          name: '$userInfo.name',
          email: '$userInfo.email',
          totalCalories: 1,
          totalWorkouts: 1,
        },
      },
      {
        $sort: { totalCalories: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    const rankedLeaderboard = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    res.json(rankedLeaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWorkoutLeaderboard,
  getCalorieLeaderboard,
};

