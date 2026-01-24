// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupNavigationListeners();
    setupMobileMenu();
});

// Initialize dashboard
async function initializeDashboard() {
    console.log('নাগরিক ড্যাশবোর্ড লোড হয়েছে');
    
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    try {
        // Fetch user data from backend
        const userData = await fetchUserData();
        
        if (!userData) {
            localStorage.removeItem('authToken');
            window.location.href = 'login.html';
            return;
        }
        
        // Display user info
        document.getElementById('userName').textContent = userData.name || 'নাগরিক';
        document.getElementById('userArea').textContent = userData.area || 'ঢাকা-১০';
        
        // Update profile section
        updateProfileInfo(userData);
        
        // Load ballots
        await loadBallots();
        
        // Set active section from URL hash or default to voting
        const hash = window.location.hash.substring(1) || 'voting';
        showSection(hash);
        
    } catch (error) {
        console.error('Dashboard initialization error:', error);
        showAlert('ড্যাশবোর্ড লোড করতে ব্যর্থ। অনুগ্রহ করে পুনরায় লগইন করুন।', 'error');
        setTimeout(() => {
            localStorage.removeItem('authToken');
            window.location.href = 'login.html';
        }, 2000);
    }
}

// Fetch user data from backend
async function fetchUserData() {
    try {
        const response = await apiCall(API_ENDPOINTS.AUTH.ME);
        return response.user;
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        return null;
    }
}

// Update profile info in profile section
function updateProfileInfo(userData) {
    const profileInfo = document.querySelector('.profile-info');
    if (profileInfo) {
        profileInfo.innerHTML = `
            <div class="info-row">
                <span class="info-label">নাম:</span>
                <span class="info-value">${userData.name || 'N/A'}</span>
            </div>
            <div class="info-row">
                <span class="info-label">এনআইডি:</span>
                <span class="info-value">${userData.nid || 'N/A'}</span>
            </div>
            <div class="info-row">
                <span class="info-label">ফোন:</span>
                <span class="info-value">${userData.mobile || 'N/A'}</span>
            </div>
            <div class="info-row">
                <span class="info-label">ভোটিং এলাকা:</span>
                <span class="info-value">${userData.area || 'N/A'}</span>
            </div>
        `;
    }
}

// Load ballots from backend
async function loadBallots() {
    const ballotsContainer = document.getElementById('ballotsContainer');
    
    // Show loading state
    ballotsContainer.innerHTML = '<div class="loading-spinner">লোড হচ্ছে...</div>';
    
    try {
        const response = await apiCall(API_ENDPOINTS.VOTING.BALLOTS);
        const ballots = response.ballots;
        
        if (!ballots || ballots.length === 0) {
            ballotsContainer.innerHTML = `
                <div class="empty-state">
                    <p>বর্তমানে কোনো সক্রিয় নির্বাচন নেই।</p>
                </div>
            `;
            return;
        }
        
        // Render ballots
        ballotsContainer.innerHTML = '';
        ballots.forEach(ballot => {
            const ballotCard = createBallotCard(ballot);
            ballotsContainer.appendChild(ballotCard);
        });
        
    } catch (error) {
        console.error('Failed to load ballots:', error);
        ballotsContainer.innerHTML = `
            <div class="error-state">
                <p>ব্যালট লোড করতে ব্যর্থ। অনুগ্রহ করে পেজটি রিফ্রেশ করুন।</p>
            </div>
        `;
    }
}

