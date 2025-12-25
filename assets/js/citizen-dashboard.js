// Citizen Dashboard JavaScript

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupNavigationListeners();
    setupRealtimeFeatures();
    loadUserData();
    updateTimeRemaining();
});

// Initialize dashboard
function initializeDashboard() {
    console.log('নাগরিক ড্যাশবোর্ড লোড হয়েছে');
    
    // Check if user is logged in
    const userData = getUserData();
    if (!userData) {
        window.location.href = 'login.html';
        return;
    }
    
    // Display user name
    document.getElementById('userName').textContent = userData.name || 'নাগরিক';
    document.getElementById('userArea').textContent = userData.area || 'ঢাকা-১০';
    
    // Set active section from URL hash or default to voting
    const hash = window.location.hash.substring(1) || 'voting';
    showSection(hash);
}

// Setup navigation listeners
function setupNavigationListeners() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            showSection(section);
            
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Update URL hash
            window.location.hash = section;
        });
    });
}

// Show specific section
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show selected section
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update navigation active state
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === sectionName) {
            item.classList.add('active');
        }
    });
    
    // Clear notification badges when section is opened
    if (sectionName === 'discussion') {
        const badge = document.getElementById('discussionBadge');
        if (badge) badge.classList.add('hidden');
    }
    if (sectionName === 'chat') {
        const badge = document.getElementById('chatBadge');
        if (badge) badge.classList.add('hidden');
    }
}

// Get user data (simulate - in real app, get from server/session)
function getUserData() {
    // In real application, this would fetch from session/localStorage
    return {
        name: 'মোঃ আবদুল করিম',
        nid: '1234567890123',
        phone: '01712345678',
        area: 'ঢাকা-১০'
    };
}

// Load user data
function loadUserData() {
    // Simulate loading ballots for user's area
    console.log('ব্যবহারকারীর তথ্য লোড হচ্ছে...');
    
    // In real app, fetch from API:
    // fetch('/api/ballots?area=' + userData.area)
    //     .then(response => response.json())
    //     .then(data => displayBallots(data));
}

// Update time remaining for active ballots
function updateTimeRemaining() {
    setInterval(() => {
        const timeElements = document.querySelectorAll('[id^="timeRemaining"]');
        timeElements.forEach(element => {
            // Simulate countdown (in real app, calculate from actual end time)
            const current = element.textContent;
            // Update logic here
        });
    }, 60000); // Update every minute
}

// ============= VOTING FUNCTIONS =============

// Submit vote
function submitVote(ballotId) {
    const selectedCandidate = document.querySelector(`input[name="vote${ballotId}"]:checked`);
    
    if (!selectedCandidate) {
        showAlert('অনুগ্রহ করে একজন প্রার্থী নির্বাচন করুন', 'warning');
        return;
    }
    
    const candidateValue = selectedCandidate.value;
    
    // Confirm vote
    if (!confirm('আপনি কি নিশ্চিত আপনি এই প্রার্থীকে ভোট দিতে চান? ভোট দেওয়ার পর এটি পরিবর্তন করা যাবে না।')) {
        return;
    }
    
    // Show loading
    showAlert('ভোট প্রদান করা হচ্ছে...', 'info');
    
    // Simulate API call
    setTimeout(() => {
        // In real app:
        // fetch('/api/vote', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ ballotId, candidateId: candidateValue })
        // })
        
        showAlert('✅ আপনার ভোট সফলভাবে প্রদান করা হয়েছে! ধন্যবাদ।', 'success');
        
        // Update UI to show voted state
        const ballotCard = selectedCandidate.closest('.ballot-card');
        ballotCard.classList.add('voted');
        ballotCard.innerHTML = `
            <div class="ballot-header">
                <h3>জাতীয় সংসদ নির্বাচন ২০২৫</h3>
                <span class="ballot-status completed">✓ ভোট প্রদান সম্পন্ন</span>
            </div>
            <div class="voted-message">
                <p>✅ আপনি এই নির্বাচনে ভোট প্রদান করেছেন। ধন্যবাদ!</p>
                <p class="vote-time">ভোট প্রদানের সময়: ${getCurrentDateTime()}</p>
            </div>
        `;
        
        // Scroll to results
        setTimeout(() => {
            if (confirm('ফলাফল দেখতে চান?')) {
                showSection('results');
            }
        }, 2000);
        
    }, 1500);
}

// Get current date time in Bangla
function getCurrentDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString('bn-BD');
    const time = now.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
    return `${date}, ${time}`;
}

// ============= DISCUSSION FUNCTIONS =============

// Setup realtime features
function setupRealtimeFeatures() {
    // Simulate receiving new messages
    startDiscussionSimulation();
    startChatSimulation();
}

