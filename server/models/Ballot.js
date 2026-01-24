// server/models/Ballot.js
const mongoose = require('mongoose');

const ballotSchema = new mongoose.Schema({
  ballotName: {
    type: String,
    required: true,
    trim: true
  },
  ballotLocation: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed'],
    default: 'upcoming'
  },
  candidates: [{
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate'
    },
    name: String,
    party: String,
    photo: String,
    symbol: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true
});

// Index for filtering by location and status
ballotSchema.index({ ballotLocation: 1, status: 1 });

module.exports = mongoose.model('Ballot', ballotSchema);

