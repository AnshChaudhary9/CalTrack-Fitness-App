const SuggestedWorkout = require('../models/SuggestedWorkout');
const UserGoals = require('../models/UserGoals');
const ExerciseDatabase = require('../models/ExerciseDatabase');

const getSuggestedWorkouts = async (req, res) => {
  try {
    const userGoals = await UserGoals.findOne({ user: req.user._id });

    if (!userGoals) {
      return res.json([]);
    }

    let exerciseCount = await ExerciseDatabase.countDocuments();
    
    if (exerciseCount === 0) {
      console.log('Exercise database is empty. Auto-seeding...');
      try {
        const autoSeedExercises = require('../utils/seedExercises');
        await autoSeedExercises();
        exerciseCount = await ExerciseDatabase.countDocuments();
        console.log(`Auto-seeded ${exerciseCount} exercises`);
      } catch (error) {
        console.error('Error auto-seeding exercises:', error);
        return res.json([]);
      }
    }

    const query = {
      isActive: true,
    };

    let suggestedWorkouts = [];
    
    try {
      suggestedWorkouts = await SuggestedWorkout.find(query)
        .populate('exercises.exercise')
        .sort({ createdAt: -1 })
        .limit(20);
    } catch (error) {
      console.error('Error fetching pre-made workouts:', error);
    }

    if (suggestedWorkouts.length === 0) {
      try {
        const dynamicWorkouts = await generateDynamicWorkouts(userGoals);
        suggestedWorkouts = dynamicWorkouts.map((w, idx) => ({
          ...w,
          _id: `dynamic-${Date.now()}-${idx}`,
        }));
      } catch (error) {
        console.error('Error generating dynamic workouts:', error);
        suggestedWorkouts = [];
      }
    }

    res.json(suggestedWorkouts);
  } catch (error) {
    console.error('Error getting suggested workouts:', error);
    res.status(500).json({ message: error.message });
  }
};

const generateDynamicWorkouts = async (userGoals) => {
  const workouts = [];
  const ExerciseDatabase = require('../models/ExerciseDatabase');

  let exerciseQuery = {};

  if (userGoals.focusArea && userGoals.focusArea.length > 0) {
    const muscleMapping = {
      'Full Body': ['Full Body'],
      'Upper Body': ['Chest', 'Back', 'Shoulders', 'Arms'],
      'Lower Body': ['Legs', 'Quadriceps', 'Hamstrings', 'Glutes', 'Calves'],
      'Chest': ['Chest'],
      'Back': ['Back'],
      'Shoulders': ['Shoulders'],
      'Arms': ['Biceps', 'Triceps', 'Arms'],
      'Legs': ['Legs', 'Quadriceps', 'Hamstrings', 'Glutes', 'Calves'],
      'Abs/Core': ['Core', 'Abs'],
    };

    const targetMuscles = [];
    userGoals.focusArea.forEach(area => {
      if (muscleMapping[area]) {
        targetMuscles.push(...muscleMapping[area]);
      }
    });

    if (targetMuscles.length > 0) {
      exerciseQuery.targetMuscles = { $in: targetMuscles };
    }
  }

  exerciseQuery.difficulty = userGoals.trainingLevel;

  if (userGoals.workoutType && userGoals.workoutType.length > 0) {
    const equipmentMapping = {
      'Gym Workouts': ['Dumbbells', 'Barbell', 'Machine', 'Cable'],
      'Home Workouts': ['Dumbbells', 'Resistance Bands', 'Body Weight', 'Kettlebell'],
      'Bodyweight': ['Body Weight', 'None'],
      'Cardio': ['None', 'Machine'],
      'Yoga': ['None'],
    };

    const equipment = [];
    userGoals.workoutType.forEach(type => {
      if (equipmentMapping[type]) {
        equipment.push(...equipmentMapping[type]);
      }
    });

    if (equipment.length > 0) {
      exerciseQuery.equipment = { $in: equipment };
    }
  }

  let exercises = await ExerciseDatabase.find(exerciseQuery).limit(50);

  if (exercises.length === 0) {
    delete exerciseQuery.difficulty;
    exercises = await ExerciseDatabase.find(exerciseQuery).limit(50);
  }

  if (exercises.length === 0) {
    exercises = await ExerciseDatabase.find({}).limit(50);
  }

  if (exercises.length === 0) {
    console.warn('No exercises found in database. Please seed the exercise database.');
    return [];
  }

  const workoutPlans = getWorkoutPlansForGoal(userGoals.primaryGoal, exercises, userGoals);

  return workoutPlans;
};