// Start discussion simulation (in real app, use WebSocket)
function startDiscussionSimulation() {
    // Simulate new messages every 30 seconds
    setInterval(() => {
        const messages = [
            'সিস্টেম খুব ভালো কাজ করছে।',
            'ভোট দিতে কোনো সমস্যা হয়নি।',
            'ধন্যবাদ এই সুবিধার জন্য।',
            'ফলাফল কখন পাবো?',
            'প্রক্রিয়া খুবই সহজ।'
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        addDiscussionMessage(randomMessage, false);
    }, 30000);
}

// Send discussion message
function sendDiscussionMessage() {
    const input = document.getElementById('discussionInput');
    const message = input.value.trim();
    
    if (!message) {
        showAlert('অনুগ্রহ করে একটি বার্তা লিখুন', 'warning');
        return;
    }
    
    // Add message to discussion
    addDiscussionMessage(message, true);
    
    // Clear input
    input.value = '';
    
    // In real app, send to server via WebSocket:
    // socket.emit('discussion-message', { message, timestamp: Date.now() });
}

// Add discussion message to feed
function addDiscussionMessage(message, isCurrentUser) {
    const messagesContainer = document.getElementById('discussionMessages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="message-author">বেনামী নাগরিক</span>
            <span class="message-time">এখনই</span>
        </div>
        <p class="message-text">${escapeHtml(message)}</p>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    if (!isCurrentUser) {
        // Show notification badge if not on discussion section
        const currentSection = document.querySelector('.content-section.active');
        if (!currentSection || currentSection.id !== 'discussion-section') {
            const badge = document.getElementById('discussionBadge');
            if (badge) badge.classList.remove('hidden');
        }
    }
}

// ============= CHAT FUNCTIONS =============

// Start chat simulation
function startChatSimulation() {
    // Simulate admin responses (in real app, actual admin messages via WebSocket)
}

// Send chat message
function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) {
        showAlert('অনুগ্রহ করে একটি বার্তা লিখুন', 'warning');
        return;
    }
    
    // Add user message
    addChatMessage(message, 'user');
    
    // Clear input
    input.value = '';
    
    // Simulate admin response after 2 seconds
    setTimeout(() => {
        const responses = [
            'ধন্যবাদ আপনার বার্তার জন্য। আমি আপনাকে সাহায্য করতে পেরে খুশি।',
            'আপনার প্রশ্নের উত্তর শীঘ্রই দেওয়া হবে।',
            'আপনি যদি আরও কোনো সাহায্য চান, আমাকে জানান।'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addChatMessage(randomResponse, 'admin');
    }, 2000);
    
    // In real app:
    // socket.emit('chat-message', { message, timestamp: Date.now() });
}

// Add chat message
function addChatMessage(message, type) {
    const messagesContainer = document.getElementById('chatMessages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}`;
    messageDiv.innerHTML = `
        <div class="message-bubble">
            <p>${escapeHtml(message)}</p>
            <span class="message-time">${new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    if (type === 'admin') {
        // Show notification badge if not on chat section
        const currentSection = document.querySelector('.content-section.active');
        if (!currentSection || currentSection.id !== 'chat-section') {
            const badge = document.getElementById('chatBadge');
            if (badge) {
                badge.classList.remove('hidden');
                const currentCount = parseInt(badge.textContent) || 0;
                badge.textContent = currentCount + 1;
            }
        }
    }
}

// ============= COMPLAINT FUNCTIONS =============

// Submit complaint
function submitComplaint(event) {
    event.preventDefault();
    
    const complaintText = document.getElementById('complaintText').value.trim();
    const isAnonymous = document.getElementById('anonymousComplaint').checked;
    
    if (!complaintText) {
        showAlert('অনুগ্রহ করে অভিযোগের বিবরণ লিখুন', 'warning');
        return;
    }
    
    // Show loading
    showAlert('অভিযোগ জমা দেওয়া হচ্ছে...', 'info');
    
    // Simulate API call
    setTimeout(() => {
        // In real app:
        // fetch('/api/complaints', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ text: complaintText, anonymous: isAnonymous })
        // })
        
        showAlert('✅ আপনার অভিযোগ সফলভাবে জমা দেওয়া হয়েছে। প্রশাসক শীঘ্রই এটি পর্যালোচনা করবেন।', 'success');
        
        // Clear form
        document.getElementById('complaintForm').reset();
        document.getElementById('anonymousComplaint').checked = true;
        
        // Add to complaints list
        addComplaintToList(complaintText);
        
    }, 1500);
}

// Add complaint to list
function addComplaintToList(text) {
    const complaintsList = document.querySelector('.complaints-container .card:last-child');
    
    const complaintItem = document.createElement('div');
    complaintItem.className = 'complaint-item';
    complaintItem.innerHTML = `
        <div class="complaint-header">
            <span class="complaint-status pending">⏳ প্রক্রিয়াধীন</span>
            <span class="complaint-date">${new Date().toLocaleDateString('bn-BD')}</span>
        </div>
        <p class="complaint-text">${escapeHtml(text)}</p>
    `;
    
    complaintsList.insertBefore(complaintItem, complaintsList.querySelector('h3').nextSibling);
}

// ============= PROFILE FUNCTIONS =============

// Change password
function changePassword(event) {
    event.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
        showAlert('নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মিলছে না', 'error');
        return;
    }
    
    const strength = checkPasswordStrength(newPassword);
    if (strength === 'weak') {
        showAlert('পাসওয়ার্ড খুবই দুর্বল। অনুগ্রহ করে আরও শক্তিশালী পাসওয়ার্ড ব্যবহার করুন', 'warning');
        return;
    }
    
    // Show loading
    showAlert('পাসওয়ার্ড পরিবর্তন করা হচ্ছে...', 'info');
    
    // Simulate API call
    setTimeout(() => {
        // In real app:
        // fetch('/api/change-password', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ currentPassword, newPassword })
        // })
        
        showAlert('✅ পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে', 'success');
        
        // Clear form
        document.getElementById('passwordForm').reset();
        
    }, 1500);
}

// ============= UTILITY FUNCTIONS =============

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Handle Enter key press for inputs
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const target = e.target;
        
        if (target.id === 'discussionInput') {
            e.preventDefault();
            sendDiscussionMessage();
        } else if (target.id === 'chatInput') {
            e.preventDefault();
            sendChatMessage();
        }
    }
});

// Auto-resize textareas
document.addEventListener('input', function(e) {
    if (e.target.tagName === 'TEXTAREA') {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    }
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Update notification counts periodically
setInterval(() => {
    // In real app, fetch from server
    // updateNotificationCounts();
}, 30000);

// Log user activity (for analytics)
function logActivity(action) {
    console.log('Activity:', action, new Date().toISOString());
    // In real app, send to analytics server
}

// Confirm before leaving if voting in progress
window.addEventListener('beforeunload', function(e) {
    const selectedVote = document.querySelector('input[type="radio"]:checked');
    if (selectedVote) {
        const ballot = selectedVote.closest('.ballot-card');
        if (ballot && !ballot.classList.contains('voted')) {
            e.preventDefault();
            e.returnValue = 'আপনি এখনও ভোট প্রদান করেননি। আপনি কি নিশ্চিত আপনি চলে যেতে চান?';
            return e.returnValue;
        }
    }
});

console.log('নিরাপদ ভোট - নাগরিক ড্যাশবোর্ড সফলভাবে লোড হয়েছে ✓');

// Candidate Details Modal Logic
const candidateData = {
    1: {
        name: "মোঃ আবদুল্লাহ",
        party: "জাতীয় নাগরিক পার্টি (এনসিপি)",
        symbol: "assets/images/symbol1.png", // Placeholder
        photo: "https://via.placeholder.com/150",
        bio: "মোঃ আবদুল্লাহ একজন অভিজ্ঞ রাজনীতিবিদ যিনি গত ২০ বছর ধরে জনসেবায় নিয়োজিত আছেন। তিনি ঢাকা বিশ্ববিদ্যালয় থেকে রাষ্ট্রবিজ্ঞানে স্নাতকোত্তর ডিগ্রি অর্জন করেছেন।",
        manifesto: [
            "শিক্ষার মান উন্নয়ন ও ডিজিটাল শিক্ষা ব্যবস্থা প্রবর্তন",
            "বেকার যুবকদের জন্য কর্মসংস্থান সৃষ্টি",
            "স্বাস্থ্যসেবা সহজলভ্য করা",
            "দুর্নীতি মুক্ত সমাজ গঠন"
        ],
        socialActivities: [
            "সভাপতি, স্থানীয় স্কুল কমিটি (২০১০-বর্তমান)",
            "প্রতিষ্ঠাতা, আবদুল্লাহ চ্যারিটেবল ট্রাস্ট",
            "সদস্য, রেড ক্রিসেন্ট সোসাইটি"
        ],
        partyHistory: "জাতীয় নাগরিক পার্টি (এনসিপি) একটি আধুনিক প্রগতিশীল রাজনৈতিক দল যা সুশাসন, স্বচ্ছতা এবং নাগরিক অধিকার রক্ষায় প্রতিশ্রুতিবদ্ধ। দলটি গণতান্ত্রিক মূল্যবোধ এবং সামাজিক ন্যায়বিচার প্রতিষ্ঠায় কাজ করে।"
    },
    2: {
        name: "সালমা খাতুন",
        party: "জনকল্যাণ পার্টি",
        symbol: "assets/images/symbol2.png", // Placeholder
        photo: "https://via.placeholder.com/150",
        bio: "সালমা খাতুন একজন সমাজকর্মী ও নারী অধিকার নেত্রী। তিনি তৃণমূল পর্যায় থেকে রাজনীতিতে উঠে এসেছেন এবং নারীদের ক্ষমতায়নে কাজ করছেন।",
        manifesto: [
            "নারীদের জন্য নিরাপদ কর্মপরিবেশ নিশ্চিত করা",
            "ক্ষুদ্র ও মাঝারি শিল্পের বিকাশ",
            "পরিবেশ সংরক্ষণ ও বনায়ণ",
            "মাদক মুক্ত সমাজ গঠন"
        ],
        socialActivities: [
            "পরিচালক, নারী উন্নয়ন সংস্থা",
            "সদস্য, পরিবেশ রক্ষা আন্দোলন",
            "স্বেচ্ছাসেবী, বন্যা দুর্গতদের সাহায্য তহবিল"
        ],
        partyHistory: "জনকল্যাণ পার্টি ২০০৫ সালে প্রতিষ্ঠিত হয়। এটি একটি প্রগতিশীল রাজনৈতিক দল যা সাধারণ মানুষের কল্যাণে কাজ করে।"
    },
    3: {
        name: "রহিম উদ্দিন",
        party: "স্বাধীন প্রার্থী",
        symbol: "assets/images/symbol3.png", // Placeholder
        photo: "https://via.placeholder.com/150",
        bio: "রহিম উদ্দিন একজন সফল ব্যবসায়ী ও সমাজসেবক। তিনি কোনো রাজনৈতিক দলের সাথে যুক্ত নন এবং স্বতন্ত্রভাবে জনগণের সেবা করতে চান।",
        manifesto: [
            "স্থানীয় অবকাঠামো উন্নয়ন",
            "বিশুদ্ধ পানি সরবরাহ নিশ্চিত করা",
            "ক্রীড়া ও সংস্কৃতির বিকাশ",
            "প্রবীণ নাগরিকদের জন্য বিশেষ সুবিধা"
        ],
        socialActivities: [
            "সভাপতি, স্থানীয় বাজার কমিটি",
            "দাতা সদস্য, এতিমখানা",
            "আয়োজক, বার্ষিক ক্রীড়া প্রতিযোগিতা"
        ],
        partyHistory: "স্বতন্ত্র প্রার্থী হিসেবে তিনি কোনো নির্দিষ্ট রাজনৈতিক দলের অন্তর্ভুক্ত নন। তিনি জনগণের সরাসরি সমর্থনে বিশ্বাসী।"
    }
};

function openCandidateModal(candidateId) {
    const modal = document.getElementById('candidateModal');
    const modalBody = document.getElementById('candidateModalBody');
    const candidate = candidateData[candidateId];

    if (!candidate) return;

    let manifestoHtml = '<ul class="detail-list">';
    candidate.manifesto.forEach(item => {
        manifestoHtml += `<li>${item}</li>`;
    });
    manifestoHtml += '</ul>';

    let socialHtml = '<ul class="detail-list">';
    candidate.socialActivities.forEach(item => {
        socialHtml += `<li>${item}</li>`;
    });
    socialHtml += '</ul>';

    modalBody.innerHTML = `
        <div class="candidate-profile-header">
            <img src="${candidate.photo}" alt="${candidate.name}" class="candidate-profile-img">
            <div class="candidate-profile-info">
                <h3>${candidate.name}</h3>
                <div class="candidate-party-info">
                    <img src="https://via.placeholder.com/40" alt="প্রতীক" class="party-symbol-small">
                    <strong>${candidate.party}</strong>
                </div>
            </div>
        </div>

        <div class="detail-section">
            <h4>জীবনী</h4>
            <p>${candidate.bio}</p>
        </div>

        <div class="detail-section">
            <h4>নির্বাচনী ইশতেহার</h4>
            ${manifestoHtml}
        </div>

        <div class="detail-section">
            <h4>সামাজিক কর্মকাণ্ড</h4>
            ${socialHtml}
        </div>

        <div class="detail-section">
            <h4>দলীয় ইতিহাস</h4>
            <p>${candidate.partyHistory}</p>
        </div>
    `;

    modal.style.display = "block";
}

function closeCandidateModal() {
    const modal = document.getElementById('candidateModal');
    modal.style.display = "none";
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('candidateModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}