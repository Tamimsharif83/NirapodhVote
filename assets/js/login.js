// Login page JavaScript with Backend Integration

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    // Only check for existing login if NOT explicitly navigating to login page
    // This allows users to logout and login again
    const fromLogout = sessionStorage.getItem('justLoggedOut');
    if (fromLogout) {
        sessionStorage.removeItem('justLoggedOut');
        removeAuthToken();
        removeUserData();
    } else {
        // Check if user is already logged in
        const token = getAuthToken();
        if (token) {
            verifyToken(token);
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

// Verify if the stored token is still valid
async function verifyToken(token) {
    try {
        const response = await apiRequest('GET_USER', 'GET', null, true);
        if (response.success) {
            console.log('User already logged in, redirecting to dashboard');
            window.location.href = 'citizen-dashboard.html';
        } else {
            // Token invalid or expired
            console.log('Token expired or invalid, clearing auth');
            removeAuthToken();
            removeUserData();
        }
    } catch (error) {
        console.error('Token verification failed:', error);
        // Clear invalid token on error
        removeAuthToken();
        removeUserData();
    }
}

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
    const form = document.getElementById('loginForm');
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

// Show Success State
function showSuccessState() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    const alertContainer = document.getElementById('alertContainer');
    if (alertContainer) {
        alertContainer.innerHTML = `
            <div class="alert alert-success">
                <div class="alert-icon">
                    <i class="fa-solid fa-circle-check"></i>
                </div>
                <div class="alert-content">
                    <div class="alert-title">✓ লগইন সফল!</div>
                    <div class="alert-message">ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...</div>
                </div>
            </div>
        `;
    }

    // Disable form
    form.style.opacity = '0.6';
    form.style.pointerEvents = 'none';

    // Redirect after 1.5 seconds
    setTimeout(() => {
        window.location.href = 'citizen-dashboard.html';
    }, 1500);
}

// Validate Form
function validateLoginForm() {
    const errors = [];
    const nid = document.getElementById('nid').value.trim();
    const password = document.getElementById('password').value;

    if (!nid) {
        errors.push('NID নম্বর প্রয়োজন');
    } else if (nid.length < 10) {
        errors.push('NID নম্বর কমপক্ষে ১০ সংখ্যার হতে হবে');
    } else if (!/^\d+$/.test(nid)) {
        errors.push('NID শুধুমাত্র সংখ্যা হতে হবে');
    }

    if (!password) {
        errors.push('পাসওয়ার্ড প্রয়োজন');
    } else if (password.length < 6) { // Changed to 6 as per backend validation
        errors.push('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
    }

    return errors;
}

async function handleLogin(e) {
    e.preventDefault();
    
    // Validate form
    const errors = validateLoginForm();
    
    if (errors.length > 0) {
        showAlert(errors.join(', '), 'error', '✗ ত্রুটি');
        return;
    }
    
    // Show loading state
    showLoadingState();

    try {
        const nid = document.getElementById('nid').value.trim();
        const password = document.getElementById('password').value; // Don't trim password

        // Call Backend API
        const response = await apiRequest('LOGIN', 'POST', {
            nid,
            password
        });

        if (response.success) {
            // Save info
            console.log('Login Response:', response); // Debug log
            console.log('User Data to Save:', response.user); // Debug log
            saveAuthToken(response.token);
            saveUserData(response.user);
            
            showSuccessState();
        } else {
            hideLoadingState();
            showAlert(response.message || 'লগইন ব্যর্থ হয়েছে', 'error', '✗ লগইন ব্যর্থ');
        }

    } catch (error) {
        hideLoadingState();
        console.error('Login error:', error);
        showAlert(error.message || 'সার্ভার ত্রুটি। অনুগ্রহ করে আবার চেষ্টা করুন।', 'error', '✗ ত্রুটি');
    }
}

// Forgot Password Handler
function forgotPassword() {
    showAlert('পাসওয়ার্ড রিসেট লিংক আপনার মোবাইলে পাঠানো হয়েছে (মক)।', 'info', 'ℹ তথ্য');
}

// Toggle password visibility
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const button = event.target.closest('.toggle-password');
    
    if (field.type === 'password') {
        field.type = 'text';
        if (button) button.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
    } else {
        field.type = 'password';
        if (button) button.innerHTML = '<i class="fa-solid fa-eye"></i>';
    }
}
