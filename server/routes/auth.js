// Authentication Routes
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT Secret (in production, use a strong secret from .env)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { nid, password, name, dob, fatherName, motherName, permanentAddress, presentAddress } = req.body;

    // Validation
    if (!nid || !password || !name || !dob || !fatherName || !motherName || !permanentAddress || !presentAddress) {
      return res.status(400).json({ 
        success: false, 
        message: 'সকল তথ্য প্রদান করুন' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ nid });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'এই NID ইতিমধ্যে নিবন্ধিত আছে' 
      });
    }

    // Create new user
    const user = new User({
      nid,
      password,
      name,
      dob,
      fatherName,
      motherName,
      permanentAddress,
      presentAddress
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id, nid: user.nid }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'রেজিস্ট্রেশন সফল হয়েছে',
      token,
      user: {
        id: user._id,
        nid: user.nid,
        name: user.name,
        hasVoted: user.hasVoted
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'রেজিস্ট্রেশন ব্যর্থ হয়েছে' 
    });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { nid, password } = req.body;

    // Validation
    if (!nid || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'NID এবং পাসওয়ার্ড প্রদান করুন' 
      });
    }

    // Find user
    const user = await User.findOne({ nid });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'ভুল NID অথবা পাসওয়ার্ড' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'ভুল NID অথবা পাসওয়ার্ড' 
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, nid: user.nid }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'লগইন সফল হয়েছে',
      token,
      user: {
        id: user._id,
        nid: user.nid,
        name: user.name,
        hasVoted: user.hasVoted
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'লগইন ব্যর্থ হয়েছে' 
    });
  }
});

// Get User Info (Protected)
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'অনুমোদন প্রয়োজন' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'ব্যবহারকারী খুঁজে পাওয়া যায়নি' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        nid: user.nid,
        name: user.name,
        hasVoted: user.hasVoted,
        votedAt: user.votedAt
      }
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ success: false, message: 'অবৈধ টোকেন' });
  }
});

module.exports = router;
