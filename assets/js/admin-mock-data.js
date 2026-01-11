
// Mock Data for Dashboard
const mockDashboardData = {
    stats: {
        totalBallots: 12,
        activeVotes: 3,
        totalVoters: "১,২৫,৪৫০",
        votesCast: "৮৫,৩২০"
    },
    liveStats: [
        { seat: "ঢাকা-১ আসন", votes: "৪৫,২৩৪", percentage: 68 },
        { seat: "চট্টগ্রাম-২ আসন", votes: "৩২,১৮৯", percentage: 55 },
        { seat: "সিলেট-৩ আসন", votes: "৭,৮৯৭", percentage: 42 }
    ],
    activities: [
        { time: "৫ মিনিট আগে", text: 'নতুন ব্যালট "ঢাকা-৫ আসন" তৈরি হয়েছে' },
        { time: "১৫ মিনিট আগে", text: "১২৩ জন নতুন ভোটার নিবন্ধিত হয়েছে" },
        { time: "৩০ মিনিট আগে", text: 'নোটিশ প্রকাশ: "ভোটিং সময় বৃদ্ধি"' }
    ],
    candidates: [
        {
            id: 1,
            name: "ওসমান হাদি",
            party: "স্বতন্ত্র প্রার্থী",
            symbolSvg: `<img src="assets/images/powerful-symbol-unity-anti-corruption-day_968957-12635.avif" alt="Party Symbol" width="20" height="20">`,
            area: "ঢাকা-৮",
            status: "active", // active, inactive
            image: "assets/images/WhatsApp Image 2025-12-27 at 11.35.15 PM.jpeg",
            phone: "+৮৮০১৭১২৩৪৫৬৭",
            email: "osman.hadi@example.com",
            bio: "অভিজ্ঞ রাজনীতিবিদ এবং সামাজিক কর্মী যিনি স্থানীয় সম্প্রদায়ের উন্নয়নে দীর্ঘদিন কাজ করেছেন।"
        },
        {
            id: 2,
            name: "হাসনাত আবদুল্লাহ",
            party: "ন্যাশনাল সিটিজেন পার্টি (এনসিপি)",
            symbolSvg: `<img src="assets/images/জাতীয়_নাগরিক_পার্টির_লোগো.svg.png" alt="Party Symbol" width="20" height="20">`,
            area: "রংপুর-৩",
            status: "active",
            image: "assets/images/hasnat.jpg", // Placeholder if image not available
            phone: "+৮৮০১৯১২৩৪৫৬৭",
            email: "hasnat.abdullah@example.com",
            bio: "শিক্ষাবিদ এবং সামাজিক উদ্যোক্তা যিনি শিক্ষা ও স্বাস্থ্যসেবা খাতে উল্লেখযোগ্য অবদান রেখেছেন।"
        }
    ],
    complaints: [
        {
            id: "০০১",
            status: "pending", // pending, resolved, rejected
            date: "৩ ডিসেম্বর ২০২৫, ২:৩০ PM",
            text: "আমার ভোট সঠিকভাবে রেজিস্টার হয়নি। অনুগ্রহ করে যাচাই করুন।",
            area: "ঢাকা-১",
            voterId: "****5678"
        },
        {
            id: "০০২",
            status: "resolved",
            date: "২ ডিসেম্বর ২০২৫, ১০:১৫ AM",
            text: "ভোট কেন্দ্রের অবস্থান ভুল দেখানো হচ্ছে।",
            area: "চট্টগ্রাম-৩",
            voterId: "****9012"
        }
    ],
    chatList: [
        {
            id: 1,
            name: "নাগরিক #১২৩৪",
            lastMessage: "ধন্যবাদ!",
            unread: 2,
            active: true
        },
        {
            id: 2,
            name: "নাগরিক #৫৬৭৮",
            lastMessage: "আমার ভোট...",
            unread: 0,
            active: false
        }
    ],
    chatMessages: [
        {
            sender: "user",
            text: "আমার ভোট কেন্দ্র কোথায়?",
            time: "২:৩০ PM"
        },
        {
            sender: "admin",
            text: "আপনার NID অনুযায়ী আপনার ভোট কেন্দ্র হল ঢাকা সিটি কলেজ।",
            time: "২:৩২ PM"
        },
        {
            sender: "user",
            text: "ধন্যবাদ!",
            time: "২:৩৩ PM"
        },
        {
            sender: "admin",
            text: "আর কোন তথ্য প্রয়োজন হলে জানাবেন।",
            time: "২:৩৪ PM"
        },
        {
            sender: "user",
            text: "ভোটের ফলাফল কখন দেখবো?",
            time: "২:৩৫ PM"
        },
        {
            sender: "admin",
            text: "ভোট শেষ হওয়ার ২ ঘণ্টার মধ্যে প্রকাশ করা হবে।",
            time: "২:৩৬ PM"
        },
        {
            sender: "user",
            text: "ঠিক আছে, ধন্যবাদ।",
            time: "২:৩৭ PM"
        },
        {
            sender: "admin",
            text: "স্বাগতম। নিরাপদ ভোটে থাকার জন্য ধন্যবাদ।",
            time: "২:৩৮ PM"
        }
    ],
    adminProfile: {
        id: "ADMIN-2025-001",
        name: "মোঃ রহিম",
        email: "admin@nirapod-vote.gov.bd",
        lastLogin: "৩ ডিসেম্বর ২০২৫, ৯:০০ AM"
    },
    charts: {
        turnout: {
            labels: ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন'],
            data: [45, 52, 48, 67, 78, 85],
            percentage: [35, 40, 38, 52, 60, 68]
        },
        results: {
            labels: ['জাতীয় দল', 'স্বতন্ত্র প্রার্থী', 'নতুন জোট'],
            data: [450, 380, 220],
            colors: ['#1976d2', '#f57c00', '#d32f2f']
        }
    }
};

