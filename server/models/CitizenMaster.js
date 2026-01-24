// server/models/CitizenMaster.js
const mongoose = require('mongoose');

const citizenMasterSchema = new mongoose.Schema({
  nid: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  fatherName: {
    type: String,
    required: true,
    trim: true
  },
  motherName: {
    type: String,
    required: true,
    trim: true
  },
  dob: {
    type: Date,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true
  },
  votingArea: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  isRegistered: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
citizenMasterSchema.index({ nid: 1, dob: 1 });

module.exports = mongoose.model('CitizenMaster', citizenMasterSchema);