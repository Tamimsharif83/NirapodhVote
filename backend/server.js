const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nirapod_vote';

mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('✅ MongoDB সংযুক্ত হয়েছে!');
    console.log('📊 Database: nirapod_vote');
})
.catch((error) => {
    console.error('❌ MongoDB সংযোগ ব্যর্থ:', error.message);
    process.exit(1);
});

// Import Routes (will create these next)
// const authRoutes = require('./routes/auth');
// const ballotRoutes = require('./routes/ballot');
// const adminRoutes = require('./routes/admin');

// Use Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/ballot', ballotRoutes);
// app.use('/api/admin', adminRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'নিরাপদ ভোট API সার্ভার চালু আছে',
        status: 'active',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        timestamp: new Date()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'সার্ভার এরর',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 সার্ভার চালু আছে: http://localhost:${PORT}`);
});

module.exports = app;
