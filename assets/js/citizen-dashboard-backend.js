// Citizen Dashboard - Backend Connected Version
// This file shows how to integrate the dashboard with the backend API

document.addEventListener('DOMContentLoaded', async function() {
    // Check if user is logged in
    const token = getAuthToken();
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // Load user data
    await loadUserData();
    
    // Load vote status
    await loadVoteStatus();
    
    // Setup event listeners
    setupEventListeners();
});

// Load user data from backend
async function loadUserData() {
    try {
        const response = await apiRequest('GET_USER', 'GET', null, true);
        if (response.success) {
            const user = response.user;
            
            // Update UI with user data
            const userNameElement = document.getElementById('userName');
            if (userNameElement) {
                userNameElement.textContent = user.name || 'ব্যবহারকারী';
            }
            
            const userNidElement = document.getElementById('userNid');
            if (userNidElement) {
                userNidElement.textContent = user.nid;
            }
            
            // Store user data
            saveUserData(user);
        }
    } catch (error) {
        console.error('Failed to load user data:', error);
        // Token might be invalid, redirect to login
        logout();
    }
}

// Load vote status from backend
async function loadVoteStatus() {
    try {
        const response = await apiRequest('VOTE_STATUS', 'GET', null, true);
        if (response.success) {
            const hasVoted = response.hasVoted;
            
            // Update vote UI based on status
            updateVoteUI(hasVoted);
            
            if (hasVoted) {
                // Load statistics if user has voted
                await loadVoteStatistics();
            }
        }
    } catch (error) {
        console.error('Failed to load vote status:', error);
    }
}

// Load vote statistics from backend
async function loadVoteStatistics() {
    try {
        const response = await apiRequest('VOTE_STATISTICS', 'GET', null, false);
        if (response.success) {
            const stats = response.statistics;
            
            // Update statistics UI
            updateStatisticsUI(stats);
        }
    } catch (error) {
        console.error('Failed to load statistics:', error);
    }
}

// Cast vote via backend
async function castVote(candidate) {
    // Show confirmation
    if (!confirm('আপনি কি নিশ্চিত যে আপনি এই প্রার্থীকে ভোট দিতে চান?')) {
        return;
    }
    
    try {
        showLoadingState();
        
        const response = await apiRequest('CAST_VOTE', 'POST', {
            candidate: candidate
        }, true);
        
        if (response.success) {
            hideLoadingState();
            showAlert('ভোট সফলভাবে সম্পন্ন হয়েছে!', 'success');
            
            // Reload page to show updated status
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    } catch (error) {
        hideLoadingState();
        showAlert(error.message || 'ভোট দিতে ব্যর্থ হয়েছে', 'error');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Vote buttons
    const voteButtons = document.querySelectorAll('.vote-btn');
    voteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const candidate = this.dataset.candidate;
            castVote(candidate);
        });
    });
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

// Update vote UI based on vote status
function updateVoteUI(hasVoted) {
    const voteSection = document.getElementById('voteSection');
    const votedSection = document.getElementById('votedSection');
    
    if (hasVoted) {
        if (voteSection) voteSection.style.display = 'none';
        if (votedSection) votedSection.style.display = 'block';
    } else {
        if (voteSection) voteSection.style.display = 'block';
        if (votedSection) votedSection.style.display = 'none';
    }
}

// Update statistics UI
function updateStatisticsUI(stats) {
    // Update total votes
    const totalVotesElement = document.getElementById('totalVotes');
    if (totalVotesElement) {
        totalVotesElement.textContent = stats.total || 0;
    }
    
    // Update individual candidate votes
    updateCandidateVotes('candidateA', stats.candidateA || 0, stats.total);
    updateCandidateVotes('candidateB', stats.candidateB || 0, stats.total);
    updateCandidateVotes('candidateC', stats.candidateC || 0, stats.total);
    updateCandidateVotes('candidateD', stats.candidateD || 0, stats.total);
}

// Update candidate vote count and percentage
function updateCandidateVotes(candidateId, votes, total) {
    const voteCountElement = document.getElementById(`${candidateId}Votes`);
    const votePercentElement = document.getElementById(`${candidateId}Percent`);
    const progressBarElement = document.getElementById(`${candidateId}Progress`);
    
    if (voteCountElement) {
        voteCountElement.textContent = votes;
    }
    
    const percentage = total > 0 ? ((votes / total) * 100).toFixed(1) : 0;
    
    if (votePercentElement) {
        votePercentElement.textContent = `${percentage}%`;
    }
    
    if (progressBarElement) {
        progressBarElement.style.width = `${percentage}%`;
    }
}

// Show loading state
function showLoadingState() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }
}

// Hide loading state
function hideLoadingState() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

// Show alert message
function showAlert(message, type = 'info') {
    // Use your existing alert system
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) {
        alert(message);
        return;
    }

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    
    let iconClass = '';
    let title = '';
    switch(type) {
        case 'success': 
            iconClass = 'fa-circle-check'; 
            title = '✓ সফল'; 
            break;
        case 'error': 
            iconClass = 'fa-circle-xmark'; 
            title = '✗ ত্রুটি'; 
            break;
    }

    alertDiv.innerHTML = `
        <div class="alert-icon">
            <i class="fa-solid ${iconClass}"></i>
        </div>
        <div class="alert-content">
            <div class="alert-title">${title}</div>
            <div class="alert-message">${message}</div>
        </div>
        <button class="alert-close" onclick="this.parentElement.remove()">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;

    alertContainer.innerHTML = '';
    alertContainer.appendChild(alertDiv);

    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.remove();
        }
    }, 5000);
}
