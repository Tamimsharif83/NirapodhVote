// Vote Model
const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  candidate: {
    type: String,
    required: true,
    enum: ['candidate-a', 'candidate-b', 'candidate-c', 'candidate-d']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nid: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String
  }
});

// Index to ensure one vote per user
voteSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
