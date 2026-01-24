// Voting Routes
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Vote = require('../models/Vote');
const Ballot = require('../models/Ballot');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'অনুমোদন প্রয়োজন' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'অবৈধ টোকেন' });
  }
};

// Cast Vote
router.post('/cast', authenticateToken, async (req, res) => {
  try {
    const { candidate } = req.body;

    // Validation
    if (!candidate) {
      return res.status(400).json({ 
        success: false, 
        message: 'প্রার্থী নির্বাচন করুন' 
      });
    }

    // Check if user has already voted
    if (req.user.hasVoted) {
      return res.status(400).json({ 
        success: false, 
        message: 'আপনি ইতিমধ্যে ভোট দিয়েছেন' 
      });
    }

    // Check if vote already exists (double check)
    const existingVote = await Vote.findOne({ userId: req.user._id });
    if (existingVote) {
      return res.status(400).json({ 
        success: false, 
        message: 'আপনি ইতিমধ্যে ভোট দিয়েছেন' 
      });
    }

    // Create vote
    const vote = new Vote({
      candidate,
      userId: req.user._id,
      nid: req.user.nid,
      ipAddress: req.ip
    });

    await vote.save();

    // Update user
    req.user.hasVoted = true;
    req.user.votedAt = new Date();
    req.user.votedCandidate = candidate;
    await req.user.save();

    res.json({
      success: true,
      message: 'ভোট সফলভাবে সম্পন্ন হয়েছে',
      votedAt: req.user.votedAt
    });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'ভোট দিতে ব্যর্থ হয়েছে' 
    });
  }
});

// Check Vote Status
router.get('/status', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      hasVoted: req.user.hasVoted,
      votedAt: req.user.votedAt
    });
  } catch (error) {
    console.error('Status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'স্ট্যাটাস চেক করতে ব্যর্থ হয়েছে' 
    });
  }
});

// Get Vote Statistics (Public)
router.get('/statistics', async (req, res) => {
  try {
    const totalVotes = await Vote.countDocuments();
    const candidateAVotes = await Vote.countDocuments({ candidate: 'candidate-a' });
    const candidateBVotes = await Vote.countDocuments({ candidate: 'candidate-b' });
    const candidateCVotes = await Vote.countDocuments({ candidate: 'candidate-c' });
    const candidateDVotes = await Vote.countDocuments({ candidate: 'candidate-d' });

    res.json({
      success: true,
      statistics: {
        total: totalVotes,
        candidateA: candidateAVotes,
        candidateB: candidateBVotes,
        candidateC: candidateCVotes,
        candidateD: candidateDVotes
      }
    });
  } catch (error) {
    console.error('Statistics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'পরিসংখ্যান লোড করতে ব্যর্থ হয়েছে' 
    });
  }
});

/**
 * GET /api/voting/ballots
 * Get all active ballots for user's area
 */
router.get('/ballots', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'ব্যবহারকারী খুঁজে পাওয়া যায়নি' });
    }

    // Get ballots (for now, return mock data - you can create Ballot model later)
    const ballots = [
      {
        id: 1,
        title: 'জাতীয় সংসদ নির্বাচন ২০২৫',
        status: 'active',
        startTime: '2025-01-05T08:00:00',
        endTime: '2025-01-05T16:00:00',
        hasVoted: user.hasVoted,
        votedAt: user.votedAt,
        candidates: [
          {
            id: 1,
            name: 'মোঃ আবদুল্লাহ',
            party: 'জাতীয় নাগরিক পার্টি',
            photo: 'assets/images/Tamim.jpeg',
            symbol: 'assets/images/bodna.jpg'
          },
          {
            id: 2,
            name: 'সালমা খাতুন',
            party: 'জনকল্যাণ পার্টি',
            photo: 'assets/images/Saima_apu.jpeg',
            symbol: 'assets/images/honey-bee.jpg'
          },
          {
            id: 3,
            name: 'রহিম উদ্দিন',
            party: 'স্বাধীন প্রার্থী',
            photo: 'assets/images/Taz.jpg',
            symbol: 'assets/images/ant.jpg'
          }
        ]
      }
    ];

    res.json({ success: true, ballots });
  } catch (error) {
    console.error('Ballots fetch error:', error);
    res.status(500).json({ success: false, message: 'ব্যালট তথ্য আনতে ব্যর্থ' });
  }
});

/**
 * POST /api/voting/vote
 * Submit a vote
 */
router.post('/vote', authenticateToken, async (req, res) => {
  try {
    const { ballotId, candidateId } = req.body;

    if (!ballotId || !candidateId) {
      return res.status(400).json({ success: false, message: 'সকল তথ্য প্রয়োজন' });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'ব্যবহারকারী খুঁজে পাওয়া যায়নি' });
    }

    if (user.hasVoted) {
      return res.status(400).json({ success: false, message: 'আপনি ইতিমধ্যে ভোট প্রদান করেছেন' });
    }

    // Update user with vote
    user.hasVoted = true;
    user.votedCandidate = candidateId;
    user.votedAt = new Date();
    await user.save();

    res.json({ 
      success: true, 
      message: 'আপনার ভোট সফলভাবে প্রদান করা হয়েছে',
      votedAt: user.votedAt
    });

  } catch (error) {
    console.error('Vote submission error:', error);
    res.status(500).json({ success: false, message: 'ভোট প্রদান ব্যর্থ হয়েছে' });
  }
});

module.exports = router;
