// server/routes/notice.js - NEW FILE
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Notice = require('../models/Notice');
const Admin = require('../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

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

/**
 * POST /api/notice/create
 * Create new notice (Admin only)
 */
router.post('/create', authenticateAdmin, async (req, res) => {
  try {
    const { title, type, contentType, message, pdfData } = req.body;

    if (!title || !type) {
      return res.status(400).json({
        success: false,
        message: 'শিরোনাম এবং ধরন প্রয়োজন'
      });
    }

    const notice = new Notice({
      title,
      type,
      contentType: contentType || 'text',
      message: message || '',
      pdfData: pdfData || '',
      publishedBy: req.admin._id
    });

    await notice.save();

    res.status(201).json({
      success: true,
      message: 'নোটিশ প্রকাশিত হয়েছে',
      notice
    });

  } catch (error) {
    console.error('Create notice error:', error);
    res.status(500).json({
      success: false,
      message: 'নোটিশ প্রকাশ করতে ব্যর্থ হয়েছে'
    });
  }
});

/**
 * GET /api/notice/list
 * Get all notices (Public)
 */
router.get('/list', async (req, res) => {
  try {
    const notices = await Notice.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      notices
    });

  } catch (error) {
    console.error('Get notices error:', error);
    res.status(500).json({
      success: false,
      message: 'নোটিশ লোড করতে ব্যর্থ হয়েছে'
    });
  }
});

/**
 * PUT /api/notice/:id
 * Update notice (Admin only)
 */
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'নোটিশ খুঁজে পাওয়া যায়নি'
      });
    }

    res.json({
      success: true,
      message: 'নোটিশ আপডেট হয়েছে',
      notice
    });

  } catch (error) {
    console.error('Update notice error:', error);
    res.status(500).json({
      success: false,
      message: 'নোটিশ আপডেট করতে ব্যর্থ হয়েছে'
    });
  }
});

/**
 * DELETE /api/notice/:id
 * Delete notice (Admin only)
 */
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'নোটিশ খুঁজে পাওয়া যায়নি'
      });
    }

    res.json({
      success: true,
      message: 'নোটিশ মুছে ফেলা হয়েছে'
    });

  } catch (error) {
    console.error('Delete notice error:', error);
    res.status(500).json({
      success: false,
      message: 'নোটিশ মুছে ফেলতে ব্যর্থ হয়েছে'
    });
  }
});

module.exports = router;

// server/routes/complaint.js - NEW FILE
const Complaint = require('../models/Complaint');
const User = require('../models/User');

// Middleware to verify user token
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

/**
 * POST /api/complaint/create
 * Submit complaint (User)
 */
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

/**
 * GET /api/complaint/my
 * Get user's complaints
 */
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

/**
 * GET /api/complaint/all (Admin)
 * Get all complaints
 */
router.get('/all', authenticateAdmin, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('userId', 'nid')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      complaints
    });

  } catch (error) {
    console.error('Get all complaints error:', error);
    res.status(500).json({
      success: false,
      message: 'অভিযোগ লোড করতে ব্যর্থ হয়েছে'
    });
  }
});

/**
 * PUT /api/complaint/:id/reply (Admin)
 * Reply to complaint
 */
router.put('/:id/reply', authenticateAdmin, async (req, res) => {
  try {
    const { adminReply, status } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { 
        adminReply,
        status: status || 'resolved'
      },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'অভিযোগ খুঁজে পাওয়া যায়নি'
      });
    }

    res.json({
      success: true,
      message: 'উত্তর প্রদান করা হয়েছে',
      complaint
    });

  } catch (error) {
    console.error('Reply complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'উত্তর প্রদান করতে ব্যর্থ হয়েছে'
    });
  }
});

module.exports = router;