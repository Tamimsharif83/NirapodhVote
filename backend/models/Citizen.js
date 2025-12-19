const mongoose = require('mongoose');

const citizenSchema = new mongoose.Schema({
    nid: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 10,
        maxlength: 17
    },
    password: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true
    },
    votingCenter: {
        type: String,
        required: true
    },
    votingArea: {
        type: String,
        required: true
    },
    hasVoted: {
        type: Boolean,
        default: false
    },
    votedBallots: [{
        ballotId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ballot'
        },
        votedAt: {
            type: Date,
            default: Date.now
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
citizenSchema.index({ nid: 1 });
citizenSchema.index({ votingArea: 1 });

module.exports = mongoose.model('Citizen', citizenSchema);
