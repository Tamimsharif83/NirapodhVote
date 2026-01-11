// Voting Routes
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Vote = require('../models/Vote');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'অনুমোদন প্রয়োজন' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(404).json({ success: false, message: 'ব্যবহারকারী খুঁজে পাওয়া যায়নি' });
    }
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'অবৈধ টোকেন' });
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

module.exports = router;
