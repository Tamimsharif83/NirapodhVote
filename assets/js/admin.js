let candidateCount = 0;

// Custom Ballot Arrays (20 items each)
let customBallotNames = new Array(20);
let customBallotLocations = new Array(20);
let ballotNameCount = 0;
let ballotLocationCount = 0;

// Custom Candidates Array (50 items max)
let customCandidates = new Array(50);
let customCandidateCount = 0;

// Custom Notices Array (100 items max)
let customNotices = new Array(100);
let customNoticeCount = 0;

// ===== TOAST NOTIFICATION SYSTEM =====
function showAlert(title, type = 'info', duration = 3000) {
    const alertContainer = document.getElementById('alert-container') || createAlertContainer();
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <div class="alert-content">
            <span class="alert-message">${title}</span>
            <button class="alert-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    alertContainer.appendChild(alert);
    
    setTimeout(() => {
        alert.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 300);
    }, duration);
}

function createAlertContainer() {
    const container = document.createElement('div');
    container.id = 'alert-container';
    container.className = 'alert-container';
    document.body.appendChild(container);
    return container;
}

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    loadDashboardData(); // Load mock data
    loadCandidatesData(); // Load mock candidates data
    loadComplaintsData(); // Load mock complaints data
    loadChatData(); // Load mock chat data
    loadAdminProfile(); // Load mock admin info
    renderCharts(); // Render charts
    populateBallotFormOptions(); // Load ballot form options from mock data
    loadPublishedNotices(); // Load published notices

    const ballotForm = document.getElementById('ballotForm');
    if (ballotForm) {
        ballotForm.addEventListener('submit', handleBallotSubmit);
    }
    
    const noticeForm = document.getElementById('noticeForm');
    if (noticeForm) {
        noticeForm.addEventListener('submit', handleNoticeSubmit);
    }
    
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', handlePasswordChange);
    }
    
    const chatMessageInput = document.getElementById('chatMessage');
    if (chatMessageInput) {
        chatMessageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
}

function populateBallotFormOptions() {
    const ballotNameSelect = document.getElementById('ballotName');
    const ballotLocationSelect = document.getElementById('ballotLocation');

    if (!ballotNameSelect || !ballotLocationSelect || !ballotMockData) return;

    const ballotTypeOptions = ballotMockData.ballotTypes || [];
    const ballotLocationOptions = ballotMockData.ballotLocations || [];
    
    // Add custom ballot names
    const allBallotTypes = [...ballotTypeOptions];
    customBallotNames.forEach((name, index) => {
        if (name) {
            allBallotTypes.push({ value: `custom_ballot_${index}`, label: name });
        }
    });
    
    // Deduplicate ballot names - keep only unique labels
    const uniqueBallotTypes = [];
    const seenLabels = new Set();
    allBallotTypes.forEach(option => {
        if (!seenLabels.has(option.label)) {
            uniqueBallotTypes.push(option);
            seenLabels.add(option.label);
        }
    });
    
    // Add custom ballot locations
    const allBallotLocations = [...ballotLocationOptions];
    customBallotLocations.forEach((location, index) => {
        if (location) {
            allBallotLocations.push({ value: `custom_location_${index}`, label: location });
        }
    });

    ballotNameSelect.innerHTML = ['<option value="">নির্বাচন করুন</option>',
        ...uniqueBallotTypes.map(option => `<option value="${option.value}">${option.label}</option>`) ].join('');

    ballotLocationSelect.innerHTML = ['<option value="">এলাকা নির্বাচন করুন</option>',
        ...allBallotLocations.map(option => `<option value="${option.value}">${option.label}</option>`) ].join('');
}

