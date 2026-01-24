// server/models/OTPVerification.js
const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  nid: {
    type: String,
    required: true,
    index: true
  },
  otp: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // TTL index - auto delete when expired
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('OTPVerification', otpSchema);