const getWorkoutPlansForGoal = (goal, exercises, userGoals) => {
  const plans = [];

  switch (goal) {
    case 'Lose Weight':
      plans.push(...generateWeightLossWorkouts(exercises, userGoals));
      break;
    case 'Gain Weight':
      plans.push(...generateWeightGainWorkouts(exercises, userGoals));
      break;
    case 'Gain Muscle Mass':
      plans.push(...generateMuscleGainWorkouts(exercises, userGoals));
      break;
    case 'Build Strength':
      plans.push(...generateStrengthWorkouts(exercises, userGoals));
      break;
    case 'Improve Endurance':
      plans.push(...generateEnduranceWorkouts(exercises, userGoals));
      break;
    case 'Maintain Fitness':
      plans.push(...generateMaintenanceWorkouts(exercises, userGoals));
      break;
    default:
      plans.push(...generateGeneralWorkouts(exercises, userGoals));
  }

  return plans;
};

const generateWeightLossWorkouts = (exercises, userGoals) => {
  const workouts = [];
  const cardioExercises = exercises.filter(e => e.category === 'Cardio' || (e.targetMuscles && e.targetMuscles.includes('Cardio')));
  const pilatesExercises = exercises.filter(e => e.category === 'Pilates');
  const yogaExercises = exercises.filter(e => e.category === 'Yoga');
  const bodyweightExercises = exercises.filter(e => e.category === 'Bodyweight' || (e.equipment && (e.equipment.includes('Body Weight') || e.equipment.includes('None'))));
  const fullBodyExercises = exercises.filter(e => 
    (e.targetMuscles && (e.targetMuscles.includes('Full Body') || e.targetMuscles.includes('Core') || e.targetMuscles.includes('Abs'))) || 
    (e.muscleGroups && e.muscleGroups.includes('Full Body'))
  );
  
  const focusAreaExercises = userGoals.focusArea && userGoals.focusArea.length > 0
    ? filterExercisesByArea(exercises, userGoals.focusArea[0])
    : exercises;

  const pilatesCoreExercises = pilatesExercises.filter(e => 
    (e.targetMuscles && (e.targetMuscles.includes('Abs') || e.targetMuscles.includes('Core'))) ||
    (e.muscleGroups && (e.muscleGroups.includes('Core') || e.muscleGroups.includes('Abs')))
  );
  if (pilatesCoreExercises.length >= 3) {
    const numExercises = Math.min(6, pilatesCoreExercises.length);
    workouts.push({
      title: 'Pilates Core & Abs Workout',
      description: 'Targeted Pilates exercises for core strength and toned abs',
      targetMuscleGroup: ['Abs/Core'],
      estimatedCaloriesBurned: 180,
      numberOfExercises: numExercises,
      duration: 25,
      difficulty: userGoals.trainingLevel,
      equipment: getEquipmentFromExercises(pilatesCoreExercises.slice(0, numExercises)),
      exercises: pilatesCoreExercises.slice(0, numExercises).map(ex => ({
        exercise: ex._id,
        sets: ex.setsForGoals?.['Lose Weight']?.min || 3,
        reps: ex.repsForGoals?.['Lose Weight']?.min || 15,
        rest: 30,
      })),
      goalCriteria: ['Lose Weight'],
      focusAreaCriteria: ['Abs/Core'],
      trainingLevelCriteria: [userGoals.trainingLevel],
      workoutTypeCriteria: userGoals.workoutType || [],
    });
  }

  if (yogaExercises.length >= 4) {
    const numExercises = Math.min(8, yogaExercises.length);
    workouts.push({
      title: 'Yoga Flow for Weight Loss',
      description: 'Dynamic yoga sequence to burn calories and strengthen core',
      targetMuscleGroup: userGoals.focusArea || ['Full Body'],
      estimatedCaloriesBurned: 200,
      numberOfExercises: numExercises,
      duration: 30,
      difficulty: userGoals.trainingLevel,
      equipment: getEquipmentFromExercises(yogaExercises.slice(0, numExercises)),
      exercises: yogaExercises.slice(0, numExercises).map(ex => ({
        exercise: ex._id,
        sets: ex.setsForGoals?.['Lose Weight']?.min || 2,
        reps: ex.repsForGoals?.['Lose Weight']?.min || 30, // seconds
        rest: 15,
      })),
      goalCriteria: ['Lose Weight'],
      focusAreaCriteria: userGoals.focusArea || ['Full Body'],
      trainingLevelCriteria: [userGoals.trainingLevel],
      workoutTypeCriteria: userGoals.workoutType || [],
    });
  }

  const bodyweightHIIT = bodyweightExercises.filter(e => 
    e.category === 'Cardio' || (e.targetMuscles && e.targetMuscles.includes('Cardio'))
  );
  if (bodyweightHIIT.length >= 3) {
    const numExercises = Math.min(6, bodyweightHIIT.length);
    workouts.push({
      title: 'Bodyweight HIIT Blast',
      description: 'No equipment needed! High-intensity bodyweight exercises for maximum calorie burn',
      targetMuscleGroup: ['Full Body'],
      estimatedCaloriesBurned: 280,
      numberOfExercises: numExercises,
      duration: 20,
      difficulty: userGoals.trainingLevel,
      equipment: ['Body Weight', 'None'],
      exercises: bodyweightHIIT.slice(0, numExercises).map(ex => ({
        exercise: ex._id,
        sets: 3,
        reps: ex.repsForGoals?.['Lose Weight']?.min || 20,
        rest: 30,
      })),
      goalCriteria: ['Lose Weight'],
      focusAreaCriteria: ['Full Body'],
      trainingLevelCriteria: [userGoals.trainingLevel],
      workoutTypeCriteria: userGoals.workoutType || [],
    });
  }

  const hiitExercises = cardioExercises.length >= 3 ? cardioExercises : (focusAreaExercises.length > 0 ? focusAreaExercises : exercises);
  if (hiitExercises.length >= 3) {
    const numExercises = Math.min(6, hiitExercises.length);
    workouts.push({
      title: '20-30 Min HIIT Workout',
      description: 'High-intensity interval training to maximize calorie burn',
      targetMuscleGroup: userGoals.focusArea || ['Full Body'],
      estimatedCaloriesBurned: 300,
      numberOfExercises: numExercises,
      duration: 25,
      difficulty: userGoals.trainingLevel,
      equipment: getEquipmentFromExercises(hiitExercises.slice(0, numExercises)),
      exercises: hiitExercises.slice(0, numExercises).map(ex => ({
        exercise: ex._id,
        sets: 3,
        reps: 30, // seconds for HIIT
        rest: 30,
      })),
      goalCriteria: ['Lose Weight'],
      focusAreaCriteria: userGoals.focusArea || [],
      trainingLevelCriteria: [userGoals.trainingLevel],
      workoutTypeCriteria: userGoals.workoutType || [],
    });
  }

  const circuitExercises = fullBodyExercises.length >= 4 
    ? fullBodyExercises 
    : (focusAreaExercises.length >= 4 ? focusAreaExercises : exercises);
  if (circuitExercises.length >= 4) {
    const numExercises = Math.min(8, circuitExercises.length);
    workouts.push({
      title: 'Full Body Circuit Training',
      description: 'Complete body workout with minimal rest for maximum calorie burn',
      targetMuscleGroup: userGoals.focusArea || ['Full Body'],
      estimatedCaloriesBurned: 250,
      numberOfExercises: numExercises,
      duration: 30,
      difficulty: userGoals.trainingLevel,
      equipment: getEquipmentFromExercises(circuitExercises.slice(0, numExercises)),
      exercises: circuitExercises.slice(0, numExercises).map(ex => ({
        exercise: ex._id,
        sets: 3,
        reps: 15,
        rest: 20,
      })),
      goalCriteria: ['Lose Weight'],
      focusAreaCriteria: userGoals.focusArea || ['Full Body'],
      trainingLevelCriteria: [userGoals.trainingLevel],
      workoutTypeCriteria: userGoals.workoutType || [],
    });
  }

  if (workouts.length === 0 && exercises.length > 0) {
    const numExercises = Math.min(5, exercises.length);
    workouts.push({
      title: 'Weight Loss Workout',
      description: 'High-intensity workout designed for weight loss',
      targetMuscleGroup: userGoals.focusArea || ['Full Body'],
      estimatedCaloriesBurned: 200,
      numberOfExercises: numExercises,
      duration: 30,
      difficulty: userGoals.trainingLevel,
      equipment: getEquipmentFromExercises(exercises.slice(0, numExercises)),
      exercises: exercises.slice(0, numExercises).map(ex => ({
        exercise: ex._id,
        sets: 3,
        reps: 15,
        rest: 30,
      })),
      goalCriteria: ['Lose Weight'],
      focusAreaCriteria: userGoals.focusArea || [],
      trainingLevelCriteria: [userGoals.trainingLevel],
      workoutTypeCriteria: userGoals.workoutType || [],
    });
  }

  return workouts;
};

