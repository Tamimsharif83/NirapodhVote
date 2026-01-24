// server/routes/complaint.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Admin = require('../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const authenticateUser = async (req, res, next) => {
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

router.post('/create', authenticateUser, async (req, res) => {
  try {
    const { text, anonymous } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'অভিযোগের বিবরণ প্রয়োজন'
      });
    }

    const complaint = new Complaint({
      userId: req.user._id,
      text,
      anonymous: anonymous || false
    });

    await complaint.save();

    res.status(201).json({
      success: true,
      message: 'অভিযোগ সফলভাবে জমা দেওয়া হয়েছে',
      complaint
    });

  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'অভিযোগ জমা দিতে ব্যর্থ হয়েছে'
    });
  }
});

router.get('/my', authenticateUser, async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      complaints
    });

  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({
      success: false,
      message: 'অভিযোগ লোড করতে ব্যর্থ হয়েছে'
    });
  }
});

module.exports = router;