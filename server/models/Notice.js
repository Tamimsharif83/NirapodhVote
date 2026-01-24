// server/models/Notice.js
const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['general', 'urgent', 'schedule', 'result'],
    required: true
  },
  contentType: {
    type: String,
    enum: ['text', 'pdf'],
    default: 'text'
  },
  message: {
    type: String,
    default: ''
  },
  pdfData: {
    type: String, // Base64 encoded PDF
    default: ''
  },
  pdfUrl: {
    type: String,
    default: ''
  },
  publishedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true
});

// Index for sorting by date
noticeSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notice', noticeSchema);