const generateMuscleGainWorkouts = (exercises, userGoals) => {
  const workouts = [];
  const focusAreas = userGoals.focusArea || ['Full Body'];
  const pilatesExercises = exercises.filter(e => e.category === 'Pilates');

  if (focusAreas.includes('Abs/Core') && pilatesExercises.length >= 3) {
    const pilatesCoreExercises = pilatesExercises.filter(e => 
      (e.targetMuscles && (e.targetMuscles.includes('Abs') || e.targetMuscles.includes('Core'))) ||
      (e.muscleGroups && (e.muscleGroups.includes('Core') || e.muscleGroups.includes('Abs')))
    );
    if (pilatesCoreExercises.length >= 3) {
      const numExercises = Math.min(6, pilatesCoreExercises.length);
      workouts.push({
        title: 'Pilates Core Strength Workout',
        description: 'Advanced Pilates exercises for building core strength and definition',
        targetMuscleGroup: ['Abs/Core'],
        estimatedCaloriesBurned: 200,
        numberOfExercises: numExercises,
        duration: 40,
        difficulty: userGoals.trainingLevel,
        equipment: getEquipmentFromExercises(pilatesCoreExercises.slice(0, numExercises)),
        exercises: pilatesCoreExercises.slice(0, numExercises).map(ex => ({
          exercise: ex._id,
          sets: ex.setsForGoals?.['Gain Muscle Mass']?.min || 4,
          reps: ex.repsForGoals?.['Gain Muscle Mass']?.min || 12,
          rest: 45,
        })),
        goalCriteria: ['Gain Muscle Mass'],
        focusAreaCriteria: ['Abs/Core'],
        trainingLevelCriteria: [userGoals.trainingLevel],
        workoutTypeCriteria: userGoals.workoutType || [],
      });
    }
  }

  focusAreas.forEach(area => {
    const areaExercises = filterExercisesByArea(exercises, area);
    // Lower threshold - generate workout if we have at least 2 exercises
    if (areaExercises.length >= 2) {
      const numExercises = Math.min(6, areaExercises.length);
      workouts.push({
        title: `${area} Hypertrophy Workout`,
        description: `8-12 reps, 3-5 sets for muscle growth. Focus on progressive overload.`,
        targetMuscleGroup: [area],
        estimatedCaloriesBurned: 200,
        numberOfExercises: numExercises,
        duration: 45,
        difficulty: userGoals.trainingLevel,
        equipment: getEquipmentFromExercises(areaExercises.slice(0, numExercises)),
        exercises: areaExercises.slice(0, numExercises).map(ex => ({
          exercise: ex._id,
          sets: 4,
          reps: 10,
          rest: 60,
        })),
        goalCriteria: ['Gain Muscle Mass'],
        focusAreaCriteria: [area],
        trainingLevelCriteria: [userGoals.trainingLevel],
        workoutTypeCriteria: userGoals.workoutType || [],
      });
    }
  });

  // If no workouts generated, create one from any exercises
  if (workouts.length === 0 && exercises.length > 0) {
    const numExercises = Math.min(5, exercises.length);
    workouts.push({
      title: 'Muscle Gain Workout',
      description: 'Hypertrophy-focused workout for muscle growth',
      targetMuscleGroup: userGoals.focusArea || ['Full Body'],
      estimatedCaloriesBurned: 200,
      numberOfExercises: numExercises,
      duration: 45,
      difficulty: userGoals.trainingLevel,
      equipment: getEquipmentFromExercises(exercises.slice(0, numExercises)),
      exercises: exercises.slice(0, numExercises).map(ex => ({
        exercise: ex._id,
        sets: 4,
        reps: 10,
        rest: 60,
      })),
      goalCriteria: ['Gain Muscle Mass'],
      focusAreaCriteria: userGoals.focusArea || [],
      trainingLevelCriteria: [userGoals.trainingLevel],
      workoutTypeCriteria: userGoals.workoutType || [],
    });
  }

  return workouts;
};

