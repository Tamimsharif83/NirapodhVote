// server/routes/auth.js - COMPLETE UPDATED VERSION
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const CitizenMaster = require('../models/CitizenMaster');
const OTPVerification = require('../models/OTPVerification');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Helper function to generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper function to send SMS (integrate with SMS gateway)
async function sendSMS(mobileNumber, message) {
  // TODO: Integrate with actual SMS gateway (e.g., Twilio, SSL Wireless)
  console.log(`📱 SMS to ${mobileNumber}: ${message}`);
  
  // For development, just log the OTP
  // In production, use actual SMS API
  return true;
}

/**
 * POST /api/auth/precheck
 * Check if NID and DOB match in CitizenMaster
 */
router.post('/precheck', async (req, res) => {
  try {
    const { nid, dob } = req.body;

    if (!nid || !dob) {
      return res.status(400).json({ 
        success: false, 
        message: 'NID এবং DOB প্রয়োজন' 
      });
    }

    // Parse DOB
    const [year, month, day] = dob.split('-');
    const citizenDob = new Date(Date.UTC(year, month - 1, day));

    // Find citizen in master database
    const citizen = await CitizenMaster.findOne({
      nid,
      dob: citizenDob
    });

    if (!citizen) {
      return res.status(404).json({ 
        success: false, 
        message: 'তথ্য পাওয়া যায়নি। NID বা জন্ম তারিখ সঠিক নয়।' 
      });
    }

    // Check if already registered
    if (citizen.isRegistered) {
      return res.status(400).json({ 
        success: false, 
        message: 'এই NID ইতিমধ্যে নিবন্ধিত। অনুগ্রহ করে লগইন করুন।' 
      });
    }

    res.json({
      success: true,
      citizen: {
        nid: citizen.nid,
        name: citizen.name,
        fatherName: citizen.fatherName,
        motherName: citizen.motherName,
        mobile: citizen.mobileNumber,
        presentAddress: citizen.votingArea
      }
    });

  } catch (err) {
    console.error('Precheck error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'ডেটা আনতে সমস্যা হয়েছে' 
    });
  }
});

/**
 * POST /api/auth/send-otp
 * Generate and send OTP to mobile number
 */
router.post('/send-otp', async (req, res) => {
  try {
    const { nid } = req.body;

    if (!nid) {
      return res.status(400).json({ 
        success: false, 
        message: 'NID প্রয়োজন' 
      });
    }

    // Find citizen
    const citizen = await CitizenMaster.findOne({ nid });
    
    if (!citizen) {
      return res.status(404).json({ 
        success: false, 
        message: 'নাগরিক খুঁজে পাওয়া যায়নি' 
      });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Delete any existing OTP for this NID
    await OTPVerification.deleteMany({ nid });

    // Create new OTP record (expires in 10 minutes)
    const expiresAt = new Date(Date.now() + 50 * 1000);
    await OTPVerification.create({
      nid,
      otp,
      mobileNumber: citizen.mobileNumber,
      expiresAt
    });

    // Send SMS
    const smsMessage = `নিরাপদ ভোট: আপনার OTP কোড ${otp}। এটি ১০ মিনিটের জন্য বৈধ।`;
    await sendSMS(citizen.mobileNumber, smsMessage);

    res.json({
      success: true,
      message: 'OTP পাঠানো হয়েছে',
      mobile: citizen.mobileNumber.replace(/(\d{3})\d{5}(\d{3})/, '$1*****$2'), // Masked number
      otpExpiresIn: 50
    });

  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'OTP পাঠাতে ব্যর্থ হয়েছে' 
    });
  }
});

/**
 * POST /api/auth/verify-otp
 * Verify OTP code
 */
router.post('/verify-otp', async (req, res) => {
  try {
    const { nid, otp } = req.body;

    if (!nid || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'NID এবং OTP প্রয়োজন' 
      });
    }

    // Find OTP record
    const otpRecord = await OTPVerification.findOne({ 
      nid, 
      otp,
      verified: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({ 
        success: false, 
        message: 'OTP ভুল বা মেয়াদ উত্তীর্ণ হয়েছে' 
      });
    }

    // Mark as verified
    otpRecord.verified = true;
    await otpRecord.save();

    res.json({
      success: true,
      message: 'OTP যাচাই সফল হয়েছে'
    });

  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'OTP যাচাই করতে ব্যর্থ হয়েছে' 
    });
  }
});

/**
 * POST /api/auth/register
 * Register new user (after OTP verification)
 */
router.post('/register', async (req, res) => {
  try {
    const { 
      nid, 
      password, 
      dob, 
      name, 
      fatherName, 
      motherName, 
      mobile, 
      permanentAddress, 
      presentAddress 
    } = req.body;

    // Validate all required fields
    if (!nid || !password || !dob || !name || !fatherName || !motherName || !mobile || !permanentAddress || !presentAddress) {
      return res.status(400).json({ 
        success: false,
        message: 'সকল তথ্য পূরণ করুন। All fields are required.' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ nid });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'এই NID দিয়ে ইতিমধ্যে একাউন্ট আছে। User already exists.' 
      });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Delete any existing OTP for this NID
    await OTPVerification.deleteMany({ nid });

    // Create new OTP record (expires in 10 minutes)
    const expiresAt = new Date(Date.now() + 50 * 1000);
    await OTPVerification.create({
      nid,
      otp,
      mobileNumber: mobile,
      expiresAt
    });

    // Send OTP via SMS
    await sendSMS(mobile, `নিরাপদ ভোট: আপনার OTP কোড ${otp}। এটি ১০ মিনিটের জন্য বৈধ।`);

    // Create new user (unverified)
    const newUser = new User({
      nid,
      password,
      dob,
      name,
      fatherName,
      motherName,
      mobile,
      permanentAddress,
      presentAddress,
      isVerified: false
    });

    await newUser.save();

    res.status(200).json({ 
      success: true,
      message: 'OTP পাঠানো হয়েছে। OTP sent to your mobile number.',
      requiresOTP: true,
      otpExpiresIn: 50
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'রেজিস্ট্রেশন ব্যর্থ। Registration failed.' 
    });
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', async (req, res) => {
  try {
    const { nid, password } = req.body;

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

    // Get citizen details
    const citizen = await CitizenMaster.findOne({ nid });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, nid: user.nid }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'লগইন সফল হয়েছে',
      token,
      user: {
        nid: user.nid,
        name: citizen?.name || 'নাগরিক',
        area: citizen?.votingArea || '',
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

/**
 * GET /api/auth/me
 * Get current user info
 */
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'অনুমোদন প্রয়োজন' 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'ব্যবহারকারী খুঁজে পাওয়া যায়নি' 
      });
    }

    const citizen = await CitizenMaster.findOne({ nid: user.nid });

    res.json({
      success: true,
      user: {
        nid: user.nid,
        name: citizen?.name || user.name,
        fatherName: user.fatherName,
        motherName: user.motherName,
        mobile: user.mobile,
        area: citizen?.votingArea || '',
        hasVoted: user.hasVoted,
        votedAt: user.votedAt,
        votedCandidate: user.votedCandidate
      }
    });

  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'অবৈধ টোকেন' 
    });
  }
});

module.exports = router;