// Create ballot card HTML
function createBallotCard(ballot) {
    const card = document.createElement('div');
    card.className = `ballot-card ${ballot.hasVoted ? 'voted' : ballot.status}`;
    
    if (ballot.hasVoted) {
        card.innerHTML = `
            <div class="ballot-header">
                <h3>${ballot.title}</h3>
                <span class="ballot-status completed">✓ ভোট প্রদান সম্পন্ন</span>
            </div>
            <div class="voted-message">
                <p>✅ আপনি এই নির্বাচনে ভোট প্রদান করেছেন। ধন্যবাদ!</p>
                <p class="vote-time">ভোট প্রদানের সময়: ${formatDateTime(ballot.votedAt)}</p>
            </div>
        `;
    } else if (ballot.status === 'active') {
        let candidatesHtml = '';
        ballot.candidates.forEach(candidate => {
            candidatesHtml += `
                <div class="candidate-card">
                    <input type="radio" name="vote${ballot.id}" id="candidate${candidate.id}" value="${candidate.id}">
                    <label for="candidate${candidate.id}" class="candidate-label">
                        <img src="${candidate.photo}" alt="প্রার্থী" class="candidate-photo">
                        <div class="candidate-info">
                            <h4>${candidate.name}</h4>
                            <p class="party-name">${candidate.party}</p>
                            <img src="${candidate.symbol}" alt="প্রতীক" class="party-symbol">
                        </div>
                    </label>
                    <button class="btn btn-sm btn-secondary" onclick="openCandidateModal(${candidate.id})" style="margin-top: 10px; width: 100%;">বিস্তারিত দেখুন</button>
                </div>
            `;
        });
        
        card.innerHTML = `
            <div class="ballot-header">
                <h3>${ballot.title}</h3>
                <span class="ballot-status active">সক্রিয়</span>
            </div>
            <div class="ballot-time">
                <p>⏰ ভোটের সময়: ${formatTime(ballot.startTime)} - ${formatTime(ballot.endTime)}</p>
            </div>
            
            <div class="candidates-grid">
                ${candidatesHtml}
            </div>

            <button onclick="submitVote(${ballot.id})" class="btn btn-primary btn-large vote-btn">
                ভোট প্রদান করুন
            </button>
        `;
    } else {
        card.innerHTML = `
            <div class="ballot-header">
                <h3>${ballot.title}</h3>
                <span class="ballot-status upcoming">শীঘ্রই</span>
            </div>
            <div class="ballot-time">
                <p>⏰ ভোটের সময়: ${formatTime(ballot.startTime)} - ${formatTime(ballot.endTime)}</p>
            </div>
            <p class="upcoming-message">এই নির্বাচন এখনও শুরু হয়নি। নির্ধারিত সময়ে ভোট দিতে পারবেন।</p>
        `;
    }
    
    return card;
}

// Submit vote to backend
async function submitVote(ballotId) {
    const selectedCandidate = document.querySelector(`input[name="vote${ballotId}"]:checked`);
    
    if (!selectedCandidate) {
        showAlert('অনুগ্রহ করে একজন প্রার্থী নির্বাচন করুন', 'warning');
        return;
    }
    
    const candidateId = selectedCandidate.value;
    const candidateLabel = selectedCandidate.closest('.candidate-card').querySelector('h4').textContent;
    
    // Confirm vote
    if (!confirm(`আপনি কি নিশ্চিত আপনি "${candidateLabel}" কে ভোট দিতে চান? ভোট দেওয়ার পর এটি পরিবর্তন করা যাবে না।`)) {
        return;
    }
    
    // Show loading
    showAlert('ভোট প্রদান করা হচ্ছে...', 'info');
    
    try {
        const response = await apiCall(API_ENDPOINTS.VOTING.VOTE, {
            method: 'POST',
            body: JSON.stringify({ ballotId, candidateId })
        });
        
        if (response.success) {
            showAlert('✅ আপনার ভোট সফলভাবে প্রদান করা হয়েছে! ধন্যবাদ।', 'success');
            
            // Reload ballots to show updated state
            await loadBallots();
            
            // Ask if user wants to see results
            setTimeout(() => {
                if (confirm('ফলাফল দেখতে চান?')) {
                    showSection('results');
                }
            }, 2000);
        }
        
    } catch (error) {
        console.error('Vote submission error:', error);
        showAlert(error.message || 'ভোট প্রদান ব্যর্থ হয়েছে', 'error');
    }
}

// Format date time
function formatDateTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD') + ', ' + date.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
}

// Format time
function formatTime(timeString) {
    if (!timeString) return '';
    const date = new Date(timeString);
    return date.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
}