const generateStrengthWorkouts = (exercises, userGoals) => {
  const workouts = [];
  const compoundExercises = exercises.filter(e => 
    ['Squat', 'Deadlift', 'Bench Press', 'Overhead Press', 'Row', 'Pull'].some(term => 
      e.name.toLowerCase().includes(term.toLowerCase())
    )
  );

  if (compoundExercises.length >= 3) {
    workouts.push({
      title: 'Strength Training Session',
      description: 'Low reps (4-6), high sets (4-6), heavy lifts for maximum strength',
      targetMuscleGroup: userGoals.focusArea || ['Full Body'],
      estimatedCaloriesBurned: 180,
      numberOfExercises: 5,
      duration: 60,
      difficulty: userGoals.trainingLevel,
      equipment: getEquipmentFromExercises(compoundExercises.slice(0, 5)),
      exercises: compoundExercises.slice(0, 5).map(ex => ({
        exercise: ex._id,
        sets: 5,
        reps: 5,
        rest: 180,
      })),
      goalCriteria: ['Build Strength'],
      focusAreaCriteria: userGoals.focusArea || [],
      trainingLevelCriteria: [userGoals.trainingLevel],
      workoutTypeCriteria: userGoals.workoutType || [],
    });
  }

  return workouts;
};

const filterExercisesByArea = (exercises, area) => {
  const areaMapping = {
    'Chest': ['Chest'],
    'Back': ['Back'],
    'Shoulders': ['Shoulders'],
    'Arms': ['Biceps', 'Triceps', 'Arms'],
    'Legs': ['Legs', 'Quadriceps', 'Hamstrings', 'Glutes', 'Calves'],
    'Abs/Core': ['Core', 'Abs'],
    'Full Body': ['Full Body', 'Core', 'Abs'],
    'Upper Body': ['Chest', 'Back', 'Shoulders', 'Arms'],
    'Lower Body': ['Legs', 'Quadriceps', 'Hamstrings', 'Glutes', 'Calves'],
    'Cardio': ['Cardio'],
  };

  const targetMuscles = areaMapping[area] || [];
  return exercises.filter(ex =>
    targetMuscles.some(muscle =>
      (ex.targetMuscles && ex.targetMuscles.includes(muscle)) ||
      (ex.muscleGroups && ex.muscleGroups.includes(muscle)) ||
      (ex.category === muscle)
    ) ||
    (area === 'Abs/Core' && (ex.category === 'Pilates' || ex.category === 'Yoga')) ||
    (area === 'Full Body' && (ex.category === 'Pilates' || ex.category === 'Yoga' || ex.category === 'Bodyweight' || ex.category === 'Cardio'))
  );
};

