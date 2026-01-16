// OTP Verification JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if OTP session data exists
    const nid = sessionStorage.getItem('otp_nid');
    const phone = sessionStorage.getItem('otp_phone');
    const expiresIn = sessionStorage.getItem('otp_expires');
    
    if (!nid || !phone) {
        showAlert('অবৈধ অনুরোধ। নিবন্ধন পেজে ফিরে যান', 'error');
        setTimeout(() => {
            window.location.href = 'register.html';
        }, 2000);
        return;
    }
    
    // Display phone number and expiry time
    document.getElementById('displayPhone').textContent = phone;
    if (expiresIn) {
        document.getElementById('expiryTime').textContent = expiresIn;
    }
    
    const otpForm = document.getElementById('otpForm');
    if (otpForm) {
        otpForm.addEventListener('submit', handleVerifyOTP);
    }
});

/**
 * Handle OTP verification and registration
 */
async function handleVerifyOTP(e) {
    e.preventDefault();
    
    // Get form values
    const nid = sessionStorage.getItem('otp_nid');
    const otp = document.getElementById('otp').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const presentAddress = document.getElementById('presentAddress').value.trim();
    
    // Validation
    if (!otp || !password || !presentAddress) {
        showAlert('সকল তথ্য প্রদান করুন', 'error');
        return;
    }
    
    if (otp.length !== 6) {
        showAlert('৬ সংখ্যার OTP প্রদান করুন', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAlert('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('পাসওয়ার্ড মিলছে না', 'error');
        return;
    }
    
    setButtonLoading('submitBtn', true);
    
    try {
        // Verify OTP and register
        const response = await apiRequest('VERIFY_OTP_REGISTER', 'POST', {
            nid,
            otp,
            password,
            presentAddress
        });
        
        if (response.success) {
            // Save token and user data
            saveAuthToken(response.token);
            saveUserData(response.user);
            
            // Clear session storage
            sessionStorage.removeItem('otp_nid');
            sessionStorage.removeItem('otp_phone');
            sessionStorage.removeItem('otp_dob');
            sessionStorage.removeItem('otp_expires');
            
            showAlert('নিবন্ধন সফল হয়েছে! ড্যাশবোর্ডে পাঠানো হচ্ছে...', 'success');
            
            // Redirect to citizen dashboard
            setTimeout(() => {
                window.location.href = 'citizen-dashboard.html';
            }, 1500);
        } else {
            showAlert(response.message || 'OTP যাচাইকরণ ব্যর্থ হয়েছে', 'error');
        }
    } catch (error) {
        console.error('OTP verification error:', error);
        showAlert('সার্ভার ত্রুটি। আবার চেষ্টা করুন', 'error');
    } finally {
        setButtonLoading('submitBtn', false);
    }
}

/**
 * Resend OTP
 */
async function resendOTP() {
    const nid = sessionStorage.getItem('otp_nid');
    const phone = sessionStorage.getItem('otp_phone');
    
    if (!nid || !phone) {
        showAlert('সেশন ডেটা পাওয়া যায়নি', 'error');
        return;
    }
    
    const resendBtn = document.getElementById('resendBtn');
    resendBtn.disabled = true;
    resendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> পাঠানো হচ্ছে...';
    
    try {
        const response = await apiRequest('SEND_OTP', 'POST', {
            nid,
            phoneNumber: phone
        });
        
        if (response.success) {
            showAlert('নতুন OTP পাঠানো হয়েছে', 'success');
            
            // Update expiry time
            if (response.data.expiresIn) {
                sessionStorage.setItem('otp_expires', response.data.expiresIn);
                document.getElementById('expiryTime').textContent = response.data.expiresIn;
            }
        } else {
            showAlert(response.message || 'OTP পাঠাতে ব্যর্থ হয়েছে', 'error');
        }
    } catch (error) {
        console.error('Resend OTP error:', error);
        showAlert('সার্ভার ত্রুটি। আবার চেষ্টা করুন', 'error');
    } finally {
        resendBtn.disabled = false;
        resendBtn.innerHTML = '<i class="fa-solid fa-rotate"></i> পুনরায় OTP পাঠান';
    }
}

/**
 * Toggle password visibility
 */
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const button = field.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        field.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

/**
 * Show alert message
 */
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;

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
        case 'warning': 
            iconClass = 'fa-triangle-exclamation'; 
            title = '⚠ সতর্কতা'; 
            break;
        case 'info': 
            iconClass = 'fa-circle-info'; 
            title = 'ℹ তথ্য'; 
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

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.classList.add('removing');
            setTimeout(() => alertDiv.remove(), 300);
        }
    }, 5000);
}

/**
 * Set button loading state
 */
function setButtonLoading(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    const btnText = button?.querySelector('#btnText');
    const btnLoader = button?.querySelector('#btnLoader');
    
    if (!button) return;
    
    if (isLoading) {
        button.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (btnLoader) btnLoader.style.display = 'inline-block';
    } else {
        button.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (btnLoader) btnLoader.style.display = 'none';
    }
}

/**
 * Save auth token
 */
function saveAuthToken(token) {
    localStorage.setItem('nirapodh_token', token);
}

/**
 * Save user data
 */
function saveUserData(user) {
    localStorage.setItem('nirapodh_user', JSON.stringify(user));
}
