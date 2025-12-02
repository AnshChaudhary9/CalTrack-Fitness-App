// Predefined workouts database with exercise information
// caloriesPerMinute is used to calculate calories based on duration
export const workoutDatabase = [
  // Cardio Workouts
  { name: 'Running', type: 'Running', duration: 30, calories: 300, caloriesPerMinute: 10, notes: 'Moderate pace running' },
  { name: 'Jogging', type: 'Running', duration: 30, calories: 240, caloriesPerMinute: 8, notes: 'Light pace jogging' },
  { name: 'Sprint Running', type: 'Running', duration: 20, calories: 250, caloriesPerMinute: 12.5, notes: 'High intensity sprints' },
  { name: '5K Run', type: 'Running', duration: 30, calories: 350, caloriesPerMinute: 11.7, notes: '5 kilometer run' },
  { name: '10K Run', type: 'Running', duration: 60, calories: 700, caloriesPerMinute: 11.7, notes: '10 kilometer run' },
  { name: 'Marathon Training', type: 'Running', duration: 90, calories: 1000, caloriesPerMinute: 11.1, notes: 'Long distance training' },
  { name: 'Treadmill Running', type: 'Cardio', duration: 30, calories: 280, caloriesPerMinute: 9.3, notes: 'Treadmill workout' },
  { name: 'Interval Running', type: 'Running', duration: 25, calories: 300, caloriesPerMinute: 12, notes: 'HIIT running intervals' },
  { name: 'Trail Running', type: 'Running', duration: 45, calories: 500, caloriesPerMinute: 11.1, notes: 'Trail running' },
  { name: 'Track Running', type: 'Running', duration: 30, calories: 320, caloriesPerMinute: 10.7, notes: 'Track running' },
  
  // Cycling Workouts
  { name: 'Cycling', type: 'Cycling', duration: 45, calories: 400, caloriesPerMinute: 8.9, notes: 'Moderate pace cycling' },
  { name: 'Road Cycling', type: 'Cycling', duration: 60, calories: 500, caloriesPerMinute: 8.3, notes: 'Outdoor road cycling' },
  { name: 'Mountain Biking', type: 'Cycling', duration: 60, calories: 600, caloriesPerMinute: 10, notes: 'Trail mountain biking' },
  { name: 'Stationary Bike', type: 'Cycling', duration: 30, calories: 250, caloriesPerMinute: 8.3, notes: 'Indoor cycling' },
  { name: 'Spin Class', type: 'Cycling', duration: 45, calories: 450, caloriesPerMinute: 10, notes: 'High intensity spin class' },
  { name: 'Bike Commute', type: 'Cycling', duration: 20, calories: 150, caloriesPerMinute: 7.5, notes: 'Daily commute cycling' },
  { name: 'Indoor Cycling', type: 'Cycling', duration: 30, calories: 240, caloriesPerMinute: 8, notes: 'Indoor bike workout' },
  { name: 'Cycling Intervals', type: 'Cycling', duration: 30, calories: 350, caloriesPerMinute: 11.7, notes: 'High intensity intervals' },
  
  // Swimming Workouts
  { name: 'Swimming', type: 'Swimming', duration: 30, calories: 250, caloriesPerMinute: 8.3, notes: 'Freestyle swimming' },
  { name: 'Lap Swimming', type: 'Swimming', duration: 45, calories: 400, caloriesPerMinute: 8.9, notes: 'Pool lap swimming' },
  { name: 'Butterfly Stroke', type: 'Swimming', duration: 20, calories: 300, caloriesPerMinute: 15, notes: 'Butterfly stroke practice' },
  { name: 'Backstroke', type: 'Swimming', duration: 30, calories: 250, caloriesPerMinute: 8.3, notes: 'Backstroke swimming' },
  { name: 'Breaststroke', type: 'Swimming', duration: 30, calories: 280, caloriesPerMinute: 9.3, notes: 'Breaststroke swimming' },
  { name: 'Water Aerobics', type: 'Swimming', duration: 45, calories: 200, caloriesPerMinute: 4.4, notes: 'Low impact water exercises' },
  { name: 'Open Water Swimming', type: 'Swimming', duration: 60, calories: 550, caloriesPerMinute: 9.2, notes: 'Open water swimming' },
  { name: 'Swimming Drills', type: 'Swimming', duration: 30, calories: 220, caloriesPerMinute: 7.3, notes: 'Swimming technique drills' },
  
  // Strength Training
  { name: 'Full Body Workout', type: 'Strength', duration: 60, calories: 350, caloriesPerMinute: 5.8, notes: 'Complete body strength training' },
  { name: 'Upper Body', type: 'Strength', duration: 45, calories: 280, caloriesPerMinute: 6.2, notes: 'Chest, back, shoulders, arms' },
  { name: 'Lower Body', type: 'Strength', duration: 45, calories: 300, caloriesPerMinute: 6.7, notes: 'Legs and glutes workout' },
  { name: 'Chest & Triceps', type: 'Strength', duration: 45, calories: 250, caloriesPerMinute: 5.6, notes: 'Push day workout' },
  { name: 'Back & Biceps', type: 'Strength', duration: 45, calories: 250, caloriesPerMinute: 5.6, notes: 'Pull day workout' },
  { name: 'Leg Day', type: 'Strength', duration: 60, calories: 350, caloriesPerMinute: 5.8, notes: 'Squats, deadlifts, lunges' },
  { name: 'Shoulder Workout', type: 'Strength', duration: 40, calories: 200, caloriesPerMinute: 5, notes: 'Shoulder and traps' },
  { name: 'Core Workout', type: 'Strength', duration: 30, calories: 150, caloriesPerMinute: 5, notes: 'Abdominal and core exercises' },
  { name: 'Push Day', type: 'Strength', duration: 50, calories: 280, caloriesPerMinute: 5.6, notes: 'Chest, shoulders, triceps' },
  { name: 'Pull Day', type: 'Strength', duration: 50, calories: 280, caloriesPerMinute: 5.6, notes: 'Back, biceps, rear delts' },
  { name: 'Arms Workout', type: 'Strength', duration: 40, calories: 200, caloriesPerMinute: 5, notes: 'Biceps and triceps' },
  { name: 'Glutes & Hamstrings', type: 'Strength', duration: 45, calories: 250, caloriesPerMinute: 5.6, notes: 'Posterior chain focus' },
  { name: 'Chest Workout', type: 'Strength', duration: 45, calories: 260, caloriesPerMinute: 5.8, notes: 'Chest focused training' },
  { name: 'Back Workout', type: 'Strength', duration: 45, calories: 260, caloriesPerMinute: 5.8, notes: 'Back focused training' },
  { name: 'Legs & Glutes', type: 'Strength', duration: 50, calories: 320, caloriesPerMinute: 6.4, notes: 'Lower body focus' },
  { name: 'Full Body HIIT', type: 'Strength', duration: 30, calories: 280, caloriesPerMinute: 9.3, notes: 'High intensity full body' },
  
  // Cardio Machines
  { name: 'Elliptical', type: 'Cardio', duration: 30, calories: 250, caloriesPerMinute: 8.3, notes: 'Elliptical machine workout' },
  { name: 'Rowing Machine', type: 'Cardio', duration: 30, calories: 300, caloriesPerMinute: 10, notes: 'Rowing machine session' },
  { name: 'Stair Climber', type: 'Cardio', duration: 20, calories: 200, caloriesPerMinute: 10, notes: 'Stair climbing machine' },
  { name: 'Cross Trainer', type: 'Cardio', duration: 30, calories: 280, caloriesPerMinute: 9.3, notes: 'Cross trainer workout' },
  { name: 'HIIT Cardio', type: 'Cardio', duration: 20, calories: 250, caloriesPerMinute: 12.5, notes: 'High intensity interval training' },
  { name: 'Stepper', type: 'Cardio', duration: 25, calories: 180, caloriesPerMinute: 7.2, notes: 'Stepper machine workout' },
  { name: 'Arc Trainer', type: 'Cardio', duration: 30, calories: 270, caloriesPerMinute: 9, notes: 'Arc trainer workout' },
  { name: 'Assault Bike', type: 'Cardio', duration: 20, calories: 300, caloriesPerMinute: 15, notes: 'Assault bike intervals' },
  
  // Yoga & Flexibility
  { name: 'Hatha Yoga', type: 'Yoga', duration: 60, calories: 150, caloriesPerMinute: 2.5, notes: 'Gentle yoga practice' },
  { name: 'Vinyasa Yoga', type: 'Yoga', duration: 60, calories: 200, caloriesPerMinute: 3.3, notes: 'Flow yoga practice' },
  { name: 'Power Yoga', type: 'Yoga', duration: 60, calories: 250, caloriesPerMinute: 4.2, notes: 'Intense yoga workout' },
  { name: 'Ashtanga Yoga', type: 'Yoga', duration: 90, calories: 300, caloriesPerMinute: 3.3, notes: 'Traditional ashtanga practice' },
  { name: 'Yin Yoga', type: 'Yoga', duration: 60, calories: 100, caloriesPerMinute: 1.7, notes: 'Restorative yoga practice' },
  { name: 'Hot Yoga', type: 'Yoga', duration: 60, calories: 300, caloriesPerMinute: 5, notes: 'Bikram hot yoga' },
  { name: 'Yoga Flow', type: 'Yoga', duration: 45, calories: 180, caloriesPerMinute: 4, notes: 'Dynamic yoga flow' },
  { name: 'Stretching', type: 'Yoga', duration: 30, calories: 80, caloriesPerMinute: 2.7, notes: 'Flexibility and stretching' },
  { name: 'Pilates', type: 'Yoga', duration: 45, calories: 150, caloriesPerMinute: 3.3, notes: 'Pilates core workout' },
  { name: 'Yoga for Beginners', type: 'Yoga', duration: 45, calories: 120, caloriesPerMinute: 2.7, notes: 'Beginner friendly yoga' },
  { name: 'Yoga Meditation', type: 'Yoga', duration: 30, calories: 60, caloriesPerMinute: 2, notes: 'Meditation and yoga' },
  
  // Sports & Activities
  { name: 'Basketball', type: 'Cardio', duration: 60, calories: 500, caloriesPerMinute: 8.3, notes: 'Basketball game or practice' },
  { name: 'Football', type: 'Cardio', duration: 90, calories: 600, caloriesPerMinute: 6.7, notes: 'Football match' },
  { name: 'Soccer', type: 'Cardio', duration: 90, calories: 550, caloriesPerMinute: 6.1, notes: 'Soccer match' },
  { name: 'Tennis', type: 'Cardio', duration: 60, calories: 400, caloriesPerMinute: 6.7, notes: 'Tennis match' },
  { name: 'Badminton', type: 'Cardio', duration: 45, calories: 250, caloriesPerMinute: 5.6, notes: 'Badminton game' },
  { name: 'Volleyball', type: 'Cardio', duration: 60, calories: 300, caloriesPerMinute: 5, notes: 'Volleyball game' },
  { name: 'Cricket', type: 'Cardio', duration: 120, calories: 400, caloriesPerMinute: 3.3, notes: 'Cricket match' },
  { name: 'Table Tennis', type: 'Cardio', duration: 30, calories: 150, caloriesPerMinute: 5, notes: 'Table tennis game' },
  { name: 'Squash', type: 'Cardio', duration: 45, calories: 400, caloriesPerMinute: 8.9, notes: 'Squash game' },
  { name: 'Racquetball', type: 'Cardio', duration: 45, calories: 350, caloriesPerMinute: 7.8, notes: 'Racquetball game' },
  { name: 'Rock Climbing', type: 'Strength', duration: 60, calories: 500, caloriesPerMinute: 8.3, notes: 'Indoor or outdoor climbing' },
  { name: 'Hiking', type: 'Cardio', duration: 120, calories: 600, caloriesPerMinute: 5, notes: 'Mountain or trail hiking' },
  { name: 'Dancing', type: 'Cardio', duration: 45, calories: 250, caloriesPerMinute: 5.6, notes: 'Dance workout or class' },
  { name: 'Zumba', type: 'Cardio', duration: 60, calories: 400, caloriesPerMinute: 6.7, notes: 'Zumba dance fitness' },
  { name: 'Aerobics', type: 'Cardio', duration: 45, calories: 300, caloriesPerMinute: 6.7, notes: 'Aerobic exercise class' },
  { name: 'Kickboxing', type: 'Cardio', duration: 45, calories: 450, caloriesPerMinute: 10, notes: 'Kickboxing workout' },
  { name: 'Boxing', type: 'Cardio', duration: 45, calories: 400, caloriesPerMinute: 8.9, notes: 'Boxing training' },
  { name: 'Martial Arts', type: 'Cardio', duration: 60, calories: 350, caloriesPerMinute: 5.8, notes: 'Martial arts practice' },
  { name: 'Karate', type: 'Cardio', duration: 60, calories: 380, caloriesPerMinute: 6.3, notes: 'Karate training' },
  { name: 'Taekwondo', type: 'Cardio', duration: 60, calories: 400, caloriesPerMinute: 6.7, notes: 'Taekwondo practice' },
  { name: 'Judo', type: 'Cardio', duration: 60, calories: 420, caloriesPerMinute: 7, notes: 'Judo training' },
  { name: 'BJJ', type: 'Cardio', duration: 60, calories: 450, caloriesPerMinute: 7.5, notes: 'Brazilian Jiu-Jitsu' },
  
  // Home Workouts
  { name: 'Home Cardio', type: 'Cardio', duration: 30, calories: 200, caloriesPerMinute: 6.7, notes: 'At-home cardio workout' },
  { name: 'Bodyweight Workout', type: 'Strength', duration: 30, calories: 200, caloriesPerMinute: 6.7, notes: 'No equipment needed' },
  { name: 'Push-ups & Sit-ups', type: 'Strength', duration: 20, calories: 150, caloriesPerMinute: 7.5, notes: 'Basic bodyweight exercises' },
  { name: 'Jump Rope', type: 'Cardio', duration: 20, calories: 200, caloriesPerMinute: 10, notes: 'Jump rope workout' },
  { name: 'Burpees', type: 'Cardio', duration: 15, calories: 150, caloriesPerMinute: 10, notes: 'High intensity burpee workout' },
  { name: 'Plank Challenge', type: 'Strength', duration: 15, calories: 80, caloriesPerMinute: 5.3, notes: 'Core strengthening planks' },
  { name: 'Squat Challenge', type: 'Strength', duration: 20, calories: 120, caloriesPerMinute: 6, notes: 'Bodyweight squats' },
  { name: 'Lunges', type: 'Strength', duration: 15, calories: 100, caloriesPerMinute: 6.7, notes: 'Lunge variations' },
  { name: 'Mountain Climbers', type: 'Cardio', duration: 15, calories: 120, caloriesPerMinute: 8, notes: 'Full body cardio exercise' },
  { name: 'Jumping Jacks', type: 'Cardio', duration: 10, calories: 80, caloriesPerMinute: 8, notes: 'Warm-up cardio' },
  { name: 'Home HIIT', type: 'Cardio', duration: 20, calories: 220, caloriesPerMinute: 11, notes: 'Home HIIT workout' },
  { name: 'Tabata Workout', type: 'Cardio', duration: 20, calories: 240, caloriesPerMinute: 12, notes: 'Tabata interval training' },
  { name: '7-Minute Workout', type: 'Cardio', duration: 7, calories: 80, caloriesPerMinute: 11.4, notes: 'Quick 7-minute workout' },
  { name: 'Abs Workout', type: 'Strength', duration: 15, calories: 90, caloriesPerMinute: 6, notes: 'Abdominal exercises' },
  
  // Functional Training
  { name: 'CrossFit', type: 'Strength', duration: 60, calories: 500, caloriesPerMinute: 8.3, notes: 'CrossFit WOD workout' },
  { name: 'Circuit Training', type: 'Cardio', duration: 30, calories: 300, caloriesPerMinute: 10, notes: 'Circuit training session' },
  { name: 'Functional Training', type: 'Strength', duration: 45, calories: 280, caloriesPerMinute: 6.2, notes: 'Functional movement workout' },
  { name: 'TRX Training', type: 'Strength', duration: 45, calories: 250, caloriesPerMinute: 5.6, notes: 'Suspension training' },
  { name: 'Kettlebell Workout', type: 'Strength', duration: 30, calories: 250, caloriesPerMinute: 8.3, notes: 'Kettlebell exercises' },
  { name: 'Battle Ropes', type: 'Cardio', duration: 20, calories: 200, caloriesPerMinute: 10, notes: 'Battle rope training' },
  { name: 'Medicine Ball', type: 'Strength', duration: 30, calories: 180, caloriesPerMinute: 6, notes: 'Medicine ball workout' },
  { name: 'Sandbag Training', type: 'Strength', duration: 30, calories: 220, caloriesPerMinute: 7.3, notes: 'Sandbag exercises' },
  { name: 'Resistance Band', type: 'Strength', duration: 30, calories: 150, caloriesPerMinute: 5, notes: 'Resistance band workout' },
  { name: 'Dumbbell Workout', type: 'Strength', duration: 45, calories: 280, caloriesPerMinute: 6.2, notes: 'Dumbbell training' },
  { name: 'Barbell Workout', type: 'Strength', duration: 60, calories: 400, caloriesPerMinute: 6.7, notes: 'Barbell training' },
  
  // Walking
  { name: 'Walking', type: 'Cardio', duration: 30, calories: 120, caloriesPerMinute: 4, notes: 'Brisk walking' },
  { name: 'Power Walking', type: 'Cardio', duration: 45, calories: 200, caloriesPerMinute: 4.4, notes: 'Fast pace walking' },
  { name: 'Treadmill Walking', type: 'Cardio', duration: 30, calories: 150, caloriesPerMinute: 5, notes: 'Treadmill walk' },
  { name: 'Nature Walk', type: 'Cardio', duration: 60, calories: 180, caloriesPerMinute: 3, notes: 'Leisurely nature walk' },
  { name: 'Urban Walking', type: 'Cardio', duration: 45, calories: 150, caloriesPerMinute: 3.3, notes: 'City walking' },
  { name: 'Speed Walking', type: 'Cardio', duration: 30, calories: 160, caloriesPerMinute: 5.3, notes: 'Fast walking pace' },
  { name: 'Nordic Walking', type: 'Cardio', duration: 45, calories: 250, caloriesPerMinute: 5.6, notes: 'Nordic walking with poles' },
  
  // Other Activities
  { name: 'Gardening', type: 'Other', duration: 60, calories: 200, caloriesPerMinute: 3.3, notes: 'Gardening activities' },
  { name: 'House Cleaning', type: 'Other', duration: 60, calories: 150, caloriesPerMinute: 2.5, notes: 'Active house cleaning' },
  { name: 'Yard Work', type: 'Other', duration: 60, calories: 250, caloriesPerMinute: 4.2, notes: 'Lawn mowing and yard work' },
  { name: 'Golf', type: 'Other', duration: 180, calories: 300, caloriesPerMinute: 1.7, notes: 'Golf game (walking)' },
  { name: 'Skating', type: 'Cardio', duration: 45, calories: 300, caloriesPerMinute: 6.7, notes: 'Ice or roller skating' },
  { name: 'Skiing', type: 'Cardio', duration: 120, calories: 500, caloriesPerMinute: 4.2, notes: 'Downhill or cross-country skiing' },
  { name: 'Snowboarding', type: 'Cardio', duration: 120, calories: 450, caloriesPerMinute: 3.8, notes: 'Snowboarding session' },
  { name: 'Surfing', type: 'Cardio', duration: 60, calories: 300, caloriesPerMinute: 5, notes: 'Surfing session' },
  { name: 'Kayaking', type: 'Cardio', duration: 60, calories: 280, caloriesPerMinute: 4.7, notes: 'Kayaking' },
  { name: 'Paddleboarding', type: 'Cardio', duration: 60, calories: 250, caloriesPerMinute: 4.2, notes: 'Stand-up paddleboarding' },
  { name: 'Rowing', type: 'Cardio', duration: 30, calories: 280, caloriesPerMinute: 9.3, notes: 'Rowing workout' },
  { name: 'Skateboarding', type: 'Cardio', duration: 60, calories: 300, caloriesPerMinute: 5, notes: 'Skateboarding' },
  { name: 'Inline Skating', type: 'Cardio', duration: 45, calories: 320, caloriesPerMinute: 7.1, notes: 'Inline skating' },
];