function renderCharts() {
    if (!mockDashboardData.charts) return;

    // Turnout Chart (Line Chart)
    const turnoutCtx = document.getElementById('turnoutChart');
    if (turnoutCtx && typeof Chart !== 'undefined') {
        const turnoutData = mockDashboardData.charts.turnout;
        
        new Chart(turnoutCtx, {
            type: 'line',
            data: {
                labels: turnoutData.labels,
                datasets: [{
                    label: 'টার্নআউট শতাংশ (%)',
                    data: turnoutData.percentage,
                    borderColor: '#1976d2',
                    backgroundColor: 'rgba(25, 118, 210, 0.05)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#1976d2',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            font: {
                                size: 12,
                                family: "'Roboto', sans-serif"
                            },
                            color: '#666',
                            padding: 12
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            font: {
                                size: 11
                            },
                            color: '#999'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                size: 11
                            },
                            color: '#999'
                        },
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    }
                }
            }
        });
    }

    // Results Chart (Doughnut Chart)
    const resultCtx = document.getElementById('resultChart');
    if (resultCtx && typeof Chart !== 'undefined') {
        const resultData = mockDashboardData.charts.results;
        
        new Chart(resultCtx, {
            type: 'doughnut',
            data: {
                labels: resultData.labels,
                datasets: [{
                    data: resultData.data,
                    backgroundColor: [
                        '#1976d2',
                        '#f57c00',
                        '#d32f2f'
                    ],
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: {
                                size: 11,
                                family: "'Roboto', sans-serif"
                            },
                            color: '#666',
                            padding: 12,
                            usePointStyle: true
                        }
                    }
                },
                cutout: '62%'
            }
        });
    }
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    const selectedSection = document.getElementById(sectionId + '-section');
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
    
    event.target.closest('.nav-item').classList.add('active');
}

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
                <input type="text" class="candidate-name" required placeholder="প্রার্থীর পূর্ণ নাম">
            </div>
            <div class="form-group">
                <label>রাজনৈতিক দল *</label>
                <input type="text" class="candidate-party" required placeholder="যেমন: জাতীয় নাগরিক পার্টি">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>প্রার্থীর ছবি</label>
                <input type="file" class="candidate-image" accept="image/*">
            </div>
            <div class="form-group">
                <label>দলীয় প্রতীক (মার্কা)</label>
                <input type="file" class="candidate-symbol" accept="image/*">
            </div>
        </div>
        
        <!-- New Fields -->
        <div class="form-group">
            <label>জীবনী (Bio)</label>
            <textarea class="candidate-bio" rows="3" placeholder="প্রার্থীর সংক্ষিপ্ত জীবনী..."></textarea>
        </div>
        <div class="form-group">
            <label>নির্বাচনী ইশতেহার (Manifesto)</label>
            <textarea class="candidate-manifesto" rows="3" placeholder="ইশতেহারের পয়েন্টগুলো লিখুন..."></textarea>
        </div>
        <div class="form-group">
            <label>সামাজিক কর্মকাণ্ড</label>
            <textarea class="candidate-social" rows="2" placeholder="সামাজিক কর্মকাণ্ডের বিবরণ..."></textarea>
        </div>
        <div class="form-group">
            <label>দলীয় ইতিহাস</label>
            <textarea class="candidate-history" rows="2" placeholder="দলের সংক্ষিপ্ত ইতিহাস..."></textarea>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label>নির্বাচনী এলাকা *</label>
                <input type="text" class="candidate-area" required placeholder="যেমন: ঢাকা-১০">
            </div>
            <div class="form-group">
                <label>অবস্থা</label>
                <select class="candidate-status">
                    <option value="active">সক্রিয়</option>
                    <option value="inactive">নিষ্ক্রিয়</option>
                </select>
            </div>
        </div>

        <div style="display: flex; gap: 10px;">
            <button type="button" class="btn btn-success btn-sm" onclick="submitCandidate(${candidateCount})">
                প্রার্থী যোগ করুন
            </button>
            <button type="button" class="btn btn-danger btn-sm" onclick="removeCandidate(${candidateCount})">
                এই প্রার্থী সরান
            </button>
        </div>
    `;
    
    candidatesList.appendChild(candidateCard);
}

function submitCandidate(id) {
    const candidateCard = document.getElementById(`candidate-${id}`);
    
    // Get form values
    const name = candidateCard.querySelector('.candidate-name').value.trim();
    const party = candidateCard.querySelector('.candidate-party').value.trim();
    const area = candidateCard.querySelector('.candidate-area').value.trim();
    const bio = candidateCard.querySelector('.candidate-bio').value.trim();
    const status = candidateCard.querySelector('.candidate-status').value;
    
    // Validation
    if (!name || !party || !area) {
        showAlert('অনুগ্রহ করে প্রার্থীর নাম, দল এবং এলাকা পূরণ করুন', 'error');
        return;
    }
    
    if (customCandidateCount >= 50) {
        showAlert('সর্বোচ্চ ৫০ জন প্রার্থী যোগ করা যায়', 'warning');
        return;
    }
    
    // Get image files
    const imageInput = candidateCard.querySelector('.candidate-image');
    const symbolInput = candidateCard.querySelector('.candidate-symbol');
    
    // Create FormData to read file
    const reader1 = imageInput.files[0] ? new FileReader() : null;
    const reader2 = symbolInput.files[0] ? new FileReader() : null;
    
    let imageData = 'assets/images/default-avatar.png';
    let symbolData = '<img src="assets/images/powerful-symbol-unity-anti-corruption-day_968957-12635.avif" alt="Party Symbol" width="20" height="20">';
    
    // Read candidate image if exists
    if (reader1) {
        reader1.onload = function(e) {
            imageData = e.target.result;
            
            // Read symbol image if exists
            if (reader2) {
                reader2.onload = function(e2) {
                    symbolData = `<img src="${e2.target.result}" alt="Party Symbol" width="20" height="20">`;
                    saveCandidateToArray(id, name, party, area, bio, status, imageData, symbolData);
                };
                reader2.readAsDataURL(symbolInput.files[0]);
            } else {
                saveCandidateToArray(id, name, party, area, bio, status, imageData, symbolData);
            }
        };
        reader1.readAsDataURL(imageInput.files[0]);
    } else if (reader2) {
        reader2.onload = function(e) {
            symbolData = `<img src="${e.target.result}" alt="Party Symbol" width="20" height="20">`;
            saveCandidateToArray(id, name, party, area, bio, status, imageData, symbolData);
        };
        reader2.readAsDataURL(symbolInput.files[0]);
    } else {
        saveCandidateToArray(id, name, party, area, bio, status, imageData, symbolData);
    }
}

function saveCandidateToArray(id, name, party, area, bio, status, imageData, symbolData) {
    const candidate = {
        id: customCandidateCount + 1000, // Offset to distinguish from mock data
        name: name,
        party: party,
        area: area,
        bio: bio,
        status: status,
        image: imageData,
        symbolSvg: symbolData,
        phone: '',
        email: ''
    };
    
    customCandidates[customCandidateCount] = candidate;
    customCandidateCount++;
    
    showAlert(`"${name}" প্রার্থী সফলভাবে যোগ হয়েছে এবং প্রার্থী তালিকায় প্রদর্শিত হচ্ছে`, 'success');
    
    // Remove the form after submission
    removeCandidate(id);
    
    // Reload the candidates table
    loadCandidatesData();
}

function removeCandidate(id) {
    const candidateCard = document.getElementById(`candidate-${id}`);
    if (candidateCard) {
        candidateCard.remove();
    }
}

function handleBallotSubmit(e) {
    e.preventDefault();
    
    const ballotName = document.getElementById('ballotName').value;
    const ballotLocation = document.getElementById('ballotLocation').value;
    
    if (!ballotName || !ballotLocation) {
        showAlert('সকল প্রয়োজনীয় তথ্য পূরণ করুন', 'error');
        return;
    }
    
    const btn = e.target.querySelector('button[type="submit"]');
    if (btn) {
        btn.disabled = true;
        btn.classList.add('btn-loading');
        const originalText = btn.textContent;
        btn.textContent = 'তৈরি হচ্ছে...';
        
        setTimeout(() => {
            showAlert('ব্যালট সফলভাবে তৈরি হয়েছে!', 'success');
            btn.disabled = false;
            btn.classList.remove('btn-loading');
            btn.textContent = originalText;
            
            e.target.reset();
            candidateCount = 0;
            document.getElementById('candidatesList').innerHTML = '';
        }, 1500);
    }
}

function previewBallot() {
    showAlert('ব্যালট পূর্বরূপ শীঘ্রই উপলব্ধ হবে', 'info');
}

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

function handleNoticeSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('noticeTitle').value.trim();
    const type = document.getElementById('noticeType').value;
    const contentType = document.querySelector('input[name="contentType"]:checked').value;
    const message = document.getElementById('noticeMessage').value.trim();
    const pdfFile = document.getElementById('noticePdf').files[0];
    
    // Validation
    if (!title || !type) {
        showAlert('শিরোনাম এবং নোটিশ ধরন পূরণ করুন', 'error');
        return;
    }
    
    if (contentType === 'text' && !message) {
        showAlert('বার্তা পূরণ করুন', 'error');
        return;
    }
    
    if (contentType === 'pdf' && !pdfFile) {
        showAlert('PDF ফাইল আপলোড করুন', 'error');
        return;
    }
    
    if (customNoticeCount >= 100) {
        showAlert('সর্বোচ্চ ১০০ নোটিশ প্রকাশ করা যায়', 'warning');
        return;
    }
    
    const btn = e.target.querySelector('button[type="submit"]');
    if (btn) {
        btn.disabled = true;
        btn.classList.add('btn-loading');
        const originalText = btn.textContent;
        btn.textContent = 'প্রকাশিত হচ্ছে...';
        
        // Handle PDF file if exists
        if (contentType === 'pdf' && pdfFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                saveNoticeToArray(title, type, contentType, message, e.target.result);
                resetNoticeForm(btn, originalText);
                loadPublishedNotices();
            };
            reader.readAsDataURL(pdfFile);
        } else {
            setTimeout(() => {
                saveNoticeToArray(title, type, contentType, message, null);
                resetNoticeForm(btn, originalText);
                loadPublishedNotices();
            }, 1500);
        }
    }
}

function saveNoticeToArray(title, type, contentType, message, pdfData) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('bn-BD', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const notice = {
        id: customNoticeCount + 1000,
        title: title,
        type: type,
        contentType: contentType,
        message: message,
        pdfData: pdfData,
        date: dateStr,
        createdAt: new Date()
    };
    
    customNotices[customNoticeCount] = notice;
    customNoticeCount++;
    
    showAlert(`"${title}" নোটিশ সফলভাবে প্রকাশিত হয়েছে!`, 'success');
}

function resetNoticeForm(btn, originalText) {
    setTimeout(() => {
        document.getElementById('noticeForm').reset();
        document.getElementById('textContent').classList.remove('hidden');
        document.getElementById('pdfContent').classList.add('hidden');
        btn.disabled = false;
        btn.classList.remove('btn-loading');
        btn.textContent = originalText;
    }, 500);
}

function loadPublishedNotices() {
    const noticeList = document.querySelector('.notice-list');
    let html = '';
    
    // Add custom notices first (newest first)
    for (let i = customNoticeCount - 1; i >= 0; i--) {
        const notice = customNotices[i];
        if (notice) {
            html += renderNoticeItem(notice, true);
        }
    }
    
    // Mock notice data (if any)
    const mockNotices = [
        {
            id: 1,
            title: 'ভোটিং সময়সূচী পরিবর্তন',
            type: 'urgent',
            message: 'আগামীকাল ভোটিং সময় ৮টা থেকে ৬টা পর্যন্ত বর্ধিত করা হয়েছে...',
            date: '৩ ডিসেম্বর ২০২৫, ১০:৩০ AM'
        }
    ];
    
    // Add mock notices if no custom notices
    if (customNoticeCount === 0) {
        mockNotices.forEach(notice => {
            html += renderNoticeItem(notice, false);
        });
    }
    
    noticeList.innerHTML = html || '<p style="text-align: center; color: #999;">কোন নোটিশ প্রকাশিত হয়নি</p>';
}

function renderNoticeItem(notice, isCustom) {
    const badgeClass = `badge-${notice.type}`;
    const typeText = getNoticeTypeText(notice.type);
    const preview = notice.message ? notice.message.substring(0, 100) + '...' : 'PDF ফাইল';
    
    let html = `
        <div class="notice-item">
            <div class="notice-header">
                <h4>${notice.title}</h4>
                <span class="badge ${badgeClass}">${typeText}</span>
            </div>
            <p class="notice-date">প্রকাশিত: ${notice.date}</p>
            <p class="notice-preview">${preview}</p>
            <div class="notice-actions">
    `;
    
    if (isCustom) {
        html += `
                <button class="btn btn-sm btn-info" onclick="viewNoticeDetails(${notice.id})">বিস্তারিত</button>
                <button class="btn btn-sm btn-secondary" onclick="editNotice(${notice.id})">সম্পাদনা</button>
                <button class="btn btn-sm btn-danger" onclick="deleteNotice(${notice.id})">মুছে ফেলুন</button>
        `;
    } else {
        html += `
                <button class="btn btn-sm btn-info" onclick="viewNoticeDetails(${notice.id})">বিস্তারিত</button>
                <button class="btn btn-sm btn-secondary" disabled>সম্পাদনা</button>
                <button class="btn btn-sm btn-danger" disabled>মুছে ফেলুন</button>
        `;
    }
    
    html += `
            </div>
        </div>
    `;
    
    return html;
}

function getNoticeTypeText(type) {
    const types = {
        'general': 'সাধারণ',
        'urgent': 'জরুরী',
        'schedule': 'সময়সূচী',
        'result': 'ফলাফল'
    };
    return types[type] || type;
}

function viewNoticeDetails(noticeId) {
    let notice = null;
    
    if (noticeId >= 1000) {
        const customIndex = customNotices.findIndex(n => n && n.id === noticeId);
        if (customIndex !== -1) {
            notice = customNotices[customIndex];
        }
    }
    
    if (!notice) {
        showAlert('নোটিশ খুঁজে পাওয়া যায়নি', 'error');
        return;
    }
    
    const modal = document.getElementById('candidateModal');
    const modalBody = document.getElementById('candidateModalBody');
    const modalHeader = document.querySelector('#candidateModal .modal-header h2');
    
    modalHeader.textContent = 'নোটিশ বিস্তারিত';
    
    let contentHtml = '';
    if (notice.contentType === 'pdf' && notice.pdfData) {
        contentHtml = `<iframe src="${notice.pdfData}" width="100%" height="600"></iframe>`;
    } else {
        contentHtml = `<p style="white-space: pre-wrap; line-height: 1.6;">${notice.message}</p>`;
    }
    
    modalBody.innerHTML = `
        <div class="notice-detail">
            <h3>${notice.title}</h3>
            <p style="color: #666; font-size: 0.9em;">প্রকাশিত: ${notice.date}</p>
            <p style="margin-top: 10px;"><strong>ধরন:</strong> ${getNoticeTypeText(notice.type)}</p>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
                ${contentHtml}
            </div>
        </div>
    `;
    
    modal.style.display = "block";
}

function editNotice(noticeId) {
    const customIndex = customNotices.findIndex(n => n && n.id === noticeId);
    if (customIndex === -1) {
        showAlert('নোটিশ খুঁজে পাওয়া যায়নি', 'error');
        return;
    }
    
    const notice = customNotices[customIndex];
    
    const modal = document.getElementById('candidateModal');
    const modalBody = document.getElementById('candidateModalBody');
    const modalHeader = document.querySelector('#candidateModal .modal-header h2');
    
    modalHeader.textContent = 'নোটিশ সম্পাদনা';
    
    modalBody.innerHTML = `
        <form id="editNoticeForm" class="candidate-edit-form">
            <div class="form-group">
                <label for="editNoticeTitle">নোটিশ শিরোনাম *</label>
                <input type="text" id="editNoticeTitle" value="${notice.title}" required>
            </div>
            
            <div class="form-group">
                <label for="editNoticeType">নোটিশ ধরন *</label>
                <select id="editNoticeType" required>
                    <option value="general" ${notice.type === 'general' ? 'selected' : ''}>সাধারণ</option>
                    <option value="urgent" ${notice.type === 'urgent' ? 'selected' : ''}>জরুরী</option>
                    <option value="schedule" ${notice.type === 'schedule' ? 'selected' : ''}>সময়সূচী</option>
                    <option value="result" ${notice.type === 'result' ? 'selected' : ''}>ফলাফল</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="editNoticeMessage">বার্তা *</label>
                <textarea id="editNoticeMessage" rows="6" required>${notice.message || ''}</textarea>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn btn-primary" data-notice-id="${noticeId}" data-notice-index="${customIndex}">আপডেট করুন</button>
                <button type="button" class="btn btn-secondary" onclick="closeCandidateModal()">বাতিল করুন</button>
            </div>
        </form>
    `;
    
    const editForm = document.getElementById('editNoticeForm');
    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const btn = e.target.querySelector('button[type="submit"]');
        const noticeIndex = parseInt(btn.dataset.noticeIndex);
        
        btn.disabled = true;
        btn.classList.add('btn-loading');
        const originalText = btn.textContent;
        btn.textContent = 'আপডেট হচ্ছে...';
        
        setTimeout(() => {
            customNotices[noticeIndex].title = document.getElementById('editNoticeTitle').value;
            customNotices[noticeIndex].type = document.getElementById('editNoticeType').value;
            customNotices[noticeIndex].message = document.getElementById('editNoticeMessage').value;
            
            showAlert('নোটিশ সফলভাবে আপডেট হয়েছে', 'success');
            closeCandidateModal();
            loadPublishedNotices();
            
            btn.disabled = false;
            btn.classList.remove('btn-loading');
            btn.textContent = originalText;
        }, 1500);
    });
    
    modal.style.display = "block";
}

function deleteNotice(noticeId) {
    if (confirm('আপনি কি এই নোটিশ মুছে ফেলতে চান?')) {
        const customIndex = customNotices.findIndex(n => n && n.id === noticeId);
        if (customIndex !== -1) {
            customNotices[customIndex] = null;
            customNoticeCount--;
            showAlert('নোটিশ সফলভাবে মুছে ফেলা হয়েছে', 'success');
            loadPublishedNotices();
        }
    }
}

function calculateResults() {
    const btn = event?.target || null;
    const originalText = btn?.textContent || 'গণনা করুন';
    
    if (btn) {
        btn.disabled = true;
        btn.classList.add('btn-loading');
        btn.textContent = 'গণনা চলছে...';
    }
    
    setTimeout(() => {
        showAlert('ফলাফল সফলভাবে গণনা করা হয়েছে!', 'success');
        if (btn) {
            btn.disabled = false;
            btn.classList.remove('btn-loading');
            btn.textContent = originalText;
        }
    }, 1500);
}

function exportResults() {
    const btn = event?.target || null;
    const originalText = btn?.textContent || 'PDF রপ্তানি';
    
    if (btn) {
        btn.disabled = true;
        btn.classList.add('btn-loading');
        btn.textContent = 'রপ্তানি হচ্ছে...';
    }
    
    setTimeout(() => {
        showAlert('ফলাফল PDF হিসেবে রপ্তানি হয়েছে!', 'success');
        if (btn) {
            btn.disabled = false;
            btn.classList.remove('btn-loading');
            btn.textContent = originalText;
        }
    }, 1500);
}

function publishResults() {
    if (confirm('আপনি কি ফলাফল প্রকাশ করতে চান? প্রকাশের পর সকল নাগরিক দেখতে পারবে।')) {
        const btn = event?.target || null;
        const originalText = btn?.textContent || 'প্রকাশ করুন';
        
        if (btn) {
            btn.disabled = true;
            btn.classList.add('btn-loading');
            btn.textContent = 'প্রকাশিত হচ্ছে...';
        }
        
        setTimeout(() => {
            showAlert('ফলাফল সফলভাবে প্রকাশিত হয়েছে!', 'success');
            if (btn) {
                btn.disabled = false;
                btn.classList.remove('btn-loading');
                btn.textContent = originalText;
            }
        }, 1500);
    }
}

function editCandidate(id) {
    // Check if it's a custom candidate (ID >= 1000)
    let candidate = null;
    let isCustom = id >= 1000;
    let customIndex = -1;
    
    if (isCustom) {
        customIndex = customCandidates.findIndex(c => c && c.id === id);
        if (customIndex !== -1) {
            candidate = customCandidates[customIndex];
        }
    } else {
        candidate = mockDashboardData.candidates.find(c => c.id === id);
    }
    
    if (!candidate) {
        showAlert('প্রার্থীর তথ্য পাওয়া যায়নি', 'error');
        return;
    }

    const modal = document.getElementById('candidateModal');
    const modalBody = document.getElementById('candidateModalBody');
    const modalHeader = document.querySelector('#candidateModal .modal-header h2');

    modalHeader.textContent = 'প্রার্থী সম্পাদনা';

    modalBody.innerHTML = `
        <form id="editCandidateForm" class="candidate-edit-form">
            <div class="form-group">
                <label for="editCandidateName">নাম *</label>
                <input type="text" id="editCandidateName" value="${candidate.name}" required>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="editCandidateParty">দল *</label>
                    <input type="text" id="editCandidateParty" value="${candidate.party}" required>
                </div>
                <div class="form-group">
                    <label for="editCandidateArea">এলাকা *</label>
                    <input type="text" id="editCandidateArea" value="${candidate.area}" required>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="editCandidatePhone">ফোন নম্বর</label>
                    <input type="tel" id="editCandidatePhone" value="${candidate.phone || ''}">
                </div>
                <div class="form-group">
                    <label for="editCandidateEmail">ইমেইল</label>
                    <input type="email" id="editCandidateEmail" value="${candidate.email || ''}">
                </div>
            </div>

            <div class="form-group">
                <label for="editCandidateStatus">অবস্থা *</label>
                <select id="editCandidateStatus" required>
                    <option value="active" ${candidate.status === 'active' ? 'selected' : ''}>সক্রিয়</option>
                    <option value="inactive" ${candidate.status === 'inactive' ? 'selected' : ''}>নিষ্ক্রিয়</option>
                </select>
            </div>

            <div class="form-group">
                <label for="editCandidateBio">জীবনী</label>
                <textarea id="editCandidateBio" rows="4" placeholder="প্রার্থীর জীবনী লিখুন...">${candidate.bio || ''}</textarea>
            </div>

            <div class="form-actions">
                <button type="submit" class="btn btn-primary" data-candidate-id="${id}" data-is-custom="${isCustom}" data-custom-index="${customIndex}">পরিবর্তন সংরক্ষণ করুন</button>
                <button type="button" class="btn btn-secondary" onclick="closeCandidateModal()">বাতিল করুন</button>
            </div>
        </form>
    `;

    // Add form submit handler
    const editForm = document.getElementById('editCandidateForm');
    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const btn = e.target.querySelector('button[type="submit"]');
        if (btn) {
            btn.disabled = true;
            btn.classList.add('btn-loading');
            const originalText = btn.textContent;
            btn.textContent = 'সংরক্ষণ হচ্ছে...';
            
            const candidateId = parseInt(btn.dataset.candidateId);
            const isCustomCandidate = btn.dataset.isCustom === 'true';
            const customIdx = parseInt(btn.dataset.customIndex);
            
            setTimeout(() => {
                // Get the candidate reference
                let candidateToUpdate = null;
                if (isCustomCandidate && customIdx !== -1) {
                    candidateToUpdate = customCandidates[customIdx];
                } else if (!isCustomCandidate) {
                    candidateToUpdate = mockDashboardData.candidates.find(c => c.id === candidateId);
                }
                
                if (candidateToUpdate) {
                    // Update candidate data
                    candidateToUpdate.name = document.getElementById('editCandidateName').value;
                    candidateToUpdate.party = document.getElementById('editCandidateParty').value;
                    candidateToUpdate.area = document.getElementById('editCandidateArea').value;
                    candidateToUpdate.phone = document.getElementById('editCandidatePhone').value;
                    candidateToUpdate.email = document.getElementById('editCandidateEmail').value;
                    candidateToUpdate.status = document.getElementById('editCandidateStatus').value;
                    candidateToUpdate.bio = document.getElementById('editCandidateBio').value;

                    // Reload candidates table
                    loadCandidatesData();
                    
                    showAlert('প্রার্থীর তথ্য সফলভাবে আপডেট হয়েছে', 'success');
                    closeCandidateModal();
                }
                
                btn.disabled = false;
                btn.classList.remove('btn-loading');
                btn.textContent = originalText;
            }, 1500);
        }
    });

    modal.style.display = "block";
}

function deleteCandidate(id) {
    if (confirm('আপনি কি এই প্রার্থী মুছে ফেলতে চান?')) {
        // Check if it's a custom candidate (ID >= 1000)
        if (id >= 1000) {
            const customIndex = customCandidates.findIndex(c => c && c.id === id);
            if (customIndex !== -1) {
                customCandidates[customIndex] = null;
                customCandidateCount--;
                showAlert('প্রার্থী সফলভাবে মুছে ফেলা হয়েছে', 'success');
                loadCandidatesData();
            }
        } else {
            // Mock candidate - just show message
            showAlert('প্রার্থী সফলভাবে মুছে ফেলা হয়েছে', 'success');
        }
    }
}

function addNewBallotOption() {
    const newBallotNameInput = document.getElementById('newBallotName');
    const newBallotLocationInput = document.getElementById('newBallotLocation');
    
    const ballotName = (newBallotNameInput?.value || '').trim();
    const ballotLocation = (newBallotLocationInput?.value || '').trim();
    
    // Validation
    if (!ballotName && !ballotLocation) {
        showAlert('অনুগ্রহ করে ব্যালটের নাম বা নির্বাচন এলাকা লিখুন', 'warning');
        return;
    }
    
    if (ballotName && ballotLocation) {
        // Check for duplicate combination (same ballot name + same area)
        for (let i = 0; i < ballotNameCount; i++) {
            for (let j = 0; j < ballotLocationCount; j++) {
                if (customBallotNames[i] === ballotName && customBallotLocations[j] === ballotLocation) {
                    showAlert(`"${ballotName}" এবং "${ballotLocation}" এই সংমিশ্রণ ইতিমধ্যে রয়েছে। অন্য এলাকা নির্বাচন করুন।`, 'error');
                    return;
                }
            }
        }
    }
    
    if (ballotName && ballotNameCount >= 20) {
        showAlert('সর্বোচ্চ ২০টি ব্যালটের নাম যোগ করা যায়', 'warning');
        return;
    }
    
    if (ballotLocation && ballotLocationCount >= 20) {
        showAlert('সর্বোচ্চ ২০টি নির্বাচন এলাকা যোগ করা যায়', 'warning');
        return;
    }
    
    // Add ballot name
    if (ballotName) {
        customBallotNames[ballotNameCount] = ballotName;
        ballotNameCount++;
        newBallotNameInput.value = '';
        showAlert(`"${ballotName}" ব্যালটের নাম যোগ হয়েছে`, 'success');
    }
    
    // Add ballot location
    if (ballotLocation) {
        customBallotLocations[ballotLocationCount] = ballotLocation;
        ballotLocationCount++;
        newBallotLocationInput.value = '';
        showAlert(`"${ballotLocation}" নির্বাচন এলাকা যোগ হয়েছে`, 'success');
    }
    
    // Update the dropdowns
    populateBallotFormOptions();
}

function sendMessage() {
    const messageInput = document.getElementById('chatMessage');
    const sendBtn = document.querySelector('.chat-input-area button');
    
    if (!messageInput || !messageInput.value.trim()) return;
    
    const chatMessages = document.querySelector('.chat-messages');
    const message = messageInput.value;
    
    // Show loading state
    if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.classList.add('btn-loading');
    }
    messageInput.disabled = true;
    
    setTimeout(() => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message admin-message';
        messageDiv.innerHTML = `
            <p>${message}</p>
            <span class="message-time">${new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}</span>
        `;
        
        chatMessages.appendChild(messageDiv);
        messageInput.value = '';
        messageInput.disabled = false;
        
        if (sendBtn) {
            sendBtn.disabled = false;
            sendBtn.classList.remove('btn-loading');
        }
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
}

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
    
    const btn = e.target.querySelector('button[type="submit"]');
    if (btn) {
        btn.disabled = true;
        btn.classList.add('btn-loading');
        const originalText = btn.textContent;
        btn.textContent = 'পরিবর্তন হচ্ছে...';
        
        setTimeout(() => {
            showAlert('পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!', 'success');
            btn.disabled = false;
            btn.classList.remove('btn-loading');
            btn.textContent = originalText;
            e.target.reset();
        }, 1500);
    }
}

const candidateData = {
    1: {
        name: "ওসমান হাদি",
        party: "স্বতন্ত্র প্রার্থী",
        symbol: "assets/images/powerful-symbol-unity-anti-corruption-day_968957-12635.avif",
        photo: "assets/images/WhatsApp Image 2025-12-27 at 11.35.15 PM.jpeg",
        bio: "ওসমান হাদি একজন সমাজসেবক ও রাজনীতিবিদ। তিনি দীর্ঘ দুই দশক ধরে ঢাকা-৮ আসনের মানুষের কল্যাণে কাজ করে যাচ্ছেন। দুর্নীতিমুক্ত সমাজ গড়ার প্রত্যয়ে তিনি এবার স্বতন্ত্র প্রার্থী হিসেবে নির্বাচনে অংশগ্রহণ করছেন।",
        manifesto: [
            "দুর্নীতিমুক্ত প্রশাসনিক ব্যবস্থা নিশ্চিত করা",
            "যুব সমাজের জন্য কর্মসংস্থান সৃষ্টি",
            "আধুনিক বর্জ্য ব্যবস্থাপনা ও পরিচ্ছন্ন এলাকা"
        ],
        socialActivities: [
            "প্রতিষ্ঠাতা, সবুজ বাংলা ফাউন্ডেশন",
            "প্রধান উপদেষ্টা, এলাকা উন্নয়ন কমিটি"
        ],
        partyHistory: "স্বতন্ত্র প্রার্থী হিসেবে তিনি কোনো নির্দিষ্ট রাজনৈতিক দলের অন্তর্ভুক্ত নন, তবে তিনি মুক্তিযুদ্ধের চেতনায় বিশ্বাসী এবং সর্বস্তরের মানুষের অধিকার আদায়ে সোচ্চার।"
    },
    2: {
        name: "হাসনাত আবদুল্লাহ",
        party: "ন্যাশনাল সিটিজেন পার্টি (এনসিপি)",
        symbol: "assets/images/জাতীয়_নাগরিক_পার্টির_লোগো.svg.png",
        photo: "assets/images/hasnat.jpg",
        bio: "হাসনাত আবদুল্লাহ বৈষম্যবিরোধী ছাত্র আন্দোলনের অন্যতম সমন্বয়ক এবং তরুণ রাজনৈতিক ব্যক্তিত্ব। তিনি রাষ্ট্র সংস্কার এবং নতুন রাজনৈতিক বন্দোবস্তের লক্ষ্যে কাজ করছেন। ছাত্র-জনতার অভ্যুত্থানে তার নেতৃত্ব তাকে জাতীয় পরিচিতি এনে দিয়েছে।",
        manifesto: [
            "রাষ্ট্রীয় কাঠামোর আমূল সংস্কার",
            "শিক্ষা ও স্বাস্থ্যখাতে বাজেট বৃদ্ধি",
            "নাগরিক অধিকার ও বাকস্বাধীনতা নিশ্চিত করা"
        ],
        socialActivities: [
            "সমন্বয়ক, বৈষম্যবিরোধী ছাত্র আন্দোলন",
            "স্বেচ্ছাসেবী, বন্যার্তদের সহায়তা কার্যক্রম"
        ],
        partyHistory: "ন্যাশনাল সিটিজেন পার্টি (এনসিপি) একটি নতুন প্রজন্মের রাজনৈতিক দল যা ২০২৪ সালের ছাত্র-জনতার অভ্যুত্থানের পরবর্তী সময়ে গঠিত হয়। দলটি সাম্য, মানবিক মর্যাদা এবং সামাজিক সুবিচার প্রতিষ্ঠার লক্ষ্যে কাজ করছে।"
    }
};

function viewCandidateDetails(candidateId) {
    const modal = document.getElementById('candidateModal');
    const modalBody = document.getElementById('candidateModalBody');
    const modalHeader = document.querySelector('#candidateModal .modal-header h2');
    
    // Check if it's a custom candidate (ID >= 1000)
    let candidate = null;
    if (candidateId >= 1000) {
        const customIndex = customCandidates.findIndex(c => c && c.id === candidateId);
        if (customIndex !== -1) {
            candidate = customCandidates[customIndex];
        }
    } else {
        candidate = mockDashboardData.candidates.find(c => c.id === candidateId);
    }

    if (!candidate) {
        showAlert("প্রার্থীর তথ্য পাওয়া যায়নি", 'error');
        return;
    }

    modalHeader.textContent = 'প্রার্থীর বিবরণ';
    
    // Build manifesto HTML if exists
    let manifestoHtml = '';
    if (candidate.manifesto && Array.isArray(candidate.manifesto)) {
        manifestoHtml = '<ul class="detail-list">';
        candidate.manifesto.forEach(item => {
            manifestoHtml += `<li>${item}</li>`;
        });
        manifestoHtml += '</ul>';
    }

    // Build social activities HTML if exists
    let socialHtml = '';
    if (candidate.socialActivities && Array.isArray(candidate.socialActivities)) {
        socialHtml = '<ul class="detail-list">';
        candidate.socialActivities.forEach(item => {
            socialHtml += `<li>${item}</li>`;
        });
        socialHtml += '</ul>';
    }

    // Handle different image sources (mock has photo, custom has image)
    const imageSrc = candidate.photo || candidate.image || 'assets/images/default-avatar.png';
    const symbolDisplay = candidate.symbol ? `<img src="${candidate.symbol}" alt="প্রতীক" class="party-symbol-small">` : (candidate.symbolSvg || '');

    let detailsHtml = `
        <div class="candidate-profile-header">
            <img src="${imageSrc}" alt="${candidate.name}" class="candidate-profile-img" onerror="this.src='assets/images/default-avatar.png'">
            <div class="candidate-profile-info">
                <h3>${candidate.name}</h3>
                <div class="candidate-party-info">
                    ${symbolDisplay}
                    <strong>${candidate.party}</strong>
                </div>
            </div>
        </div>

        <div class="detail-section">
            <h4>জীবনী</h4>
            <p>${candidate.bio || 'তথ্য উপলব্ধ নেই'}</p>
        </div>
    `;

    if (manifestoHtml) {
        detailsHtml += `
            <div class="detail-section">
                <h4>নির্বাচনী ইশতেহার</h4>
                ${manifestoHtml}
            </div>
        `;
    }

    if (socialHtml) {
        detailsHtml += `
            <div class="detail-section">
                <h4>সামাজিক কর্মকাণ্ড</h4>
                ${socialHtml}
            </div>
        `;
    }

    if (candidate.partyHistory) {
        detailsHtml += `
            <div class="detail-section">
                <h4>দলীয় ইতিহাস</h4>
                <p>${candidate.partyHistory}</p>
            </div>
        `;
    }

    modalBody.innerHTML = detailsHtml;
    modal.style.display = "block";
}

function closeCandidateModal() {
    const modal = document.getElementById('candidateModal');
    modal.style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById('candidateModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function selectChat(chatId) {
    // Update active state in mock data (in a real app, this would fetch data)
    mockDashboardData.chatList.forEach(chat => {
        chat.active = (chat.id === chatId);
        if (chat.active) chat.unread = 0; // Mark as read
    });

    // Re-render chat list to show active state
    loadChatData();
}
function resolveComplaint(complaintId) {
    const btn = event?.target;
    if (!btn) return;
    
    // Get the textarea from the closest complaint item
    const complaintItem = btn.closest('.complaint-item');
    const textarea = complaintItem?.querySelector('textarea');
    
    // Validate textarea is not empty
    if (!textarea || !textarea.value.trim()) {
        showAlert('অনুগ্রহ করে প্রশাসক মন্তব্য লিখুন', 'error');
        return;
    }
    
    // Show loading state
    btn.disabled = true;
    btn.classList.add('btn-loading');
    const originalText = btn.textContent;
    btn.textContent = 'সমাধান হচ্ছে...';
    
    setTimeout(() => {
        // Update complaint status in mock data
        const complaint = mockDashboardData.complaints.find(c => c.id === complaintId);
        if (complaint) {
            complaint.status = 'resolved';
        }
        
        // Reload complaints
        loadComplaintsData();
        
        // Show success message
        showAlert('অভিযোগ সফলভাবে সমাধান করা হয়েছে', 'success');
        
        btn.disabled = false;
        btn.classList.remove('btn-loading');
        btn.textContent = originalText;
    }, 1500);
}

function rejectComplaint(complaintId) {
    const btn = event?.target;
    if (!btn) return;
    
    // Get the textarea from the closest complaint item
    const complaintItem = btn.closest('.complaint-item');
    const textarea = complaintItem?.querySelector('textarea');
    
    // Validate textarea is not empty
    if (!textarea || !textarea.value.trim()) {
        showAlert('অনুগ্রহ করে প্রশাসক মন্তব্য লিখুন', 'error');
        return;
    }
    
    // Show loading state
    btn.disabled = true;
    btn.classList.add('btn-loading');
    const originalText = btn.textContent;
    btn.textContent = 'প্রত্যাখ্যান হচ্ছে...';
    
    setTimeout(() => {
        // Update complaint status in mock data
        const complaint = mockDashboardData.complaints.find(c => c.id === complaintId);
        if (complaint) {
            complaint.status = 'rejected';
        }
        
        // Reload complaints
        loadComplaintsData();
        
        // Show success message
        showAlert('অভিযোগ সফলভাবে প্রত্যাখ্যান করা হয়েছে', 'success');
        
        btn.disabled = false;
        btn.classList.remove('btn-loading');
        btn.textContent = originalText;
    }, 1500);
}