// Mock data for ballot form selections
const ballotMockData = {
    ballotTypes: [],
    ballotLocations: []
};

function loadDashboardData() {
    // Load Stats
    const totalBallotsEl = document.getElementById('total-ballots');
    const activeVotesEl = document.getElementById('active-votes');
    const totalVotersEl = document.getElementById('total-voters');
    const votesCastEl = document.getElementById('votes-cast');

    if (totalBallotsEl) totalBallotsEl.textContent = toBengaliNumber(mockDashboardData.stats.totalBallots);
    if (activeVotesEl) activeVotesEl.textContent = toBengaliNumber(mockDashboardData.stats.activeVotes);
    if (totalVotersEl) totalVotersEl.textContent = mockDashboardData.stats.totalVoters;
    if (votesCastEl) votesCastEl.textContent = mockDashboardData.stats.votesCast;

    // Load Live Stats
    const liveStatsContainer = document.getElementById('live-stats-container');
    if (liveStatsContainer) {
        liveStatsContainer.innerHTML = mockDashboardData.liveStats.map(stat => `
            <div class="live-stat-item">
                <span class="live-label">${stat.seat}:</span>
                <span class="live-value">${stat.votes} ভোট</span>
                <span class="live-percentage">${toBengaliNumber(stat.percentage)}%</span>
            </div>
        `).join('');
    }

    // Load Activities
    const activityListContainer = document.getElementById('activity-list-container');
    if (activityListContainer) {
        activityListContainer.innerHTML = mockDashboardData.activities.map(activity => `
            <div class="activity-item">
                <span class="activity-time">${activity.time}</span>
                <p>${activity.text}</p>
            </div>
        `).join('');
    }
}

