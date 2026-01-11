// Main Server File - NirapodhVote Backend
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./server/config/db');

// Import routes
const authRoutes = require('./server/routes/auth');
const voteRoutes = require('./server/routes/vote');
const adminRoutes = require('./server/routes/admin');

const app = express();
const server = http.createServer(app);

// CORS configuration
app.use(cors({
  origin: '*', // In production, replace with your domain
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(__dirname));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/vote', voteRoutes);
app.use('/api/admin', adminRoutes);

// Socket.IO setup for chat
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true
});

// In-memory chat state
const onlineUsers = new Map();
let globalMessageHistory = [];
const MAX_HISTORY = 100;
const MAX_MESSAGE_LENGTH = 500;

// Socket.IO functions
function broadcastOnlineUsers() {
  const users = Array.from(onlineUsers.values())
    .map(u => u.username)
    .filter((v, i, a) => a.indexOf(v) === i);
  io.emit('users_online', { users });
  console.log(`📊 Online users: ${users.length}`);
}

function sanitizeMessage(text) {
  const trimmed = (text || '').trim().slice(0, MAX_MESSAGE_LENGTH);
  return trimmed
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function validateUsername(username) {
  if (!username || typeof username !== 'string') return false;
  const cleaned = username.trim();
  return cleaned.length >= 2 && cleaned.length <= 20;
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  socket.emit('connection_status', {
    ok: true,
    socketId: socket.id,
    timestamp: new Date().toISOString()
  });

  socket.on('user_login', (data) => {
    const username = data?.username?.trim();

    if (!validateUsername(username)) {
      socket.emit('chat_error', { msg: 'নাম ২-২০ অক্ষরের মধ্যে হতে হবে' });
      return;
    }

    const existingUser = Array.from(onlineUsers.values())
      .find(u => u.username === username);

    if (existingUser) {
      socket.emit('chat_error', { msg: 'এই নাম ইতিমধ্যে ব্যবহৃত হচ্ছে। অন্য নাম চেষ্টা করুন।' });
      return;
    }

    onlineUsers.set(socket.id, {
      username,
      joinedAt: new Date().toISOString()
    });

    socket.emit('login_success', { username });
    socket.emit('message_history', { messages: globalMessageHistory });
    
    broadcastOnlineUsers();
    
    io.emit('user_joined', { 
      username,
      timestamp: new Date().toISOString()
    });

    console.log(`✅ User logged in: ${username}`);
  });

  socket.on('send_message', (data) => {
    const user = onlineUsers.get(socket.id);
    if (!user) {
      socket.emit('chat_error', { msg: 'প্রথমে লগইন করুন' });
      return;
    }

    const sanitized = sanitizeMessage(data?.message);
    if (!sanitized) {
      socket.emit('chat_error', { msg: 'বার্তা খালি হতে পারবে না' });
      return;
    }

    const msgObj = {
      id: Date.now() + Math.random(),
      username: user.username,
      message: sanitized,
      timestamp: new Date().toISOString()
    };

    globalMessageHistory.push(msgObj);
    if (globalMessageHistory.length > MAX_HISTORY) {
      globalMessageHistory.shift();
    }

    io.emit('new_message', msgObj);
    console.log(`💬 ${user.username}: ${sanitized.substring(0, 50)}...`);
  });

  socket.on('disconnect', () => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      onlineUsers.delete(socket.id);
      broadcastOnlineUsers();
      
      io.emit('user_left', {
        username: user.username,
        timestamp: new Date().toISOString()
      });

      console.log(`👋 User disconnected: ${user.username}`);
    } else {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'NirapodhVote Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║   🗳️  NirapodhVote Backend Server         ║
║   ✅ Server running on port ${PORT}          ║
║   ✅ MongoDB Connected                     ║
║   🌐 http://localhost:${PORT}               ║
╚════════════════════════════════════════════╝
    `);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

module.exports = { app, server, io };
