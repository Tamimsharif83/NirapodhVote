// Admin dashboard JavaScript

let candidateCount = 0;

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // Initialize ballot form
    const ballotForm = document.getElementById('ballotForm');
    if (ballotForm) {
        ballotForm.addEventListener('submit', handleBallotSubmit);
    }
    
    // Initialize notice form
    const noticeForm = document.getElementById('noticeForm');
    if (noticeForm) {
        noticeForm.addEventListener('submit', handleNoticeSubmit);
    }
    
    // Initialize password change form
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', handlePasswordChange);
    }
}

// Section navigation
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    const selectedSection = document.getElementById(sectionId + '-section');
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
    
    // Add active class to clicked nav item
    event.target.closest('.nav-item').classList.add('active');
}

// Add candidate to ballot
function addCandidate() {
    candidateCount++;
    const candidatesList = document.getElementById('candidatesList');
    
    const candidateCard = document.createElement('div');
    candidateCard.className = 'card mt-20';
    candidateCard.id = `candidate-${candidateCount}`;
    candidateCard.innerHTML = `
        <h4>প্রার্থী #${toBengaliNumber(candidateCount)}</h4>
        <div class="form-row">
            <div class="form-group">
                <label>প্রার্থীর নাম *</label>
                <input type="text" required placeholder="প্রার্থীর পূর্ণ নাম">
            </div>
            <div class="form-group">
                <label>রাজনৈতিক দল *</label>
                <input type="text" required placeholder="যেমন: আওয়ামী লীগ">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>প্রার্থীর ছবি</label>
                <input type="file" accept="image/*">
            </div>
            <div class="form-group">
                <label>দলীয় প্রতীক (মার্কা)</label>
                <input type="file" accept="image/*">
            </div>
        </div>
        <button type="button" class="btn btn-danger btn-sm" onclick="removeCandidate(${candidateCount})">
            এই প্রার্থী সরান
        </button>
    `;
    
    candidatesList.appendChild(candidateCard);
}

function removeCandidate(id) {
    const candidateCard = document.getElementById(`candidate-${id}`);
    if (candidateCard && confirm('আপনি কি এই প্রার্থী সরাতে চান?')) {
        candidateCard.remove();
    }
}

// Handle ballot form submission
function handleBallotSubmit(e) {
    e.preventDefault();
    
    const ballotName = document.getElementById('ballotName').value;
    const ballotLocation = document.getElementById('ballotLocation').value;
    
    if (!ballotName || !ballotLocation) {
        showAlert('সকল প্রয়োজনীয় তথ্য পূরণ করুন', 'error');
        return;
    }
    
    showAlert('ব্যালট সফলভাবে তৈরি হয়েছে!', 'success');
    e.target.reset();
    candidateCount = 0;
    document.getElementById('candidatesList').innerHTML = '';
}

function previewBallot() {
    showAlert('ব্যালট পূর্বরূপ শীঘ্রই উপলব্ধ হবে', 'info');
}

// Toggle notice content type
function toggleNoticeContent(type) {
    const textContent = document.getElementById('textContent');
    const pdfContent = document.getElementById('pdfContent');
    
    if (type === 'text') {
        textContent.classList.remove('hidden');
        pdfContent.classList.add('hidden');
    } else {
        textContent.classList.add('hidden');
        pdfContent.classList.remove('hidden');
    }
}

// Handle notice form submission
function handleNoticeSubmit(e) {
    e.preventDefault();
    
    showAlert('নোটিশ সফলভাবে প্রকাশিত হয়েছে!', 'success');
    e.target.reset();
}

// Results management
function calculateResults() {
    showAlert('ফলাফল পুনর্গণনা করা হচ্ছে...', 'info');
    setTimeout(() => {
        showAlert('ফলাফল সফলভাবে গণনা করা হয়েছে!', 'success');
    }, 2000);
}

function exportResults() {
    showAlert('PDF তৈরি করা হচ্ছে...', 'info');
    setTimeout(() => {
        showAlert('ফলাফল PDF হিসেবে রপ্তানি হয়েছে!', 'success');
    }, 2000);
}

function publishResults() {
    if (confirm('আপনি কি ফলাফল প্রকাশ করতে চান? প্রকাশের পর সকল নাগরিক দেখতে পারবে।')) {
        showAlert('ফলাফল সফলভাবে প্রকাশিত হয়েছে!', 'success');
    }
}

// Candidate management
function editCandidate(id) {
    showAlert('প্রার্থী সম্পাদনা ফিচার শীঘ্রই আসছে', 'info');
}

function deleteCandidate(id) {
    if (confirm('আপনি কি এই প্রার্থী মুছে ফেলতে চান?')) {
        showAlert('প্রার্থী সফলভাবে মুছে ফেলা হয়েছে', 'success');
    }
}

// Chat functionality
function sendMessage() {
    const messageInput = document.getElementById('chatMessage');
    if (!messageInput || !messageInput.value.trim()) return;
    
    const chatMessages = document.querySelector('.chat-messages');
    const message = messageInput.value;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message admin-message';
    messageDiv.innerHTML = `
        <p>${message}</p>
        <span class="message-time">${new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}</span>
    `;
    
    chatMessages.appendChild(messageDiv);
    messageInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Password change
function handlePasswordChange(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    if (newPassword !== confirmNewPassword) {
        showAlert('নতুন পাসওয়ার্ড মিলছে না', 'error');
        return;
    }
    
    if (newPassword.length < 8) {
        showAlert('পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে', 'error');
        return;
    }
    
    showAlert('পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!', 'success');
    e.target.reset();
}
