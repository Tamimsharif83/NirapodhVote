// Register page JavaScript - Backend Integration

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        
        // Auto-fetch on NID and DOB input
        const nidInput = document.getElementById('nid');
        const dobInput = document.getElementById('dob');
        
        if (nidInput && dobInput) {
            dobInput.addEventListener('change', async function() {
                if (validateNID(nidInput.value) && dobInput.value) {
                    await fetchCitizenData();
                }
            });
        }
    }
});

// Fetch citizen data from backend
// Fetch citizen data from backend
async function fetchCitizenData() {
    const nid = document.getElementById('nid').value.trim();
    const dob = document.getElementById('dob').value;
    
    if (!nid || !dob) return;
    
    showAutoFetchLoadingState();
    
    try {
        const response = await apiCall(API_ENDPOINTS.AUTH.PRECHECK, {
            method: 'POST',
            body: JSON.stringify({ nid, dob })
        });

        if (response.success) {
            const citizen = response.citizen;
            
            // Store citizen data in sessionStorage for later use
            sessionStorage.setItem('citizenData', JSON.stringify(citizen));
            
            // Display fetched data
            const autoFetchInfo = document.getElementById('autoFetchInfo');
            if (autoFetchInfo) {
                autoFetchInfo.innerHTML = `
                    <h4>✓ স্বয়ংক্রিয় তথ্য সংগ্রহ</h4>
                    <div class="info-item">
                        <label>নাম:</label>
                        <span>${citizen.name}</span>
                    </div>
                    <div class="info-item">
                        <label>পিতার নাম:</label>
                        <span>${citizen.fatherName}</span>
                    </div>
                    <div class="info-item">
                        <label>মাতার নাম:</label>
                        <span>${citizen.motherName}</span>
                    </div>
                    <div class="info-item">
                        <label>মোবাইল নম্বর:</label>
                        <span>${citizen.mobile}</span>
                    </div>
                    <div class="info-item">
                        <label>ঠিকানা:</label>
                        <span>${citizen.presentAddress}</span>
                    </div>
                `;
                autoFetchInfo.style.display = 'block';
            }
            
            showAlert('আপনার তথ্য সফলভাবে সংগ্রহ করা হয়েছে', 'success');
        }
    } catch (error) {
        showAlert(error.message || 'তথ্য পাওয়া যায়নি', 'error');
        const autoFetchInfo = document.getElementById('autoFetchInfo');
        if (autoFetchInfo) {
            autoFetchInfo.style.display = 'none';
        }
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const errors = validateRegisterForm();
    
    if (errors.length > 0) {
        showAlert(errors.join(', '), 'error');
        return;
    }

    const nid = document.getElementById('nid').value.trim();
    const dob = document.getElementById('dob').value;
    
    showLoadingState();
    
    try {
        // First, send OTP
        const otpResponse = await apiCall(API_ENDPOINTS.AUTH.SEND_OTP, {
            method: 'POST',
            body: JSON.stringify({ nid })
        });

        if (otpResponse.success) {
            hideLoadingState();
            
            // Store NID and DOB for OTP verification
            sessionStorage.setItem('registeringNid', nid);
            sessionStorage.setItem('registeringDob', dob);
            
            showAlert('OTP আপনার মোবাইলে পাঠানো হয়েছে', 'success');
            
            // Show OTP input (you'll need to add this to your HTML)
            showOTPInput();
        }
    } catch (error) {
        hideLoadingState();
        showAlert(error.message || 'নিবন্ধন ব্যর্থ হয়েছে', 'error');
    }
}

let countdownInterval = null;

function showOTPInput() {
    const form = document.getElementById('registerForm');
    
    // Remove existing OTP input if any
    const existingOtpDiv = document.querySelector('.otp-input-group');
    if (existingOtpDiv) {
        existingOtpDiv.remove();
    }
    
    const otpDiv = document.createElement('div');
    otpDiv.className = 'form-group otp-input-group';
    otpDiv.innerHTML = `
        <label for="otpCode">OTP কোড *</label>
        <div style="display: flex; gap: 10px; align-items: center;">
            <input type="text" id="otpCode" placeholder="6 সংখ্যার OTP লিখুন" maxlength="6" required style="flex: 1;">
            <div id="otpTimer" style="min-width: 60px; font-weight: bold; color: #e74c3c; font-size: 18px;">00:50</div>
        </div>
        <small class="form-hint">OTP আপনার মোবাইলে পাঠানো হয়েছে</small>
        <button type="button" class="btn btn-primary" onclick="verifyOTPAndProceed()" style="margin-top: 10px;">OTP যাচাই করুন</button>
        <button type="button" class="btn btn-secondary" onclick="resendOTP()" id="resendBtn" style="margin-top: 10px;" disabled>পুনরায় OTP পাঠান</button>
    `;
    
    form.appendChild(otpDiv);
    
    // Start countdown
    startOTPCountdown(50);
}

function startOTPCountdown(seconds) {
    let timeLeft = seconds;
    const timerElement = document.getElementById('otpTimer');
    const resendBtn = document.getElementById('resendBtn');
    const verifyBtn = document.querySelector('.otp-input-group button[onclick="verifyOTPAndProceed()"]');
    
    // Clear any existing interval
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    // Disable resend button initially
    if (resendBtn) resendBtn.disabled = true;
    
    countdownInterval = setInterval(() => {
        timeLeft--;
        
        if (timerElement) {
            const mins = Math.floor(timeLeft / 60);
            const secs = timeLeft % 60;
            timerElement.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            
            // Change color as time runs out
            if (timeLeft <= 10) {
                timerElement.style.color = '#e74c3c'; // Red
            } else if (timeLeft <= 20) {
                timerElement.style.color = '#f39c12'; // Orange
            } else {
                timerElement.style.color = '#27ae60'; // Green
            }
        }
        
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            if (timerElement) {
                timerElement.textContent = 'মেয়াদ শেষ';
                timerElement.style.color = '#e74c3c';
            }
            if (resendBtn) {
                resendBtn.disabled = false;
            }
            if (verifyBtn) {
                verifyBtn.disabled = true;
                verifyBtn.textContent = 'OTP মেয়াদ শেষ হয়েছে';
            }
            showAlert('OTP মেয়াদ শেষ হয়েছে। পুনরায় OTP পাঠান।', 'error');
        }
    }, 1000);
}

