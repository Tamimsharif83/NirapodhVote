// server/routes/ballot.js - NEW FILE
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Ballot = require('../models/Ballot');
const Candidate = require('../models/Candidate');
const Admin = require('../models/Admin');
const User = require('../models/User');
const CitizenMaster = require('../models/CitizenMaster');

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
 * POST /api/ballot/create
 * Create new ballot (Admin only)
 */
router.post('/create', authenticateAdmin, async (req, res) => {
  try {
    const { 
      ballotName, 
      ballotLocation, 
      startDate, 
      endDate, 
      candidates 
    } = req.body;

    if (!ballotName || !ballotLocation || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'সকল প্রয়োজনীয় তথ্য প্রদান করুন'
      });
    }

    // Determine status based on dates
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    let status = 'upcoming';
    if (now >= start && now <= end) {
      status = 'active';
    } else if (now > end) {
      status = 'completed';
    }

    const ballot = new Ballot({
      ballotName,
      ballotLocation,
      startDate: start,
      endDate: end,
      status,
      candidates: candidates || [],
      createdBy: req.admin._id
    });

    await ballot.save();

    res.status(201).json({
      success: true,
      message: 'ব্যালট সফলভাবে তৈরি হয়েছে',
      ballot
    });

  } catch (error) {
    console.error('Create ballot error:', error);
    res.status(500).json({
      success: false,
      message: 'ব্যালট তৈরি করতে ব্যর্থ হয়েছে'
    });
  }
});

/**
 * GET /api/ballot/list
 * Get all ballots for citizen's area
 */
router.get('/list', authenticateUser, async (req, res) => {
  try {
    // Get citizen's voting area
    const citizen = await CitizenMaster.findOne({ nid: req.user.nid });
    
    if (!citizen) {
      return res.status(404).json({
        success: false,
        message: 'নাগরিক তথ্য পাওয়া যায়নি'
      });
    }

    // Find ballots for this area
    const ballots = await Ballot.find({ 
      ballotLocation: citizen.votingArea 
    }).sort({ startDate: -1 });

    res.json({
      success: true,
      ballots,
      userArea: citizen.votingArea
    });

  } catch (error) {
    console.error('Get ballots error:', error);
    res.status(500).json({
      success: false,
      message: 'ব্যালট লোড করতে ব্যর্থ হয়েছে'
    });
  }
});

/**
 * GET /api/ballot/all (Admin)
 * Get all ballots
 */
router.get('/all', authenticateAdmin, async (req, res) => {
  try {
    const ballots = await Ballot.find()
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      ballots
    });

  } catch (error) {
    console.error('Get all ballots error:', error);
    res.status(500).json({
      success: false,
      message: 'ব্যালট লোড করতে ব্যর্থ হয়েছে'
    });
  }
});

/**
 * PUT /api/ballot/:id
 * Update ballot (Admin only)
 */
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const ballot = await Ballot.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!ballot) {
      return res.status(404).json({
        success: false,
        message: 'ব্যালট খুঁজে পাওয়া যায়নি'
      });
    }

    res.json({
      success: true,
      message: 'ব্যালট আপডেট হয়েছে',
      ballot
    });

  } catch (error) {
    console.error('Update ballot error:', error);
    res.status(500).json({
      success: false,
      message: 'ব্যালট আপডেট করতে ব্যর্থ হয়েছে'
    });
  }
});

/**
 * DELETE /api/ballot/:id
 * Delete ballot (Admin only)
 */
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const ballot = await Ballot.findByIdAndDelete(req.params.id);

    if (!ballot) {
      return res.status(404).json({
        success: false,
        message: 'ব্যালট খুঁজে পাওয়া যায়নি'
      });
    }

    res.json({
      success: true,
      message: 'ব্যালট মুছে ফেলা হয়েছে'
    });

  } catch (error) {
    console.error('Delete ballot error:', error);
    res.status(500).json({
      success: false,
      message: 'ব্যালট মুছে ফেলতে ব্যর্থ হয়েছে'
    });
  }
});

/**
 * POST /api/ballot/:id/add-candidate
 * Add candidate to ballot (Admin only)
 */
router.post('/:id/add-candidate', authenticateAdmin, async (req, res) => {
  try {
    const { candidateId } = req.body;

    const ballot = await Ballot.findById(req.params.id);
    if (!ballot) {
      return res.status(404).json({
        success: false,
        message: 'ব্যালট খুঁজে পাওয়া যায়নি'
      });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'প্রার্থী খুঁজে পাওয়া যায়নি'
      });
    }

    // Check if candidate already exists in ballot
    const exists = ballot.candidates.some(
      c => c.candidateId.toString() === candidateId
    );

    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'প্রার্থী ইতিমধ্যে ব্যালটে রয়েছে'
      });
    }

    ballot.candidates.push({
      candidateId: candidate._id,
      name: candidate.name,
      party: candidate.party,
      photo: candidate.photo,
      symbol: candidate.symbol
    });

    await ballot.save();

    res.json({
      success: true,
      message: 'প্রার্থী যোগ করা হয়েছে',
      ballot
    });

  } catch (error) {
    console.error('Add candidate error:', error);
    res.status(500).json({
      success: false,
      message: 'প্রার্থী যোগ করতে ব্যর্থ হয়েছে'
    });
  }
});

module.exports = router;