const getEquipmentFromExercises = (exercises) => {
  const equipmentSet = new Set();
  exercises.forEach(ex => {
    if (ex.equipment) {
      ex.equipment.forEach(eq => equipmentSet.add(eq));
    }
  });
  return Array.from(equipmentSet);
};

const generateWeightGainWorkouts = (exercises, userGoals) => {
  return generateMuscleGainWorkouts(exercises, userGoals);
};

const generateEnduranceWorkouts = (exercises, userGoals) => {
  const workouts = [];
  const cardioExercises = exercises.filter(e => e.category === 'Cardio' || e.targetMuscles.includes('Cardio'));

  if (cardioExercises.length >= 3) {
    workouts.push({
      title: 'Endurance Training',
      description: 'Longer duration, moderate intensity for improved cardiovascular fitness',
      targetMuscleGroup: ['Cardio'],
      estimatedCaloriesBurned: 350,
      numberOfExercises: 4,
      duration: 45,
      difficulty: userGoals.trainingLevel,
      equipment: getEquipmentFromExercises(cardioExercises.slice(0, 4)),
      exercises: cardioExercises.slice(0, 4).map(ex => ({
        exercise: ex._id,
        sets: 1,
        reps: 20, // minutes
        rest: 5,
      })),
      goalCriteria: ['Improve Endurance'],
      focusAreaCriteria: ['Cardio'],
      trainingLevelCriteria: [userGoals.trainingLevel],
      workoutTypeCriteria: userGoals.workoutType || [],
    });
  }

  return workouts;
};

