const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    complainantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Citizen',
        required: true
    },
    ballotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ballot',
        required: true
    },
    complaintText: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'resolved', 'rejected'],
        default: 'pending'
    },
    adminResponse: {
        type: String,
        trim: true
    },
    proofDocument: {
        type: String, // URL or path to uploaded document
        required: false
    },
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    resolvedAt: {
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
complaintSchema.index({ status: 1 });
complaintSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Complaint', complaintSchema);
