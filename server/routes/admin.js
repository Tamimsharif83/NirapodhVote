// Admin Routes
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Vote = require('../models/Vote');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'ইউজারনেম এবং পাসওয়ার্ড প্রদান করুন' 
      });
    }

    // Find admin
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: 'ভুল ইউজারনেম অথবা পাসওয়ার্ড' 
      });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'ভুল ইউজারনেম অথবা পাসওয়ার্ড' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'লগইন সফল হয়েছে',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'লগইন ব্যর্থ হয়েছে' 
    });
  }
});

// Middleware to verify admin token
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'অনুমোদন প্রয়োজন' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = await Admin.findById(decoded.id);
    if (!req.admin) {
      return res.status(403).json({ success: false, message: 'অ্যাক্সেস অস্বীকৃত' });
    }
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'অবৈধ টোকেন' });
  }
};

// Get Dashboard Statistics
router.get('/statistics', authenticateAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVotes = await Vote.countDocuments();
    const votersWhoVoted = await User.countDocuments({ hasVoted: true });
    
    const candidateAVotes = await Vote.countDocuments({ candidate: 'candidate-a' });
    const candidateBVotes = await Vote.countDocuments({ candidate: 'candidate-b' });
    const candidateCVotes = await Vote.countDocuments({ candidate: 'candidate-c' });
    const candidateDVotes = await Vote.countDocuments({ candidate: 'candidate-d' });

    res.json({
      success: true,
      statistics: {
        totalUsers,
        totalVotes,
        votersWhoVoted,
        pendingVoters: totalUsers - votersWhoVoted,
        turnoutPercentage: totalUsers > 0 ? ((votersWhoVoted / totalUsers) * 100).toFixed(2) : 0,
        candidates: {
          candidateA: candidateAVotes,
          candidateB: candidateBVotes,
          candidateC: candidateCVotes,
          candidateD: candidateDVotes
        }
      }
    });
  } catch (error) {
    console.error('Admin statistics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'পরিসংখ্যান লোড করতে ব্যর্থ হয়েছে' 
    });
  }
});

// Get All Users
router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'ব্যবহারকারী লোড করতে ব্যর্থ হয়েছে' 
    });
  }
});

// Get All Votes
router.get('/votes', authenticateAdmin, async (req, res) => {
  try {
    const votes = await Vote.find()
      .populate('userId', 'name nid')
      .sort({ timestamp: -1 });
    
    res.json({
      success: true,
      votes
    });
  } catch (error) {
    console.error('Get votes error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'ভোট লোড করতে ব্যর্থ হয়েছে' 
    });
  }
});

// Create Initial Admin (Only for first setup)
router.post('/create-initial-admin', async (req, res) => {
  try {
    // Check if any admin exists
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return res.status(400).json({ 
        success: false, 
        message: 'অ্যাডমিন ইতিমধ্যে বিদ্যমান' 
      });
    }

    const admin = new Admin({
      username: 'admin',
      password: 'admin123',
      role: 'superadmin'
    });

    await admin.save();

    res.json({
      success: true,
      message: 'প্রাথমিক অ্যাডমিন তৈরি হয়েছে',
      credentials: {
        username: 'admin',
        password: 'admin123'
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'অ্যাডমিন তৈরি করতে ব্যর্থ হয়েছে' 
    });
  }
});

module.exports = router;
