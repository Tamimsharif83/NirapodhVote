// Signup page JavaScript - Backend Connected Version

document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const passwordInput = document.getElementById('password');
    const nidInput = document.getElementById('nid');
    
    // Pre-fill NID if coming from register page
    const registeringNid = sessionStorage.getItem('registeringNid');
    if (registeringNid && nidInput) {
        nidInput.value = registeringNid;
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', updatePasswordStrength);
    }
});

function updatePasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (!strengthFill || !strengthText) return;
    
    const strength = checkPasswordStrength(password);
    
    strengthFill.className = 'strength-fill';
    
    if (strength === 'weak') {
        strengthFill.classList.add('weak');
        strengthText.textContent = 'পাসওয়ার্ড শক্তি: দুর্বল';
    } else if (strength === 'medium') {
        strengthFill.classList.add('medium');
        strengthText.textContent = 'পাসওয়ার্ড শক্তি: মাঝারি';
    } else {
        strengthFill.classList.add('strong');
        strengthText.textContent = 'পাসওয়ার্ড শক্তি: শক্তিশালী';
    }
}

// Handle Signup Form Submit - Connect to Backend
async function handleSignup(e) {
    e.preventDefault();
    
    // Get form values
    const nid = document.getElementById('nid').value.trim();
    const name = document.getElementById('name').value.trim();
    const dob = document.getElementById('dob').value;
    const fatherName = document.getElementById('fatherName').value.trim();
    const motherName = document.getElementById('motherName').value.trim();
    const permanentAddress = document.getElementById('permanentAddress').value.trim();
    const presentAddress = document.getElementById('presentAddress').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;
    
    // Validate
    if (!nid || !name || !dob || !fatherName || !motherName || !permanentAddress || !presentAddress) {
        showAlert('সকল তথ্য প্রদান করুন', 'error');
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
    
    if (!terms) {
        showAlert('অনুগ্রহ করে নিয়ম ও শর্তাবলী সম্মত হন', 'error');
        return;
    }
    
    setButtonLoading('submitBtn', true);
    
    try {
        // Register user via API
        const response = await apiRequest('REGISTER', 'POST', {
            nid,
            name,
            dob,
            fatherName,
            motherName,
            permanentAddress,
            presentAddress,
            password
        });
        
        if (response.success) {
            // Save token and user data
            saveAuthToken(response.token);
            saveUserData(response.user);
            
            setButtonLoading('submitBtn', false);
            showAlert('অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!', 'success');
            
            // Clear session storage
            sessionStorage.removeItem('registeringNid');
            sessionStorage.removeItem('registeringDob');
            
            // Redirect to citizen dashboard
            setTimeout(() => {
                window.location.href = 'citizen-dashboard.html';
            }, 1500);
        }
    } catch (error) {
        setButtonLoading('submitBtn', false);
        showAlert(error.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে', 'error');
    }
}

function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
}

function setButtonLoading(btnId, isLoading) {
    const button = document.getElementById(btnId);
    if (!button) return;
    
    if (isLoading) {
        button.disabled = true;
        button.classList.add('loading');
        const originalText = button.textContent;
        button.dataset.originalText = originalText;
        button.innerHTML = '<span class="spinner"></span> প্রক্রিয়াধীন...';
    } else {
        button.disabled = false;
        button.classList.remove('loading');
        const originalText = button.dataset.originalText || 'সাইনআপ করুন';
        button.textContent = originalText;
    }
}

function showAlert(message, type = 'info') {
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

    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.remove();
        }
    }, 5000);
}
