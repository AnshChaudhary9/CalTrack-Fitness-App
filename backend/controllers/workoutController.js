const Workout = require('../models/Workout');

const getWorkouts = async (req, res) => {
  try {
    const { type, sort, startDate, endDate } = req.query;
    let query = { user: req.user._id };

    if (type) {
      query.type = type;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    let sortOption = { date: -1 };
    if (sort === 'date-asc') sortOption = { date: 1 };
    if (sort === 'type') sortOption = { type: 1 };

    const workouts = await Workout.find(query).sort(sortOption);
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (workout) {
      res.json(workout);
    } else {
      res.status(404).json({ message: 'Workout not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createWorkout = async (req, res) => {
  try {
    const { name, type, duration, calories, date, notes, sets, reps } = req.body;
    const { calculateCalories } = require('../utils/calculateCalories');
    const User = require('../models/User');

    const user = await User.findById(req.user._id);
    const userWeight = user?.weight || 70;

    let calculatedCalories = 0;
    if (duration && type) {
      calculatedCalories = calculateCalories(type, name, parseInt(duration), userWeight);
      console.log('Calculated calories:', {
        type,
        name,
        duration: parseInt(duration),
        userWeight,
        calculatedCalories
      });
    }
    
    const providedCalories = calories ? parseInt(calories) : null;
    
    const finalCalories = (providedCalories && providedCalories > 0) ? providedCalories : calculatedCalories;

    console.log('Final calories for workout:', {
      providedCalories,
      calculatedCalories,
      finalCalories
    });

    const workoutData = {
      user: req.user._id,
      name,
      type,
      duration: parseInt(duration),
      calories: finalCalories || 0,
      date: date || new Date(),
      notes,
    };

    if (sets && reps) {
      const numSets = parseInt(sets);
      const numReps = parseInt(reps);
      workoutData.sets = Array.from({ length: numSets }, () => ({
        reps: numReps,
        weight: 0,
        rest: 60,
      }));
    }

    const workout = await Workout.create(workoutData);

    try {
      await updateChallengeProgress(req.user._id, {
        type,
        calories: finalCalories || 0,
        duration: parseInt(duration),
        distance: req.body.distance || 0,
        date: date || new Date(),
      });
    } catch (challengeError) {
      console.error('Error updating challenge progress:', challengeError);
    }

    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (workout) {
      const { calculateCalories } = require('../utils/calculateCalories');
      const User = require('../models/User');

      const user = await User.findById(req.user._id);
      const userWeight = user?.weight || 70;

      workout.name = req.body.name !== undefined ? req.body.name : workout.name;
      workout.type = req.body.type !== undefined ? req.body.type : workout.type;
      workout.duration = req.body.duration !== undefined ? req.body.duration : workout.duration;
      workout.date = req.body.date !== undefined ? req.body.date : workout.date;
      workout.notes = req.body.notes !== undefined ? req.body.notes : workout.notes;

      if (req.body.sets !== undefined && req.body.reps !== undefined) {
        const numSets = parseInt(req.body.sets);
        const numReps = parseInt(req.body.reps);
        if (numSets > 0 && numReps > 0) {
          workout.sets = Array.from({ length: numSets }, () => ({
            reps: numReps,
            weight: 0,
            rest: 60,
          }));
        } else {
          workout.sets = [];
        }
      }
      
      const durationChanged = req.body.duration !== undefined && req.body.duration !== workout.duration;
      const typeChanged = req.body.type !== undefined && req.body.type !== workout.type;
      const nameChanged = req.body.name !== undefined && req.body.name !== workout.name;
      
      if (durationChanged || typeChanged || nameChanged) {
        const newDuration = workout.duration;
        const newType = workout.type;
        const newName = workout.name;
        
        if (newDuration && newType) {
          workout.calories = calculateCalories(newType, newName, newDuration, userWeight);
        }
      } else if (req.body.calories !== undefined) {
        workout.calories = req.body.calories;
      }

      const wasCompleted = workout.completed;
      if (req.body.completed !== undefined) {
        workout.completed = req.body.completed;
        workout.completedAt = req.body.completed ? new Date() : null;
      }

      const updatedWorkout = await workout.save();
      
      try {
        await recalculateChallengeProgress(req.user._id);
      } catch (challengeError) {
        console.error('Error recalculating challenge progress:', challengeError);
      }
      
      res.json(updatedWorkout);
    } else {
      res.status(404).json({ message: 'Workout not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const toggleWorkoutCompletion = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    workout.completed = !workout.completed;
    workout.completedAt = workout.completed ? new Date() : null;

    const updatedWorkout = await workout.save();
    
    try {
      await recalculateChallengeProgress(req.user._id);
    } catch (challengeError) {
      console.error('Error recalculating challenge progress:', challengeError);
    }
    
    res.json(updatedWorkout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (workout) {
      await workout.deleteOne();
      
      try {
        await recalculateChallengeProgress(req.user._id);
      } catch (challengeError) {
        console.error('Error recalculating challenge progress:', challengeError);
      }
      
      res.json({ message: 'Workout removed' });
    } else {
      res.status(404).json({ message: 'Workout not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getWorkoutStats = async (req, res) => {
  try {
    const totalWorkouts = await Workout.countDocuments({ user: req.user._id, completed: true });
    const totalCalories = await Workout.aggregate([
      { $match: { user: req.user._id, completed: true } },
      { $group: { _id: null, total: { $sum: '$calories' } } },
    ]);

    const workoutsByType = await Workout.aggregate([
      { $match: { user: req.user._id, completed: true } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    res.json({
      totalWorkouts,
      totalCalories: totalCalories[0]?.total || 0,
      workoutsByType,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getMyWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ 
      user: req.user._id,

    })
      .populate('exercises.exercise')
      .sort({ createdAt: -1 });

    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addSuggestedToMyWorkouts = async (req, res) => {
  try {
    const { suggestedWorkoutId, name, date, workoutData } = req.body;
    const SuggestedWorkout = require('../models/SuggestedWorkout');

    let suggestedWorkout;
    let totalCalories = 0;
    let duration = 30;
    let exercises = [];

    const isValidObjectId = suggestedWorkoutId && /^[0-9a-fA-F]{24}$/.test(suggestedWorkoutId);
    
    if (isValidObjectId) {
      try {
        suggestedWorkout = await SuggestedWorkout.findById(suggestedWorkoutId)
          .populate('exercises.exercise');

        if (suggestedWorkout) {
          totalCalories = suggestedWorkout.estimatedCaloriesBurned || 0;
          duration = suggestedWorkout.duration || 30;
          exercises = suggestedWorkout.exercises.map(ex => ({
            exercise: ex.exercise?._id || ex.exercise,
            sets: ex.sets,
            reps: ex.reps,
            rest: ex.rest,
            notes: ex.notes || '',
          }));
        }
      } catch (error) {
        console.error('Error finding suggested workout:', error);
      }
    }


    if (!suggestedWorkout && workoutData) {
      totalCalories = workoutData.estimatedCaloriesBurned || 0;
      duration = workoutData.duration || 30;
      exercises = (workoutData.exercises || []).map(ex => ({
        exercise: ex.exercise?._id || ex.exercise,
        sets: ex.sets || 3,
        reps: ex.reps || 10,
        rest: ex.rest || 60,
        notes: ex.notes || '',
      }));
    }

    if (!suggestedWorkout && !workoutData) {
      return res.status(404).json({ message: 'Suggested workout not found' });
    }

    let workoutType = 'Strength';
    if (workoutData?.goalCriteria && workoutData.goalCriteria.length > 0) {
      const goal = workoutData.goalCriteria[0];
      if (goal === 'Lose Weight' || goal === 'Improve Endurance') {
        workoutType = 'Cardio';
      } else if (goal === 'Gain Muscle Mass' || goal === 'Build Strength') {
        workoutType = 'Strength';
      } else if (workoutData.trainingStyleCriteria && workoutData.trainingStyleCriteria.includes('Yoga')) {
        workoutType = 'Yoga';
      }
    }

    const workoutName = name || suggestedWorkout?.title || workoutData?.title || 'Workout';
    const User = require('../models/User');
    const { calculateCalories } = require('../utils/calculateCalories');
    const user = await User.findById(req.user._id);
    const userWeight = user?.weight || 70;
    let finalCalories = totalCalories;
    if (duration && workoutType) {
      const calculatedCal = calculateCalories(workoutType, workoutName, duration, userWeight);
      if (calculatedCal > 0) {
        finalCalories = calculatedCal;
      }
    }
    const workout = await Workout.create({
      user: req.user._id,
      name: workoutName,
      type: workoutType,
      duration,
      calories: finalCalories || 0,
      date: date || new Date(),
      isSuggested: true, 
      suggestedWorkoutId: suggestedWorkout?._id || null,
      exercises,
    });

    const populatedWorkout = await Workout.findById(workout._id)
      .populate('exercises.exercise');

    console.log('Created workout:', {
      _id: populatedWorkout._id,
      name: populatedWorkout.name,
      type: populatedWorkout.type,
      date: populatedWorkout.date,
      calories: populatedWorkout.calories,
    });

    res.status(201).json(populatedWorkout);
  } catch (error) {
    console.error('Error adding suggested workout:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getWorkoutStats,
  toggleWorkoutCompletion,
  getMyWorkouts,
  addSuggestedToMyWorkouts,
};

