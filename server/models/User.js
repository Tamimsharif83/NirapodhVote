const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  /* ---------- Identity ---------- */
  nid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  dob: {
    type: Date,
    required: true
  },

  name: {
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

  /* ---------- Contact ---------- */
  mobile: {
    type: String,
    required: true
  },

  permanentAddress: {
    type: String,
    required: true
  },

  presentAddress: {
    type: String,
    required: true
  },

  /* ---------- Authentication ---------- */
  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['citizen', 'admin'],
    default: 'citizen'
  },

  /* ---------- Voting Status ---------- */
  hasVoted: {
    type: Boolean,
    default: false
  },

  votedCandidate: {
    type: String,
    default: null
  },

  votedAt: {
    type: Date,
    default: null
  },

  /* ---------- Security ---------- */
  isVerified: {
    type: Boolean,
    default: false   // becomes true after OTP verification
  },

  /* ---------- Metadata ---------- */
  createdAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

/* ===============================
   🔐 Hash password before save
   =============================== */
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

/* ===============================
   🔑 Compare password method
   =============================== */
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
