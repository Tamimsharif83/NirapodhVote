
// assets/js/server.js - Express 5 Compatible (Updated)
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { randomUUID } = require('crypto'); // 🆕 For unique message IDs

const app = express();
const server = http.createServer(app);

// CORS middleware
app.use(cors({
  origin: '*', // TODO: Production: replace with your exact domain, e.g. 'https://nirapod-vote.example.com'
  credentials: true
}));

// Express 5 built-in body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: '*', // TODO: Production: set to your exact origin
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true // Backward compatibility if older clients connect
});

// In-memory state (Development only)
const onlineUsers = new Map(); // socketId -> { username, joinedAt }
let globalMessageHistory = [];
const MAX_HISTORY = 100;
const MAX_MESSAGE_LENGTH = 500;

// ===== Utility functions =====

function broadcastOnlineUsers() {
  const users = Array.from(onlineUsers.values())
    .map(u => u.username)
    .filter((v, i, a) => a.indexOf(v) === i); // Ensure uniqueness

  io.emit('users_online', { users });
  console.log(`📊 Online users: ${users.length}`);
}

// 🛡️ Stronger HTML entity encoding for safety
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

// ===== Socket.IO connection handling =====
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // Send connection confirmation
  socket.emit('connection_status', {
    ok: true,
    socketId: socket.id,
    timestamp: new Date().toISOString()
  });

  // ---- User login
  socket.on('user_login', (data) => {
    const username = data?.username?.trim();

    if (!validateUsername(username)) {
      // ❗ custom app-level error event
      socket.emit('chat_error', { msg: 'নাম ২-২০ অক্ষরের মধ্যে হতে হবে' });
      return;
    }

    // Check if username already exists
    const existingUser = Array.from(onlineUsers.values())
      .find(u => u.username === username);

    if (existingUser) {
      socket.emit('chat_error', { msg: 'এই নাম ইতিমধ্যে ব্যবহৃত হচ্ছে। অন্য নাম চেষ্টা করুন।' });
      return;
    }

    // Register user
    onlineUsers.set(socket.id, {
      username,
      joinedAt: new Date().toISOString()
    });

    console.log(`✅ ${username} logged in (${socket.id})`);

    // Broadcast to all clients
    io.emit('user_status', { username, online: true });
    broadcastOnlineUsers();

    // Send success to the user
    socket.emit('login_success', { username });
  });

  // ---- User logout
  socket.on('user_logout', () => {
    const info = onlineUsers.get(socket.id);
    if (info) {
      console.log(`👋 ${info.username} logged out (${socket.id})`);
      onlineUsers.delete(socket.id);
      io.emit('user_status', { username: info.username, online: false });
      broadcastOnlineUsers();
    }
  });

  // ---- Request message history
  socket.on('request_message_history', () => {
    const info = onlineUsers.get(socket.id);
    if (!info) {
      socket.emit('chat_error', { msg: 'অননুমোদিত ব্যবহারকারী' });
      return;
    }

    // Send last 50 messages
    const recentMessages = globalMessageHistory.slice(-50);
    socket.emit('message_history', {
      messages: recentMessages,
      count: recentMessages.length
    });

    console.log(`📜 Sent ${recentMessages.length} messages to ${info.username}`);
  });

  // ---- Global message
  socket.on('global_message', (data) => {
    const info = onlineUsers.get(socket.id);
    if (!info) {
      socket.emit('chat_error', { msg: 'অননুমোদিত ব্যবহারকারী। আগে লগইন করুন।' });
      return;
    }

    const sender = data?.from?.trim();
    const message = sanitizeMessage(data?.message || '');

    // Verify sender
    if (info.username !== sender) {
      socket.emit('chat_error', { msg: 'অননুমোদিত প্রেরক' });
      return;
    }

    if (!message || message.length === 0) {
      return; // Empty message, ignore
    }

    // 🆔 Create message object with UUID
    const msgObj = {
      id: randomUUID(),
      from: sender,
      message,
      timestamp: new Date().toISOString()
    };

    // Store in history
    globalMessageHistory.push(msgObj);
    if (globalMessageHistory.length > MAX_HISTORY) {
      globalMessageHistory.shift();
    }

    // Broadcast to all clients
    io.emit('receive_global_message', msgObj);

    console.log(`💬 ${sender}: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`);
  });

  // ---- Typing indicator (optional)
  socket.on('typing_status', (data) => {
    const info = onlineUsers.get(socket.id);
    if (!info) return;

    socket.broadcast.emit('typing_status', {
      from: info.username,
      typing: !!data?.typing
    });
  });

  // ---- Disconnect handler
  socket.on('disconnect', (reason) => {
    const info = onlineUsers.get(socket.id);

    if (info) {
      console.log(`🔌 ${info.username} disconnected: ${reason}`);
      onlineUsers.delete(socket.id);
      io.emit('user_status', { username: info.username, online: false });
      broadcastOnlineUsers();
    } else {
      console.log(`🔌 Socket ${socket.id} disconnected: ${reason}`);
    }
  });

  // ---- Low-level error handler (transport-level)
  socket.on('error', (error) => {
    console.error(`❌ Socket low-level error (${socket.id}):`, error);
  });
});

// ===== HTTP routes =====
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Nirapod Vote Chat Server',
    onlineUsers: onlineUsers.size,
    messagesInHistory: globalMessageHistory.length
  });
});

app.get('/health', (req, res) => {
  res.json({
    ok: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    onlineUsers: onlineUsers.size
  });
});

app.get('/stats', (req, res) => {
  res.json({
    totalUsers: onlineUsers.size,
    users: Array.from(onlineUsers.values()).map(u => ({
      username: u.username,
      joinedAt: u.joinedAt
    })),
    messageHistory: globalMessageHistory.length
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// ===== Start server =====
const PORT = process.env.PORT || 5500;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   🚀 Nirapod Vote Chat Server        ║');
  console.log('╠════════════════════════════════════════╣');
  console.log(`║   Server: http://localhost:${PORT}     ║`);
  console.log(`║   Status: ✅ Running                   ║`);
  console.log('╚════════════════════════════════════════╝');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⚠️  SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n⚠️  SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
