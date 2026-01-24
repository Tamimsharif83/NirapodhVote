
// server/models/ChatMessage.js
const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  message: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    enum: ['user', 'admin'],
    required: true
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for conversation queries
chatMessageSchema.index({ userId: 1, createdAt: 1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);