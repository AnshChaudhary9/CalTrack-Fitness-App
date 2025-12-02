
const caloriesPerMinuteByType = {
  Cardio: 10,
  Strength: 6,
  Yoga: 3,
  Swimming: 10,
  Cycling: 8,
  Running: 11,
  Other: 7,
};

const caloriesPerMinuteByName = {
  'HIIT Cardio': 12,
  'Treadmill Session': 11,
  'Stair Climbing': 12,
  'Jump Rope': 12,
  'Dance Cardio': 8,
  'Zumba Class': 8,
  'Kickboxing': 10,
  'Morning Run': 11,
  'Evening Jog': 10,
  'Sprint Training': 13,
  'Interval Running': 12,
  'Tempo Run': 11,
  'Trail Running': 11,
  'Marathon Training': 11,
  'Long Distance Run': 10,
  'Burpees': 12,
  'Jump Squats': 10,
  'Box Jumps': 10,
  'Battle Ropes': 12,
  'Mountain Climbers': 9,
  'High Knees': 8,
  'Plank Jacks': 9,
  'Rowing Machine': 10,
  'Elliptical': 9,
  'Stair Climber': 11,
  'Spin Class': 9,
  'Indoor Cycling': 8,
  'Road Cycling': 8,
  'Mountain Biking': 9,
  'Swimming Laps': 10,
  'Pool Swimming': 10,
  'Freestyle Swim': 10,
  'Water Aerobics': 6,
  
  'Full Body Strength': 7,
  'Upper Body Workout': 6,
  'Lower Body Workout': 7,
  'Push Day': 6,
  'Pull Day': 6,
  'Leg Day': 7,
  'Chest Day': 6,
  'Back Day': 6,
  'Shoulder Day': 6,
  'Arm Day': 5,
  'Core Strength': 5,
  'Powerlifting Session': 5,
  'Bodybuilding Routine': 6,
  'Functional Strength': 7,
  'Compound Movements': 7,
  'Kettlebell Swings': 10,
  'Circuit Training': 10,
  
  'Morning Yoga Flow': 3,
  'Evening Yoga': 3,
  'Power Yoga': 5,
  'Vinyasa Flow': 4,
  'Hatha Yoga': 3,
  'Yin Yoga': 2,
  'Restorative Yoga': 2,
  'Ashtanga Yoga': 5,
  'Hot Yoga': 6,
  'Bikram Yoga': 6,
  
  'Pilates Session': 4,
  'Pilates Core': 4,
  'Pilates Core & Abs Workout': 5,
  'Pilates Core Strength Workout': 5,
  
  'Bodyweight Workout': 8,
  'Bodyweight HIIT Blast': 11,
  'Calisthenics': 8,
  'Full Body Circuit': 9,
  
  'CrossFit': 12,
  'Boxing Training': 10,
  'Martial Arts': 8,
  'Rock Climbing': 8,
  'Hiking': 6,
  'Barre Workout': 5,
  'TRX Training': 8,
  'Bootcamp': 11,
  'HIIT Workout': 12,
  'Tabata': 13,
  'EMOM': 10,
  'AMRAP': 10,
  'Functional Training': 8,
  'Mobility Work': 3,
  'Stretching': 2,
  'Flexibility Training': 3,
  'Balance Workout': 4,
  'Plyometrics': 10,
};

/**
 * Calculate calories burned based on workout type, name, and duration
 * @param {String} type - Workout type (Cardio, Strength, Yoga, etc.)
 * @param {String} name - Workout name (optional, for more specific calculation)
 * @param {Number} duration - Duration in minutes
 * @param {Number} userWeight - User weight in kg (optional, defaults to 70kg)
 * @returns {Number} - Calculated calories burned
 */
const calculateCalories = (type, name, duration, userWeight = 70) => {
  if (!duration || duration <= 0) {
    return 0;
  }

  let caloriesPerMin = null;
  if (name && caloriesPerMinuteByName[name]) {
    caloriesPerMin = caloriesPerMinuteByName[name];
  } else if (type && caloriesPerMinuteByType[type]) {
    caloriesPerMin = caloriesPerMinuteByType[type];
  } else {
    caloriesPerMin = 7;
  }

  const weightMultiplier = userWeight / 70;
  
  const calories = Math.round(duration * caloriesPerMin * weightMultiplier);
  
  return Math.max(0, calories); // Ensure non-negative
};

module.exports = {
  calculateCalories,
  caloriesPerMinuteByType,
  caloriesPerMinuteByName,
};

