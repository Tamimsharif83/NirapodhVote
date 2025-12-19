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
        default: 'general'
    },
    contentType: {
        type: String,
        enum: ['text', 'pdf'],
        default: 'text'
    },
    message: {
        type: String,
        required: function() {
            return this.contentType === 'text';
        }
    },
    pdfUrl: {
        type: String,
        required: function() {
            return this.contentType === 'pdf';
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    publishedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    publishedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
noticeSchema.index({ publishedAt: -1 });
noticeSchema.index({ type: 1 });

module.exports = mongoose.model('Notice', noticeSchema);
