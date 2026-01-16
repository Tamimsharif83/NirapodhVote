// Authentication Routes
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const PreregisteredCitizen = require('../models/PreregisteredCitizen');
const OTP = require('../models/OTP');
const { normalizeBDPhone, generateOTP, getOTPExpiry } = require('../utils/helpers');
const { getFirebaseConfig, validateFirebaseConfig } = require('../services/firebaseService');

// JWT Secret (in production, use a strong secret from .env)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Get Firebase Config for frontend
router.get('/firebase-config', (req, res) => {
  try {
    console.log('🔥 Firebase config requested from client');
    
    if (!validateFirebaseConfig()) {
      return res.status(500).json({
        success: false,
        message: 'Firebase configuration is incomplete'
      });
    }
    
    res.json({
      success: true,
      config: getFirebaseConfig(),
      useFirebase: process.env.USE_FIREBASE_OTP === 'true'
    });
  } catch (error) {
    console.error('❌ Error providing Firebase config:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get Firebase configuration'
    });
  }
});

// Step 1: Check NID and Phone, Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { nid, phoneNumber } = req.body;

    // Validation
    if (!nid || !phoneNumber) {
      return res.status(400).json({ 
        success: false, 
        message: 'NID এবং ফোন নম্বর প্রদান করুন' 
      });
    }

    // Normalize phone number
    const normalizedPhone = normalizeBDPhone(phoneNumber);
    if (!normalizedPhone) {
      return res.status(400).json({ 
        success: false, 
        message: 'অবৈধ ফোন নম্বর। বাংলাদেশি ফোন নম্বর ব্যবহার করুন (যেমন: 01788504010)' 
      });
    }

    // Check if NID and phone match in preregistered citizens
    const preregistered = await PreregisteredCitizen.findOne({ nid });
    
    if (!preregistered) {
      return res.status(404).json({ 
        success: false, 
        message: 'এই NID পূর্ব-নিবন্ধিত নাগরিক তালিকায় নেই' 
      });
    }

    // Check if already registered
    if (preregistered.hasRegistered) {
      return res.status(400).json({ 
        success: false, 
        message: 'এই NID ইতিমধ্যে নিবন্ধিত হয়েছে' 
      });
    }

    // Normalize stored phone number for comparison
    const normalizedStoredPhone = normalizeBDPhone(preregistered.mobileNumber);
    
    if (normalizedPhone !== normalizedStoredPhone) {
      return res.status(400).json({ 
        success: false, 
        message: 'ফোন নম্বর মিলছে না। পূর্ব-নিবন্ধিত ফোন নম্বর ব্যবহার করুন' 
      });
    }

    // Generate OTP
    const otpCode = generateOTP();
    const expiresAt = getOTPExpiry(process.env.OTP_EXPIRY_MINUTES || 2);

    // Delete any existing OTP for this NID
    await OTP.deleteMany({ nid });

    // Save OTP to database
    const otpRecord = new OTP({
      nid,
      phoneNumber: normalizedPhone,
      otp: otpCode,
      expiresAt
    });
    await otpRecord.save();

    // Log OTP for development/testing (since we don't have SMS service)
    console.log('📱 OTP Generated for testing:', otpCode);
    console.log('📱 For NID:', nid);

    res.json({
      success: true,
      message: 'OTP আপনার ফোনে পাঠানো হয়েছে',
      data: {
        nid,
        phoneNumber: normalizedPhone,
        expiresIn: process.env.OTP_EXPIRY_MINUTES || 2,
        // Show OTP in response for testing (remove in production with real SMS service)
        devOtp: otpCode
      }
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'OTP পাঠাতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন' 
    });
  }
});

// Step 2: Verify OTP and Register User
router.post('/verify-otp-register', async (req, res) => {
  try {
    const { nid, otp, password, presentAddress } = req.body;

    // Validation
    if (!nid || !otp || !password || !presentAddress) {
      return res.status(400).json({ 
        success: false, 
        message: 'সকল তথ্য প্রদান করুন' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' 
      });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({ nid, otp, verified: false });
    
    if (!otpRecord) {
      return res.status(400).json({ 
        success: false, 
        message: 'অবৈধ অথবা মেয়াদোত্তীর্ণ OTP' 
      });
    }

    // Check if OTP has expired
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ 
        success: false, 
        message: 'OTP মেয়াদোত্তীর্ণ হয়েছে। নতুন OTP পাঠান' 
      });
    }

    // Get preregistered citizen data
    const preregistered = await PreregisteredCitizen.findOne({ nid });
    
    if (!preregistered) {
      return res.status(404).json({ 
        success: false, 
        message: 'পূর্ব-নিবন্ধিত নাগরিক তথ্য পাওয়া যায়নি' 
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

    // Create new user with preregistered data
    const user = new User({
      nid: preregistered.nid,
      password,
      name: preregistered.name,
      dob: preregistered.dob,
      fatherName: preregistered.fatherName,
      motherName: preregistered.motherName,
      permanentAddress: preregistered.permanentAddress,
      presentAddress
    });

    await user.save();

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // Update preregistered citizen record
    preregistered.hasRegistered = true;
    preregistered.userId = user._id;
    await preregistered.save();

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
