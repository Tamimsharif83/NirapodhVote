const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    citizenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Citizen',
        required: true
    },
    ballotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ballot',
        required: true
    },
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    encryptedVote: {
        type: String, // For extra security - encrypted vote data
        required: false
    },
    votedAt: {
        type: Date,
        default: Date.now
    },
    ipAddress: {
        type: String,
        required: false
    },
    isAnonymous: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for faster queries and ensure one vote per citizen per ballot
voteSchema.index({ citizenId: 1, ballotId: 1 }, { unique: true });
voteSchema.index({ ballotId: 1 });

module.exports = mongoose.model('Vote', voteSchema);
