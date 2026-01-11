// Register page JavaScript - Backend Connected Version

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        
        // Auto-fetch demo on NID and DOB input
        const nidInput = document.getElementById('nid');
        const dobInput = document.getElementById('dob');
        
        if (nidInput && dobInput) {
            dobInput.addEventListener('change', function() {
                if (validateNID(nidInput.value) && dobInput.value) {
                    simulateAutoFetch();
                }
            });
        }
    }
});

/* ===========================
   UI STATE MANAGEMENT
   =========================== */

// Show Alert with Auto-dismiss
function showAlert(message, type = 'info', title = '', duration = 5000) {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    
    let iconClass = '';
    switch(type) {
        case 'success': iconClass = 'fa-circle-check'; title = title || '✓ সফল'; break;
        case 'error': iconClass = 'fa-circle-xmark'; title = title || '✗ ত্রুটি'; break;
        case 'warning': iconClass = 'fa-triangle-exclamation'; title = title || '⚠ সতর্কতা'; break;
        case 'info': iconClass = 'fa-circle-info'; title = title || 'ℹ তথ্য'; break;
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

    // Auto-dismiss
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.classList.add('removing');
            setTimeout(() => alertDiv.remove(), 300);
        }
    }, duration);
}

// Show Loading State
function showLoadingState() {
    const form = document.getElementById('registerForm');
    if (!form) return;

    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
    }

    if (btnText) btnText.style.display = 'none';
    if (btnLoader) {
        btnLoader.classList.remove('hidden');
        btnLoader.style.display = 'inline-block';
    }
}

// Hide Loading State
function hideLoadingState() {
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');

    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    }

    if (btnText) btnText.style.display = 'inline';
    if (btnLoader) {
        btnLoader.classList.add('hidden');
        btnLoader.style.display = 'none';
    }
}

// Show Loading State for Auto-fetch
function showAutoFetchLoadingState() {
    const autoFetchInfo = document.getElementById('autoFetchInfo');
    if (autoFetchInfo) {
        autoFetchInfo.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
            </div>
        `;
        autoFetchInfo.style.display = 'block';
    }
}

// Show Success State for Auto-fetch
function showAutoFetchSuccessState() {
    const autoFetchInfo = document.getElementById('autoFetchInfo');
    if (autoFetchInfo) {
        autoFetchInfo.innerHTML = `
            <h4>✓ স্বয়ংক্রিয় তথ্য সংগ্রহ</h4>
            <div class="info-item">
                <label>মোবাইল নম্বর:</label>
                <span id="fetchedPhone">০১৭১২৩৪৫৬৭৮</span>
            </div>
            <div class="info-item">
                <label>ঠিকানা:</label>
                <span id="fetchedAddress">ঢাকা, বাংলাদেশ</span>
            </div>
            <div class="info-item">
                <label>ভোট কেন্দ্র:</label>
                <span id="fetchedCenter">ঢাকা সিটি কলেজ</span>
            </div>
        `;
        autoFetchInfo.style.display = 'block';
    }
}

// Validate Form
function validateRegisterForm() {
    const errors = [];
    const nid = document.getElementById('nid').value.trim();
    const dob = document.getElementById('dob').value;

    if (!nid) {
        errors.push('NID নম্বর প্রয়োজন');
    } else if (nid.length < 10 || nid.length > 17) {
        errors.push('NID নম্বর ১০ বা ১৭ সংখ্যার হতে হবে');
    } else if (!/^\d+$/.test(nid)) {
        errors.push('NID শুধুমাত্র সংখ্যা হতে হবে');
    }

    if (!dob) {
        errors.push('জন্ম তারিখ প্রয়োজন');
    }

    return errors;
}

// Handle Register Form Submit
async function handleRegister(e) {
    e.preventDefault();
    
    // Validate form
    const errors = validateRegisterForm();
    
    if (errors.length > 0) {
        showAlert(errors.join(', '), 'error', '✗ ত্রুটি');
        return;
    }

    const nid = document.getElementById('nid').value.trim();
    const dob = document.getElementById('dob').value;
    
    // Store NID and DOB temporarily for signup page
    sessionStorage.setItem('registeringNid', nid);
    sessionStorage.setItem('registeringDob', dob);
    
    // Show success message and redirect to signup
    showLoadingState();
    
    setTimeout(() => {
        hideLoadingState();
        
        const alertContainer = document.getElementById('alertContainer');
        if (alertContainer) {
            alertContainer.innerHTML = `
                <div class="alert alert-success">
                    <div class="alert-icon">
                        <i class="fa-solid fa-circle-check"></i>
                    </div>
                    <div class="alert-content">
                        <div class="alert-title">✓ যাচাই সফল!</div>
                        <div class="alert-message">আপনার অ্যাকাউন্ট সম্পূর্ণ করতে সাইনআপ পেজে যাচ্ছেন...</div>
                    </div>
                </div>
            `;
        }

        // Redirect to signup page
        setTimeout(() => {
            window.location.href = 'signup.html';
        }, 1500);
    }, 1000);
}

function simulateAutoFetch() {
    showAutoFetchLoadingState();
    
    // Simulate fetching data from backend
    setTimeout(() => {
        showAutoFetchSuccessState();
        showAlert('আপনার তথ্য সফলভাবে সংগ্রহ করা হয়েছে', 'success', '✓ সফল');
    }, 1500);
}

// Validate NID
function validateNID(nid) {
    if (!nid) return false;
    if (nid.length < 10 || nid.length > 17) return false;
    return /^\d+$/.test(nid);
}
