// Login page JavaScript - Backend Connected Version

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    // Check if already logged in
    const token = getAuthToken();
    if (token) {
        // Verify token is still valid
        verifyAndRedirect();
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

async function verifyAndRedirect() {
    try {
        const response = await apiRequest('GET_USER', 'GET', null, true);
        if (response.success) {
            // Already logged in, redirect to dashboard
            window.location.href = 'citizen-dashboard.html';
        }
    } catch (error) {
        // Token invalid, remove it
        removeAuthToken();
        removeUserData();
    }
}

// Handle Login Form Submit
async function handleLogin(e) {
    e.preventDefault();
    
    const nid = document.getElementById('nid').value.trim();
    const password = document.getElementById('password').value;

    // Validation
    if (!nid || !password) {
        showAlert('NID এবং পাসওয়ার্ড প্রদান করুন', 'error', '✗ ত্রুটি');
        return;
    }

    if (!validateNID(nid)) {
        showAlert('সঠিক NID নম্বর প্রদান করুন', 'error', '✗ ত্রুটি');
        return;
    }

    // Show loading state
    showLoadingState();

    try {
        // Login via API
        const response = await apiRequest('LOGIN', 'POST', {
            nid,
            password
        });

        if (response.success) {
            // Save token and user data
            saveAuthToken(response.token);
            saveUserData(response.user);

            hideLoadingState();
            
            // Show success message
            const alertContainer = document.getElementById('alertContainer');
            if (alertContainer) {
                alertContainer.innerHTML = `
                    <div class="alert alert-success">
                        <div class="alert-icon">
                            <i class="fa-solid fa-circle-check"></i>
                        </div>
                        <div class="alert-content">
                            <div class="alert-title">✓ লগইন সফল!</div>
                            <div class="alert-message">ড্যাশবোর্ডে যাচ্ছেন...</div>
                        </div>
                    </div>
                `;
            }

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'citizen-dashboard.html';
            }, 1500);
        }
    } catch (error) {
        hideLoadingState();
        showAlert(error.message || 'লগইন ব্যর্থ হয়েছে', 'error', '✗ ত্রুটি');
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

// Validate NID
function validateNID(nid) {
    if (!nid) return false;
    if (nid.length < 10 || nid.length > 17) return false;
    return /^\d+$/.test(nid);
}
