const Badge = require('../models/Badge');
const User = require('../models/User');

const getBadges = async (req, res) => {
  try {
    const { category, rarity } = req.query;
    let query = {};

    if (category) query.category = category;
    if (rarity) query.rarity = rarity;

    const badges = await Badge.find(query).sort({ points: -1 });
    res.json(badges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyBadges = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('badges.badge');
    res.json({
      badges: user.badges,
      rank: user.rank,
      totalPoints: user.totalPoints,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const awardBadge = async (req, res) => {
  try {
    const { userId, badgeId } = req.body;
    const user = await User.findById(userId || req.user._id);
    const badge = await Badge.findById(badgeId);

    if (!user || !badge) {
      return res.status(404).json({ message: 'User or badge not found' });
    }

    const badgeExists = user.badges.some(
      (b) => b.badge.toString() === badgeId
    );

    if (badgeExists) {
      return res.status(400).json({ message: 'User already has this badge' });
    }

    user.badges.push({
      badge: badgeId,
      earnedAt: new Date(),
    });
    user.totalPoints += badge.points || 10;

    if (user.totalPoints >= 1000) user.rank = 'Diamond';
    else if (user.totalPoints >= 500) user.rank = 'Platinum';
    else if (user.totalPoints >= 250) user.rank = 'Gold';
    else if (user.totalPoints >= 100) user.rank = 'Silver';

    await user.save();
    res.json({ message: 'Badge awarded', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBadges,
  getMyBadges,
  awardBadge,
};

