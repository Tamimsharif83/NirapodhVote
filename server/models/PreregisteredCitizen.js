// PreregisteredCitizen Model
const mongoose = require('mongoose');

const preregisteredCitizenSchema = new mongoose.Schema({
  nid: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true
  },
  votingArea: {
    type: String,
    required: true
  },
  dob: {
    type: String,
    required: true
  },
  fatherName: {
    type: String,
    required: true
  },
  motherName: {
    type: String,
    required: true
  },
  permanentAddress: {
    type: String,
    required: false
  },
  hasRegistered: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PreregisteredCitizen', preregisteredCitizenSchema, 'preregistered');
