// server/models/Candidate.js
const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  party: {
    type: String,
    required: true,
    trim: true
  },
  photo: {
    type: String, // Base64 or URL
    default: ''
  },
  symbol: {
    type: String, // Base64 or URL
    default: ''
  },
  area: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    default: ''
  },
  manifesto: [{
    type: String
  }],
  socialActivities: [{
    type: String
  }],
  partyHistory: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  phone: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for area-based queries
candidateSchema.index({ area: 1, status: 1 });

module.exports = mongoose.model('Candidate', candidateSchema);