async function resendOTP() {
    const nid = sessionStorage.getItem('registeringNid');
    
    if (!nid) {
        showAlert('সেশন শেষ হয়েছে। অনুগ্রহ করে নতুন করে চেষ্টা করুন।', 'error');
        return;
    }
    
    const resendBtn = document.getElementById('resendBtn');
    if (resendBtn) resendBtn.disabled = true;
    
    try {
        const response = await apiCall(API_ENDPOINTS.AUTH.SEND_OTP, {
            method: 'POST',
            body: JSON.stringify({ nid })
        });

        if (response.success) {
            showAlert('নতুন OTP পাঠানো হয়েছে', 'success');
            
            // Reset verify button
            const verifyBtn = document.querySelector('.otp-input-group button[onclick="verifyOTPAndProceed()"]');
            if (verifyBtn) {
                verifyBtn.disabled = false;
                verifyBtn.textContent = 'OTP যাচাই করুন';
            }
            
            // Clear OTP input
            const otpInput = document.getElementById('otpCode');
            if (otpInput) otpInput.value = '';
            
            // Restart countdown
            startOTPCountdown(response.otpExpiresIn || 50);
        }
    } catch (error) {
        if (resendBtn) resendBtn.disabled = false;
        showAlert(error.message || 'OTP পাঠাতে ব্যর্থ হয়েছে', 'error');
    }
}

async function verifyOTPAndProceed() {
    const nid = sessionStorage.getItem('registeringNid');
    const otp = document.getElementById('otpCode').value;
    
    if (!otp || otp.length !== 6) {
        showAlert('সঠিক OTP কোড লিখুন', 'error');
        return;
    }
    
    try {
        const response = await apiCall(API_ENDPOINTS.AUTH.VERIFY_OTP, {
            method: 'POST',
            body: JSON.stringify({ nid, otp })
        });

        if (response.success) {
            showAlert('OTP যাচাই সফল! পাসওয়ার্ড তৈরি করুন', 'success');
            
            setTimeout(() => {
                window.location.href = 'signup.html';
            }, 1500);
        }
    } catch (error) {
        showAlert(error.message || 'OTP যাচাই ব্যর্থ', 'error');
    }
}

// ... rest of the validation functions remain the same
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

function validateNID(nid) {
    if (!nid) return false;
    if (nid.length < 10 || nid.length > 17) return false;
    return /^\d+$/.test(nid);
}

function showAutoFetchLoadingState() {
    const autoFetchInfo = document.getElementById('autoFetchInfo');
    if (autoFetchInfo) {
        autoFetchInfo.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p>তথ্য আনা হচ্ছে...</p>
            </div>
        `;
        autoFetchInfo.style.display = 'block';
    }
}

function showLoadingState() {
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');

    if (submitBtn) submitBtn.disabled = true;
    if (btnText) btnText.style.display = 'none';
    if (btnLoader) {
        btnLoader.classList.remove('hidden');
        btnLoader.style.display = 'inline-block';
    }
}

function hideLoadingState() {
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');

    if (submitBtn) submitBtn.disabled = false;
    if (btnText) btnText.style.display = 'inline';
    if (btnLoader) {
        btnLoader.classList.add('hidden');
        btnLoader.style.display = 'none';
    }
}

function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
        <div class="alert-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

    alertContainer.innerHTML = '';
    alertContainer.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}