function loadCandidatesData() {
    const candidatesTableBody = document.getElementById('candidatesTableBody');
    if (candidatesTableBody) {
        // Combine mock candidates with custom candidates
        const allCandidates = [
            ...mockDashboardData.candidates,
            ...customCandidates.filter(c => c) // Filter out null/undefined entries
        ];
        
        candidatesTableBody.innerHTML = allCandidates.map(candidate => {
            const statusBadge = candidate.status === 'active' 
                ? '<span class="badge badge-success">সক্রিয়</span>' 
                : '<span class="badge badge-danger">নিষ্ক্রিয়</span>';
            
            // Handle image error with a default fallback
            const imageSrc = candidate.image || 'assets/images/default-avatar.png';

            return `
                <tr>
                    <td>
                        <div class="candidate-photo">
                            <img src="${imageSrc}" alt="${candidate.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/images/default-avatar.png'">
                        </div>
                    </td>
                    <td>${candidate.name}</td>
                    <td>${candidate.party}</td>
                    <td>
                        <div class="party-symbol">
                            ${candidate.symbolSvg}
                        </div>
                    </td>
                    <td>${candidate.area}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <button class="btn-icon" onclick="viewCandidateDetails(${candidate.id})" title="বিস্তারিত দেখুন">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                            </svg>
                        </button>
                        <button class="btn-icon" onclick="editCandidate(${candidate.id})">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                            </svg>
                        </button>
                        <button class="btn-icon" onclick="deleteCandidate(${candidate.id})">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                            </svg>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }
}

function loadComplaintsData() {
    const complaintsListContainer = document.getElementById('complaints-list-container');
    if (complaintsListContainer) {
        complaintsListContainer.innerHTML = mockDashboardData.complaints.map(complaint => {
            let badgeClass = 'badge-warning';
            let statusText = 'অপেক্ষমান';
            
            if (complaint.status === 'resolved') {
                badgeClass = 'badge-success';
                statusText = 'সমাধানকৃত';
            } else if (complaint.status === 'rejected') {
                badgeClass = 'badge-danger';
                statusText = 'প্রত্যাখ্যাত';
            }

            return `
                <div class="complaint-item">
                    <div class="complaint-header">
                        <h4>অভিযোগ #${complaint.id}</h4>
                        <span class="badge ${badgeClass}">${statusText}</span>
                    </div>
                    <p class="complaint-date">জমা: ${complaint.date}</p>
                    <p class="complaint-text">${complaint.text}</p>
                    <div class="complaint-meta">
                        <span>এলাকা: ${complaint.area}</span>
                        <span>ভোটার ID: ${complaint.voterId}</span>
                    </div>
                    <div class="form-group">
                        <label>প্রশাসক মন্তব্য *</label>
                        <textarea rows="3" placeholder="আপনার প্রতিক্রিয়া লিখুন..." required></textarea>
                    </div>
                    <div class="form-group">
                        <label>প্রমাণপত্র আপলোড করুন</label>
                        <input type="file" accept=".pdf,.jpg,.png">
                    </div>
                    <div class="complaint-actions">
                        <button class="btn btn-sm btn-primary" onclick="resolveComplaint('${complaint.id}')">সমাধান করুন</button>
                        <button class="btn btn-sm btn-danger" onclick="rejectComplaint('${complaint.id}')">প্রত্যাখ্যান করুন</button>
                    </div>
                </div>
            `;
        }).join('');
    }
}

function loadChatData() {
    // Load Chat List
    const chatListContainer = document.getElementById('chat-list-container');
    if (chatListContainer) {
        chatListContainer.innerHTML = `<h3>চ্যাট তালিকা</h3>` + mockDashboardData.chatList.map(chat => `
            <div class="chat-item ${chat.active ? 'active' : ''}" onclick="selectChat(${chat.id})">
                <div class="chat-avatar">
                    <svg viewBox="0 0 24 24" fill="#757575" width="32" height="32">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                </div>
                <div class="chat-info">
                    <h4>${chat.name}</h4>
                    <p>শেষ বার্তা: ${chat.lastMessage}</p>
                </div>
                ${chat.unread > 0 ? `<span class="unread-badge">${toBengaliNumber(chat.unread)}</span>` : ''}
            </div>
        `).join('');
    }

    // Load Chat Messages
    const chatMessagesContainer = document.getElementById('chat-messages-container');
    if (chatMessagesContainer) {
        chatMessagesContainer.innerHTML = mockDashboardData.chatMessages.map(msg => `
            <div class="message ${msg.sender === 'user' ? 'user-message' : 'admin-message'}">
                <p>${msg.text}</p>
                <span class="message-time">${msg.time}</span>
            </div>
        `).join('');
        
        // Scroll to bottom
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    // Load Chat Header
    const activeChat = mockDashboardData.chatList.find(c => c.active);
    if (activeChat) {
        const headerName = document.getElementById('chat-header-name');
        const headerStatus = document.getElementById('chat-header-status');
        if (headerName) headerName.textContent = activeChat.name;
        if (headerStatus) headerStatus.textContent = 'অনলাইন';
    }
}

function loadAdminProfile() {
    const adminInfoContainer = document.getElementById('admin-info-container');
    if (!adminInfoContainer) return;

    const profile = mockDashboardData.adminProfile;
    if (!profile) return;

    adminInfoContainer.innerHTML = `
        <div class="info-item">
            <span class="info-label">প্রশাসক ID:</span>
            <span class="info-value">${profile.id}</span>
        </div>
        <div class="info-item">
            <span class="info-label">নাম:</span>
            <span class="info-value">${profile.name}</span>
        </div>
        <div class="info-item">
            <span class="info-label">ইমেইল:</span>
            <span class="info-value">${profile.email}</span>
        </div>
        <div class="info-item">
            <span class="info-label">শেষ লগইন:</span>
            <span class="info-value">${profile.lastLogin}</span>
        </div>
    `;
}
