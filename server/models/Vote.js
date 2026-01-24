const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const voteSchema = new mongoose.Schema({
  ballotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ballot',
    required: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  voterNid: {
    type: String,
    required: true
  },
  votedAt: {
    type: Date,
    default: Date.now
  },
  ipAddress: String
});

// One vote per citizen per ballot
voteSchema.index(
  { ballotId: 1, voterNid: 1 },
  { unique: true }
);
