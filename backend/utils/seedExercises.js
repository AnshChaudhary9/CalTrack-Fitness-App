const ExerciseDatabase = require('../models/ExerciseDatabase');
const exerciseSeedData = require('../data/exerciseSeedData');

// Auto-seed exercise database if empty or missing exercises
const autoSeedExercises = async () => {
  try {
    const count = await ExerciseDatabase.countDocuments();
    
    if (count === 0) {
      console.log('Exercise database is empty. Auto-seeding exercises...');
      
      try {
        await ExerciseDatabase.insertMany(exerciseSeedData);
        console.log(`✓ Successfully auto-seeded ${exerciseSeedData.length} exercises`);
      } catch (error) {
        // If duplicates exist, try inserting one by one
        if (error.code === 11000 || error.message.includes('duplicate')) {
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
                console.error('Error inserting exercise:', err);
              }
            }
          }
          console.log(`✓ Auto-seeded ${inserted} exercises, skipped ${skipped} duplicates`);
        } else {
          throw error;
        }
      }
    } else {
      // Check if we need to add more exercises (in case some are missing)
      const existingNames = await ExerciseDatabase.find({ isCustom: false }).select('name');
      const existingNameSet = new Set(existingNames.map(e => e.name.toLowerCase()));
      const newExercises = exerciseSeedData.filter(ex => 
        !existingNameSet.has(ex.name.toLowerCase())
      );
      
      if (newExercises.length > 0) {
        console.log(`Adding ${newExercises.length} missing exercises...`);
        try {
          await ExerciseDatabase.insertMany(newExercises);
          console.log(`✓ Added ${newExercises.length} new exercises`);
        } catch (error) {
          // Try one by one if bulk insert fails
          let inserted = 0;
          for (const exercise of newExercises) {
            try {
              await ExerciseDatabase.create(exercise);
              inserted++;
            } catch (err) {
              // Skip duplicates
            }
          }
          if (inserted > 0) {
            console.log(`✓ Added ${inserted} new exercises`);
          }
        }
      } else {
        console.log(`✓ Exercise database has ${count} exercises (all seed data present)`);
      }
    }
  } catch (error) {
    console.error('Error auto-seeding exercises:', error);
    // Don't throw - just log the error so server can still start
  }
};

module.exports = autoSeedExercises;

