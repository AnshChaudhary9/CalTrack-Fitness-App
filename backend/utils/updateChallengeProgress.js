const Challenge = require('../models/Challenge');
const User = require('../models/User');
const Badge = require('../models/Badge');

/**
 * Updates challenge progress for a user based on their workout data
 * @param {String} userId - User ID
 * @param {Object} workoutData - Workout data (type, calories, duration, distance, date)
 * @returns {Promise<Array>} - Array of updated challenges
 */
const updateChallengeProgress = async (userId, workoutData) => {
  try {
    const { type, calories, duration, distance, date } = workoutData;
    
    // Find all active challenges the user has joined
    const challenges = await Challenge.find({
      'participants.user': userId,
      isActive: true,
      startDate: { $lte: date || new Date() },
      endDate: { $gte: date || new Date() },
    }).populate('badgeReward');

    const updatedChallenges = [];

    for (const challenge of challenges) {
      const participant = challenge.participants.find(
        (p) => p.user.toString() === userId.toString()
      );

      if (!participant || participant.completed) {
        continue; // Skip if not joined or already completed
      }

      let progressIncrement = 0;

      // Calculate progress based on challenge type
      switch (challenge.type) {
        case 'Workout':
          // Count number of workouts
          if (type) {
            progressIncrement = 1;
          }
          break;

        case 'Calorie':
          // Sum calories burned
          if (calories) {
            progressIncrement = calories;
          }
          break;

        case 'Distance':
          // Sum distance (convert to challenge unit if needed)
          if (distance && distance > 0) {
            if (challenge.unit === 'km') {
              // Assuming distance is in miles, convert to km
              progressIncrement = distance * 1.60934;
            } else if (challenge.unit === 'miles') {
              progressIncrement = distance;
            }
          }
          break;

        case 'Duration':
          // Sum duration in minutes or hours
          if (duration) {
            if (challenge.unit === 'hours') {
              progressIncrement = duration / 60; // Convert minutes to hours
            } else if (challenge.unit === 'minutes') {
              progressIncrement = duration;
            }
          }
          break;

        case 'Custom':
          // For custom challenges, we might need specific logic
          // For now, we'll count workouts
          if (type) {
            progressIncrement = 1;
          }
          break;

        default:
          break;
      }

      if (progressIncrement > 0) {
        // Update progress
        participant.progress = (participant.progress || 0) + progressIncrement;

        // Check if challenge is completed
        if (participant.progress >= challenge.targetValue && !participant.completed) {
          participant.completed = true;
          participant.completedAt = new Date();

          // Award badge if exists
          if (challenge.badgeReward) {
            await awardBadge(userId, challenge.badgeReward);
          }
        }

        await challenge.save();
        updatedChallenges.push(challenge);
      }
    }

    return updatedChallenges;
  } catch (error) {
    console.error('Error updating challenge progress:', error);
    throw error;
  }
};

/**
 * Awards a badge to a user
 * @param {String} userId - User ID
 * @param {String|Object} badgeId - Badge ID or Badge object
 * @returns {Promise<Object>} - Updated user object
 */
const awardBadge = async (userId, badgeId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const badgeIdString = badgeId._id ? badgeId._id.toString() : badgeId.toString();
    
    // Check if user already has this badge
    const badgeExists = user.badges.some(
      (b) => b.badge.toString() === badgeIdString
    );

    if (!badgeExists) {
      const badge = typeof badgeId === 'object' ? badgeId : await Badge.findById(badgeId);
      
      if (!badge) {
        console.warn(`Badge ${badgeIdString} not found`);
        return user;
      }

      user.badges.push({
        badge: badge._id,
        earnedAt: new Date(),
      });

      // Add points
      const pointsToAdd = badge.points || 10;
      user.totalPoints = (user.totalPoints || 0) + pointsToAdd;

      // Update rank based on total points
      if (user.totalPoints >= 1000) {
        user.rank = 'Diamond';
      } else if (user.totalPoints >= 500) {
        user.rank = 'Platinum';
      } else if (user.totalPoints >= 250) {
        user.rank = 'Gold';
      } else if (user.totalPoints >= 100) {
        user.rank = 'Silver';
      } else {
        user.rank = 'Bronze';
      }

      await user.save();
      console.log(`Badge "${badge.name}" awarded to user ${userId}`);
    }

    return user;
  } catch (error) {
    console.error('Error awarding badge:', error);
    throw error;
  }
};

/**
 * Recalculates challenge progress for a user based on all their workouts
 * @param {String} userId - User ID
 * @param {String} challengeId - Optional challenge ID (if provided, only recalculate that challenge)
 * @returns {Promise<Array>} - Array of updated challenges
 */
const recalculateChallengeProgress = async (userId, challengeId = null) => {
  try {
    const Workout = require('../models/Workout');
    
    // Find challenges
    let challengeQuery = {
      'participants.user': userId,
      isActive: true,
    };
    
    if (challengeId) {
      challengeQuery._id = challengeId;
    }

    const challenges = await Challenge.find(challengeQuery).populate('badgeReward');
    const updatedChallenges = [];

    for (const challenge of challenges) {
      const participant = challenge.participants.find(
        (p) => p.user.toString() === userId.toString()
      );

      if (!participant) {
        continue;
      }

      // Reset progress
      participant.progress = 0;
      participant.completed = false;
      participant.completedAt = null;

      // Find all workouts within challenge period
      const workoutQuery = {
        user: userId,
        date: {
          $gte: challenge.startDate,
          $lte: challenge.endDate,
        },
      };

      const workouts = await Workout.find(workoutQuery);

      // Calculate total progress from all workouts
      let totalProgress = 0;

      for (const workout of workouts) {
        let progressIncrement = 0;

        switch (challenge.type) {
          case 'Workout':
            if (workout.type) {
              progressIncrement = 1;
            }
            break;

          case 'Calorie':
            if (workout.calories) {
              progressIncrement = workout.calories;
            }
            break;

          case 'Distance':
            if (workout.distance && workout.distance > 0) {
              if (challenge.unit === 'km') {
                // Assuming distance is stored in miles, convert to km
                progressIncrement = workout.distance * 1.60934;
              } else if (challenge.unit === 'miles') {
                progressIncrement = workout.distance;
              }
            }
            break;

          case 'Duration':
            if (workout.duration) {
              if (challenge.unit === 'hours') {
                progressIncrement = workout.duration / 60;
              } else if (challenge.unit === 'minutes') {
                progressIncrement = workout.duration;
              }
            }
            break;

          case 'Custom':
            if (workout.type) {
              progressIncrement = 1;
            }
            break;
        }

        totalProgress += progressIncrement;
      }

      participant.progress = totalProgress;

      // Check if completed
      if (participant.progress >= challenge.targetValue && !participant.completed) {
        participant.completed = true;
        participant.completedAt = new Date();

        // Award badge if exists
        if (challenge.badgeReward) {
          await awardBadge(userId, challenge.badgeReward);
        }
      }

      await challenge.save();
      updatedChallenges.push(challenge);
    }

    return updatedChallenges;
  } catch (error) {
    console.error('Error recalculating challenge progress:', error);
    throw error;
  }
};

module.exports = {
  updateChallengeProgress,
  awardBadge,
  recalculateChallengeProgress,
};

