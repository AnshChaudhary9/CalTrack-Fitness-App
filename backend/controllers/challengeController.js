const Challenge = require('../models/Challenge');
const User = require('../models/User');
const Badge = require('../models/Badge');
const { recalculateChallengeProgress, awardBadge } = require('../utils/updateChallengeProgress');

const getChallenges = async (req, res) => {
  try {
    const { difficulty, type, isActive } = req.query;
    let query = {};

    if (difficulty) query.difficulty = difficulty;
    if (type) query.type = type;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const challenges = await Challenge.find(query)
      .populate('badgeReward', 'name icon description')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .populate('badgeReward', 'name icon description points')
      .populate('createdBy', 'name')
      .populate('participants.user', 'name profilePicture rank');

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    res.json(challenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.create({
      ...req.body,
      createdBy: req.user._id,
    });

    const populatedChallenge = await Challenge.findById(challenge._id)
      .populate('badgeReward', 'name icon description')
      .populate('createdBy', 'name');

    res.status(201).json(populatedChallenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const joinChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const existingParticipant = challenge.participants.find(
      (p) => p.user.toString() === req.user._id.toString()
    );

    if (existingParticipant) {
      return res.status(400).json({ message: 'Already joined this challenge' });
    }

    challenge.participants.push({
      user: req.user._id,
      progress: 0,
      completed: false,
    });

    await challenge.save();
    res.json({ message: 'Successfully joined challenge', challenge });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const participant = challenge.participants.find(
      (p) => p.user.toString() === req.user._id.toString()
    );

    if (!participant) {
      return res.status(400).json({ message: 'Not joined this challenge' });
    }

    participant.progress = progress;

    if (progress >= challenge.targetValue && !participant.completed) {
      participant.completed = true;
      participant.completedAt = new Date();

      if (challenge.badgeReward) {
        await awardBadge(req.user._id, challenge.badgeReward);
      }
    }

    await challenge.save();
    res.json({ message: 'Progress updated', challenge });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({
      'participants.user': req.user._id,
    })
      .populate('badgeReward', 'name icon description')
      .sort({ createdAt: -1 });

    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const recalculateProgress = async (req, res) => {
  try {
    const challengeId = req.params.id;
    const updatedChallenges = await recalculateChallengeProgress(req.user._id, challengeId);
    
    if (updatedChallenges.length === 0) {
      return res.status(404).json({ message: 'Challenge not found or not joined' });
    }
    
    res.json({ 
      message: 'Challenge progress recalculated',
      challenge: updatedChallenges[0]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const recalculateAllProgress = async (req, res) => {
  try {
    const updatedChallenges = await recalculateChallengeProgress(req.user._id);
    
    res.json({ 
      message: 'All challenge progress recalculated',
      updatedCount: updatedChallenges.length,
      challenges: updatedChallenges
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAllChallenges = async (req, res) => {
  try {
    const result = await Challenge.deleteMany({});
    res.json({ 
      message: `Successfully deleted ${result.deletedCount} challenge(s)`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getChallenges,
  getChallenge,
  createChallenge,
  joinChallenge,
  updateProgress,
  getMyChallenges,
  recalculateProgress,
  recalculateAllProgress,
  deleteAllChallenges,
};

