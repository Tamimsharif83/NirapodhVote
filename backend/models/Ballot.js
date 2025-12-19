const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    nameBangla: {
        type: String,
        required: true,
        trim: true
    },
    party: {
        type: String,
        required: true,
        trim: true
    },
    partyBangla: {
        type: String,
        required: true,
        trim: true
    },
    photo: {
        type: String, // URL or path to photo
        required: false
    },
    symbol: {
        type: String, // URL or path to party symbol (marka)
        required: false
    },
    area: {
        type: String,
        required: true
    },
    voteCount: {
        type: Number,
        default: 0
    }
});

const ballotSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    nameBangla: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    language: {
        type: String,
        enum: ['bangla', 'english', 'both'],
        default: 'bangla'
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    candidates: [candidateSchema],
    totalVotes: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'completed', 'cancelled'],
        default: 'draft'
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    resultPublished: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
ballotSchema.index({ location: 1 });
ballotSchema.index({ status: 1 });
ballotSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model('Ballot', ballotSchema);