const generateMaintenanceWorkouts = (exercises, userGoals) => {
  return generateGeneralWorkouts(exercises, userGoals);
};

const generateGeneralWorkouts = (exercises, userGoals) => {
  const workouts = [];
  const focusAreas = userGoals.focusArea || ['Full Body'];

  focusAreas.forEach(area => {
    const areaExercises = filterExercisesByArea(exercises, area);
    // Lower threshold - generate workout if we have at least 2 exercises
    if (areaExercises.length >= 2) {
      const numExercises = Math.min(5, areaExercises.length);
      workouts.push({
        title: `${area} Workout`,
        description: `Balanced workout for ${area.toLowerCase()}`,
        targetMuscleGroup: [area],
        estimatedCaloriesBurned: 200,
        numberOfExercises: numExercises,
        duration: 35,
        difficulty: userGoals.trainingLevel,
        equipment: getEquipmentFromExercises(areaExercises.slice(0, numExercises)),
        exercises: areaExercises.slice(0, numExercises).map(ex => ({
          exercise: ex._id,
          sets: 3,
          reps: 12,
          rest: 45,
        })),
        goalCriteria: ['Maintain Fitness'],
        focusAreaCriteria: [area],
        trainingLevelCriteria: [userGoals.trainingLevel],
        workoutTypeCriteria: userGoals.workoutType || [],
      });
    }
  });

  // If no workouts generated, create one from any exercises
  if (workouts.length === 0 && exercises.length > 0) {
    const numExercises = Math.min(5, exercises.length);
    workouts.push({
      title: 'General Workout',
      description: 'Balanced workout routine',
      targetMuscleGroup: userGoals.focusArea || ['Full Body'],
      estimatedCaloriesBurned: 200,
      numberOfExercises: numExercises,
      duration: 35,
      difficulty: userGoals.trainingLevel,
      equipment: getEquipmentFromExercises(exercises.slice(0, numExercises)),
      exercises: exercises.slice(0, numExercises).map(ex => ({
        exercise: ex._id,
        sets: 3,
        reps: 12,
        rest: 45,
      })),
      goalCriteria: ['Maintain Fitness'],
      focusAreaCriteria: userGoals.focusArea || [],
      trainingLevelCriteria: [userGoals.trainingLevel],
      workoutTypeCriteria: userGoals.workoutType || [],
    });
  }

  return workouts;
};

module.exports = {
  getSuggestedWorkouts,
};

