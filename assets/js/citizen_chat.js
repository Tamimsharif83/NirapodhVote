
// assets/js/citizen_chat.js - Namespaced, Production-Safe Version
(function () {
  // ===== Namespace =====
  window.NirapodChat = window.NirapodChat || {};

  // ===== Private state (inside closure) =====
  let socket = null;
  let currentUsername = '';
  const messageIds = new Set(); // Track message IDs to prevent duplicates

  // ===== Utility (internal) =====
  function formatTime(timestamp) {
    const d = new Date(timestamp);
    const hh = d.getHours().toString().padStart(2, '0');
    const mm = d.getMinutes().toString().padStart(2, '0');
    const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return `${hh}:${mm}`.split('').map(c => {
      const n = parseInt(c, 10);
      return Number.isNaN(n) ? c : bn[n];
    }).join('');
  }

  function scrollToBottom() {
    const el = document.getElementById('globalChatMessages');
    if (el) el.scrollTop = el.scrollHeight;
  }

  function showAlert(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    const container = document.getElementById('alertContainer');
    if (!container) return;
    const div = document.createElement('div');
    div.className = `alert alert-${type}`;
    div.textContent = message;
    container.appendChild(div);
    setTimeout(() => {
      div.style.opacity = '0';
      div.style.transform = 'translateX(20px)';
      setTimeout(() => div.remove(), 300);
    }, 3000);
  }

  // ===== Public UI helpers (namespaced) =====
  NirapodChat.addChatMessage = function (username, message, timestamp, isOwn = false, id = null) {
    const messagesContainer = document.getElementById('globalChatMessages');
    if (!messagesContainer) {
      console.error('❌ globalChatMessages not found in DOM');
      showAlert('চ্যাট UI কন্টেইনার পাওয়া যায়নি (globalChatMessages)', 'error');
      return;
    }

    const key = id || `${username}-${timestamp}-${message.substring(0, 20)}`;
    if (messageIds.has(key)) {
      console.log('⚠️ Duplicate message skipped:', key);
      return;
    }
    messageIds.add(key);

    console.log('🧩 Render message:', { key, username, isOwn, timestamp, messageLen: message.length });

    const messageDiv = document.createElement('div');
    messageDiv.className = `global-message ${isOwn ? 'own-message' : 'other-message'}`;
    messageDiv.dataset.messageId = key;

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';

    if (!isOwn) {
      const usernameSpan = document.createElement('div');
      usernameSpan.className = 'message-username';
      usernameSpan.textContent = username;
      bubbleDiv.appendChild(usernameSpan);
    }

    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.textContent = message; // Safe: textContent
    bubbleDiv.appendChild(textDiv);

    const timeSpan = document.createElement('div');
    timeSpan.className = 'message-time';
    timeSpan.textContent = formatTime(timestamp);
    bubbleDiv.appendChild(timeSpan);

    messageDiv.appendChild(bubbleDiv);
    messagesContainer.appendChild(messageDiv);

    scrollToBottom();
  };

  NirapodChat.addSystemMessage = function (message) {
    const messagesContainer = document.getElementById('globalChatMessages');
    if (!messagesContainer) {
      console.error('❌ globalChatMessages not found in DOM (system)');
      return;
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = 'global-message system-message';

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';

    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.textContent = message;
    bubbleDiv.appendChild(textDiv);

    const timeSpan = document.createElement('div');
    timeSpan.className = 'message-time';
    timeSpan.textContent = formatTime(new Date().toISOString());
    bubbleDiv.appendChild(timeSpan);

    messageDiv.appendChild(bubbleDiv);
    messagesContainer.appendChild(messageDiv);

    scrollToBottom();
  };

  NirapodChat.updateOnlineUsersList = function (users = []) {
    const usersList = document.getElementById('onlineUsersList');
    const onlineCount = document.getElementById('onlineCount');
    const usersSidebarCount = document.getElementById('usersSidebarCount');

    if (onlineCount) onlineCount.textContent = users.length;
    if (usersSidebarCount) usersSidebarCount.textContent = users.length;

    if (!usersList) return;
    usersList.innerHTML = '';

    if (!users.length) {
      const noUsers = document.createElement('div');
      noUsers.className = 'no-users';
      noUsers.textContent = 'কোন নাগরিক অনলাইনে নেই';
      usersList.appendChild(noUsers);
      return;
    }

    users.forEach(username => {
      const item = document.createElement('div');
      item.className = 'user-item';

      const avatar = document.createElement('div');
      avatar.className = 'user-avatar';
      avatar.textContent = username.charAt(0).toUpperCase();

      const name = document.createElement('span');
      name.className = 'user-name';
      name.textContent = username;

      item.appendChild(avatar);
      item.appendChild(name);
      usersList.appendChild(item);
    });
  };

  // ===== Socket init (namespaced) =====
  NirapodChat.initializeSocket = function () {
    socket = io('http://localhost:5500', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socket.on('connect', () => {
      console.log('✅ Connected to server: 5500');
      showAlert('সার্ভারের সাথে সংযুক্ত হয়েছে', 'success');
    });

    socket.on('disconnect', (reason) => {
      console.warn('🔌 Disconnected:', reason);
      showAlert('সার্ভার সংযোগ বিচ্ছিন্ন হয়েছে', 'error');
    });

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      showAlert('সার্ভারের সাথে সংযোগ করতে সমস্যা হচ্ছে', 'error');
    });

    socket.on('connection_status', (data) => {
      console.log('🔌 Connection status:', data);
    });

    // Server events
    socket.on('user_status', (data) => {
      NirapodChat.addSystemMessage(
        data.online
          ? `${data.username} চ্যাটে যোগ দিয়েছেন`
          : `${data.username} চ্যাট ছেড়ে চলে গেছেন`
      );
    });

    socket.on('users_online', (data) => {
      NirapodChat.updateOnlineUsersList(data.users || []);
    });

    // নিজের মেসেজও সার্ভার থেকে এলে রেন্ডার হতে দিন — ডিডুপ id দিয়ে হবে
   
socket.on('receive_global_message', (data) => {
  // নিজের ইকো সার্ভার থেকে আসলে স্কিপ করুন
  if (data.from === currentUsername) return;

  const isOwn = false;
  NirapodChat.addChatMessage(data.from, data.message, data.timestamp, isOwn, data.id);
});


    socket.on('message_history', (payload) => {
      const msgs = payload?.messages || [];
      console.log(`📜 Received ${msgs.length} messages from history`);
      msgs.forEach(m => {
        const isOwn = m.from === currentUsername;
        NirapodChat.addChatMessage(m.from, m.message, m.timestamp, isOwn, m.id);
      });
    });

    socket.on('login_success', (data) => {
      console.log('✅ Login successful:', data.username);
    });

    // অ্যাপ-লেভেল ত্রুটি — কাস্টম ইভেন্ট
    socket.on('chat_error', (data) => {
      showAlert(data?.msg || 'একটি ত্রুটি ঘটেছে', 'error');
    });

    // (ঐচ্ছিক) লো-লেভেল ট্রান্সপোর্ট error:
    // socket.on('error', (err) => { console.error('Socket low-level error:', err); });
  };

  // ===== Actions (namespaced) =====
  NirapodChat.joinGlobalChat = function () {
    const usernameInput = document.getElementById('chatUsername');
    const username = (usernameInput?.value || '').trim();

    if (!username) {
      showAlert('আপনার নাম লিখুন', 'warning');
      usernameInput?.focus();
      return;
    }
    if (username.length < 2) {
      showAlert('নাম কমপক্ষে ২ অক্ষর হতে হবে', 'warning');
      usernameInput?.focus();
      return;
    }
    if (username.length > 20) {
      showAlert('নাম সর্বোচ্চ ২০ অক্ষর হতে হবে', 'warning');
      usernameInput?.focus();
      return;
    }

    currentUsername = username;

    if (!socket) {
      NirapodChat.initializeSocket();
    }

    // Wait for connection
    const wait = setInterval(() => {
      if (socket && socket.connected) {
        clearInterval(wait);

        // Send login request
        socket.emit('user_login', { username });

        // UI toggle
        const loginCard = document.getElementById('chatLoginCard');
        const chatUI = document.getElementById('chatInterface');
        if (loginCard) loginCard.style.display = 'none';
        if (chatUI) chatUI.style.display = 'block';

        // Welcome message
        NirapodChat.addSystemMessage('গ্লোবাল চ্যাটে স্বাগতম! সকল নাগরিক এখানে কথা বলতে পারবেন।');

        // Request message history
        socket.emit('request_message_history');

        // Focus on input
        document.getElementById('globalChatInput')?.focus();
        showAlert('চ্যাটে সফলভাবে প্রবেশ করেছেন', 'success');
      }
    }, 100);

    // Timeout after 5 seconds
    setTimeout(() => {
      clearInterval(wait);
      if (!socket || !socket.connected) {
        showAlert('সার্ভারের সাথে সংযোগ করতে সমস্যা হচ্ছে। অনুগ্রহ করে আবার চেষ্টা করুন।', 'error');
        currentUsername = '';
      }
    }, 5000);
  };

  NirapodChat.leaveGlobalChat = function () {
    if (socket && currentUsername) {
      socket.emit('user_logout', { username: currentUsername });
    }

    // Reset UI
    const loginCard = document.getElementById('chatLoginCard');
    const chatUI = document.getElementById('chatInterface');
    const usernameInput = document.getElementById('chatUsername');
    const msgBox = document.getElementById('globalChatMessages');
    const usersList = document.getElementById('onlineUsersList');
    const onlineCount = document.getElementById('onlineCount');
    const usersSidebarCount = document.getElementById('usersSidebarCount');

    if (loginCard) loginCard.style.display = 'block';
    if (chatUI) chatUI.style.display = 'none';
    if (usernameInput) usernameInput.value = '';
    if (msgBox) msgBox.innerHTML = '';
    if (usersList) usersList.innerHTML = '<div class="no-users">কোন নাগরিক অনলাইনে নেই</div>';
    if (onlineCount) onlineCount.textContent = '0';
    if (usersSidebarCount) usersSidebarCount.textContent = '0';

    currentUsername = '';
    messageIds.clear();

    showAlert('চ্যাট থেকে বের হয়ে গেছেন', 'info');
  };

  NirapodChat.sendGlobalMessage = function () {
    const input = document.getElementById('globalChatInput');
    const message = (input?.value || '').trim();

    if (!message) return;

    if (!currentUsername) {
      showAlert('অনুগ্রহ করে আগে চ্যাটে লগইন করুন', 'warning');
      return;
    }

    if (!socket || !socket.connected) {
      showAlert('সার্ভারের সাথে সংযোগ নেই', 'error');
      return;
    }

    if (message.length > 500) {
      showAlert('বার্তা সর্বোচ্চ ৫০০ অক্ষর হতে হবে', 'warning');
      return;
    }

    const payload = {
      from: currentUsername,
      message,
      timestamp: new Date().toISOString()
    };

    // Send to server
    socket.emit('global_message', payload);

    // Optimistic UI (id নেই—লোকাল key; সার্ভার থেকে আসা id দিয়ে ডিডুপ হবে)
    NirapodChat.addChatMessage(currentUsername, message, payload.timestamp, true, null);

    // Clear input
    if (input) {
      input.value = '';
      input.focus();
    }
  };

  // ===== Bind DOM events =====
  NirapodChat.bindEvents = function () {
    const chatInput = document.getElementById('globalChatInput');
    const usernameInput = document.getElementById('chatUsername');

    if (chatInput) {
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          NirapodChat.sendGlobalMessage();
        }
      });

      // (ঐচ্ছিক) ক্লিক বাটন ডাবল-বাইন্ড — onclick না কাজ করলে fallback
      const sendBtn = document.querySelector('.global-chat-input-container .btn.btn-primary');
      if (sendBtn) {
        sendBtn.addEventListener('click', NirapodChat.sendGlobalMessage);
      }
    }

    if (usernameInput) {
      usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          NirapodChat.joinGlobalChat();
        }
      });
    }

    // Graceful logout on tab close
    window.addEventListener('beforeunload', () => {
      if (socket && currentUsername) {
        socket.emit('user_logout', { username: currentUsername });
      }
    });

    // Handle visibility change (tab switch)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        scrollToBottom();
      }
    });
  };

  // ===== Expose (for existing HTML onclick attributes) =====
  window.joinGlobalChat = () => NirapodChat.joinGlobalChat();
  window.leaveGlobalChat = () => NirapodChat.leaveGlobalChat();
  window.sendGlobalMessage = () => NirapodChat.sendGlobalMessage();

  // ===== Boot =====
  document.addEventListener('DOMContentLoaded', () => {
    NirapodChat.bindEvents();
  });
})();
