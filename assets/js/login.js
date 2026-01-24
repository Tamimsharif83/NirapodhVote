// Login page JavaScript with UI States

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

/* ===========================
   REGISTERED USERS STORAGE
   =========================== */

// Get all registered users
function getRegisteredUsers() {
    const users = localStorage.getItem('nirapodh_users');
    return users ? JSON.parse(users) : {};
}

// Verify user credentials
function verifyUserCredentials(nid, password) {
    const users = getRegisteredUsers();
    if (!users.hasOwnProperty(nid)) {
        return false;
    }
    return users[nid].password === password;
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

}

// Show Network Error State
function showNetworkError() {
    showAlert('সার্ভারের সাথে সংযোগ ব্যর্থ। অনুগ্রহ করে পুনরায় চেষ্টা করুন।', 'error', '✗ নেটওয়ার্ক ত্রুটি');
}

// Show Server Error State
function showServerError(message = '') {
    const errorMsg = message || 'অ্যাকাউন্ট খুঁজে পাওয়া যায়নি। NID এবং পাসওয়ার্ড পুনরায় পরীক্ষা করুন।';
    showAlert(errorMsg, 'error', '✗ লগইন ব্যর্থ');
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
    } else if (password.length < 8) {
        errors.push('পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে');
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

    const nid = document.getElementById('nid').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await apiCall(API_ENDPOINTS.AUTH.LOGIN, {
            method: 'POST',
            body: JSON.stringify({ nid, password })
        });

        if (response.success && response.token) {
            // Save user info
            localStorage.setItem('authToken', response.token);
            showSuccessState();
            window.location.href = 'citizen-dashboard.html';
        }
    } catch (error) {
        hideLoadingState();
        showServerError(error.message || 'এই NID এবং পাসওয়ার্ড মেলেনি। অনুগ্রহ করে আবার চেষ্টা করুন বা নিবন্ধন করুন।');
    }
}

// Forgot Password Handler
function forgotPassword() {
    showAlert('পাসওয়ার্ড রিসেট লিংক আপনার মোবাইলে পাঠানো হয়েছে।', 'info', 'ℹ তথ্য');
    return false;
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