// Search function to find workout by name
export const searchWorkout = (query) => {
  if (!query || query.trim().length < 2) return [];
  
  const searchTerm = query.toLowerCase().trim();
  return workoutDatabase.filter(workout => 
    workout.name.toLowerCase().includes(searchTerm) ||
    workout.type.toLowerCase().includes(searchTerm) ||
    (workout.notes && workout.notes.toLowerCase().includes(searchTerm))
  ).slice(0, 20); // Return top 20 matches
};

// Get exact match or closest match
export const getWorkoutInfo = (workoutName) => {
  const searchTerm = workoutName.toLowerCase().trim();
  const exactMatch = workoutDatabase.find(workout => 
    workout.name.toLowerCase() === searchTerm
  );
  
  if (exactMatch) return exactMatch;
  
  // Return closest match
  const matches = searchWorkout(workoutName);
  return matches.length > 0 ? matches[0] : null;
};

// Get workouts by type
export const getWorkoutsByType = (type) => {
  return workoutDatabase.filter(workout => workout.type === type);
};

// Calculate calories based on duration
export const calculateCalories = (workout, duration) => {
  if (!workout || !duration) return 0;
  
  // If workout has caloriesPerMinute, use that
  if (workout.caloriesPerMinute) {
    return Math.round(workout.caloriesPerMinute * duration);
  }
  
  // Otherwise calculate from base duration and calories
  if (workout.duration && workout.calories) {
    const caloriesPerMinute = workout.calories / workout.duration;
    return Math.round(caloriesPerMinute * duration);
  }
  
  return 0;
};
