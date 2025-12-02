const ExerciseDatabase = require('../models/ExerciseDatabase');

const searchExercises = async (req, res) => {
  try {
    const { category, difficulty, equipment, targetMuscle, search, muscleGroup } = req.query;
    let query = {};

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (equipment) query.equipment = { $in: [equipment] };
    if (targetMuscle) {
      query.$or = [
        { targetMuscles: { $in: [targetMuscle] } },
        { muscleGroups: { $in: [targetMuscle] } },
      ];
    }
    if (muscleGroup) {
      query.$or = [
        { targetMuscles: { $in: [muscleGroup] } },
        { muscleGroups: { $in: [muscleGroup] } },
      ];
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const exercises = await ExerciseDatabase.find(query)
      .sort({ name: 1 })
      .limit(100);

    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getExercise = async (req, res) => {
  try {
    const exercise = await ExerciseDatabase.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    res.json(exercise);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createExercise = async (req, res) => {
  try {
    const exercise = await ExerciseDatabase.create({
      ...req.body,
      isCustom: true,
      createdBy: req.user._id,
    });

    res.status(201).json(exercise);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPopularExercises = async (req, res) => {
  try {
    const exercises = await ExerciseDatabase.find({ verified: true })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const seedExerciseDatabase = async (req, res) => {
  try {
    const exerciseSeedData = require('../data/exerciseSeedData');
    
    const existingNames = await ExerciseDatabase.find({ isCustom: false }).select('name');
    const existingNameSet = new Set(existingNames.map(e => e.name.toLowerCase()));
    
    const newExercises = exerciseSeedData.filter(ex => 
      !existingNameSet.has(ex.name.toLowerCase())
    );

    if (newExercises.length === 0) {
      return res.json({ 
        message: 'All exercises already exist in database',
        count: 0,
        skipped: exerciseSeedData.length
      });
    }

    const exercises = await ExerciseDatabase.insertMany(newExercises);

    res.json({ 
      message: `Successfully seeded ${exercises.length} new exercises`,
      count: exercises.length,
      skipped: exerciseSeedData.length - exercises.length
    });
  } catch (error) {
    console.error('Error seeding exercise database:', error);
    if (error.code === 11000 || error.message.includes('duplicate')) {
      try {
        let inserted = 0;
        let skipped = 0;
        for (const exercise of exerciseSeedData) {
          try {
            await ExerciseDatabase.create(exercise);
            inserted++;
          } catch (err) {
            if (err.code === 11000) {
              skipped++;
            } else {
              throw err;
            }
          }
        }
        return res.json({
          message: `Seeded ${inserted} exercises, skipped ${skipped} duplicates`,
          count: inserted,
          skipped
        });
      } catch (innerError) {
        return res.status(500).json({ message: innerError.message });
      }
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  searchExercises,
  getExercise,
  createExercise,
  getPopularExercises,
  seedExerciseDatabase,
};
