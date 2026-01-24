// server/models/Complaint.js
const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  text: {
    type: String,
    required: true
  },
  anonymous: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'resolved', 'rejected'],
    default: 'pending'
  },
  adminReply: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for filtering by status
complaintSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Complaint', complaintSchema);