// Logout function
function logout() {
    if (confirm('আপনি কি নিশ্চিত লগআউট করতে চান?')) {
        localStorage.removeItem('authToken');
        window.location.href = 'login.html';
    }
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
}

// Setup mobile menu
function setupMobileMenu() {
    const hamburger = document.getElementById('hamburgerMenu');
    const sidebar = document.querySelector('.sidebar');
    
    if (hamburger && sidebar) {
        // Close sidebar when nav item is clicked
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function() {
                closeSidebarMobile();
            });
        });
    }
}

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('mobile-open');
    }
}

// Close sidebar on mobile
function closeSidebarMobile() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.remove('mobile-open');
    }
}

// Show Alert
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;

    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <span class="alert-icon">${icons[type]}</span>
        <span>${message}</span>
    `;

    alertContainer.appendChild(alert);

    setTimeout(() => {
        alert.classList.add('fade-out');
        setTimeout(() => alert.remove(), 300);
    }, 4000);
}

// Candidate modal functions (keep existing)
const candidateData = {
    1: {
        name: "মোঃ আবদুল্লাহ",
        party: "জাতীয় নাগরিক পার্টি (এনসিপি)",
        symbol: "assets/images/bodna.jpg",
        photo: "assets/images/Tamim.jpeg",
        bio: "মোঃ আবদুল্লাহ একজন অভিজ্ঞ রাজনীতিবিদ যিনি গত ২০ বছর ধরে জনসেবায় নিয়োজিত আছেন।",
        manifesto: [
            "শিক্ষার মান উন্নয়ন ও ডিজিটাল শিক্ষা ব্যবস্থা প্রবর্তন",
            "বেকার যুবকদের জন্য কর্মসংস্থান সৃষ্টি",
            "স্বাস্থ্যসেবা সহজলভ্য করা",
            "দুর্নীতি মুক্ত সমাজ গঠন"
        ],
        socialActivities: [
            "সভাপতি, স্থানীয় স্কুল কমিটি",
            "প্রতিষ্ঠাতা, আবদুল্লাহ চ্যারিটেবল ট্রাস্ট"
        ],
        partyHistory: "জাতীয় নাগরিক পার্টি একটি আধুনিক প্রগতিশীল দল।"
    },
    2: {
        name: "সালমা খাতুন",
        party: "জনকল্যাণ পার্টি",
        symbol: "assets/images/honey-bee.jpg",
        photo: "assets/images/Saima_apu.jpeg",
        bio: "সালমা খাতুন একজন সমাজকর্মী ও নারী অধিকার নেত্রী।",
        manifesto: [
            "নারীদের জন্য নিরাপদ কর্মপরিবেশ",
            "ক্ষুদ্র ও মাঝারি শিল্পের বিকাশ"
        ],
        socialActivities: [
            "পরিচালক, নারী উন্নয়ন সংস্থা"
        ],
        partyHistory: "জনকল্যাণ পার্টি সাধারণ মানুষের কল্যাণে কাজ করে।"
    },
    3: {
        name: "রহিম উদ্দিন",
        party: "স্বাধীন প্রার্থী",
        symbol: "assets/images/ant.jpg",
        photo: "assets/images/Taz.jpg",
        bio: "রহিম উদ্দিন একজন সফল ব্যবসায়ী ও সমাজসেবক।",
        manifesto: [
            "স্থানীয় অবকাঠামো উন্নয়ন",
            "বিশুদ্ধ পানি সরবরাহ"
        ],
        socialActivities: [
            "সভাপতি, স্থানীয় বাজার কমিটি"
        ],
        partyHistory: "স্বতন্ত্র প্রার্থী।"
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
                <strong>${candidate.party}</strong>
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
    `;

    modal.style.display = "block";
}

function closeCandidateModal() {
    document.getElementById('candidateModal').style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById('candidateModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

console.log('নিরাপদ ভোট - নাগরিক ড্যাশবোর্ড সফলভাবে লোড হয়েছে ✓');