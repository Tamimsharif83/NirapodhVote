// Common JavaScript functions for all pages

// Show alert message
function showAlert(message, type = 'info', title = '', duration = 5000) {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    
    // Set default titles based on type if not provided
    if (!title) {
        switch(type) {
            case 'success': title = '✓ সফল'; break;
            case 'error': title = '✗ ত্রুটি'; break;
            case 'warning': title = '⚠ সতর্কতা'; break;
            case 'info': title = 'ℹ তথ্য'; break;
        }
    }
    
    alertDiv.innerHTML = `
        <div class="alert-content">
            <div class="alert-title">${title}</div>
            <div class="alert-message">${message}</div>
        </div>
    `;
    
    alertContainer.innerHTML = '';
    alertContainer.appendChild(alertDiv);
    
    // Auto-hide after duration
    setTimeout(() => {
        alertDiv.style.opacity = '0';
        setTimeout(() => alertDiv.remove(), 300);
    }, duration);
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const icon = input.parentElement.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        if (icon) {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    } else {
        input.type = 'password';
        if (icon) {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
}

// Open chatbot (placeholder)
function openChatBot() {
    showAlert('AI চ্যাটবট শীঘ্রই চালু হবে। এখনই সাহায্যের জন্য প্রশাসকের সাথে যোগাযোগ করুন।', 'info');
}

// Logout function
function logout() {
    if (confirm('আপনি কি লগআউট করতে চান?')) {
        // Clear all auth related storage
        localStorage.removeItem('nirapodh_token');
        localStorage.removeItem('nirapodh_user');
        sessionStorage.clear();
        
        // Set flag to prevent auto-redirect on login page
        sessionStorage.setItem('justLoggedOut', 'true');
        
        window.location.href = 'index.html';
    }
}

// Format date to Bangla
function formatDateBangla(date) {
    const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    const dateStr = date.toString();
    return dateStr.split('').map(char => {
        if (char >= '0' && char <= '9') {
            return bengaliNumerals[parseInt(char)];
        }
        return char;
    }).join('');
}

// Convert English numbers to Bengali
function toBengaliNumber(num) {
    const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(char => {
        if (char >= '0' && char <= '9') {
            return bengaliNumerals[parseInt(char)];
        }
        return char;
    }).join('');
}

// Loading button state
function setButtonLoading(buttonId, loading = true, textId = 'btnText', loaderId = 'btnLoader') {
    const btn = document.getElementById(buttonId);
    if (!btn) return;
    
    const btnText = document.getElementById(textId);
    const btnLoader = document.getElementById(loaderId);
    
    if (loading) {
        btn.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (btnLoader) {
            btnLoader.classList.remove('hidden');
            btnLoader.style.display = 'inline-block';
        }
    } else {
        btn.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (btnLoader) {
            btnLoader.classList.add('hidden');
            btnLoader.style.display = 'none';
        }
    }
}

// Validate NID
function validateNID(nid) {
    const nidPattern = /^[0-9]{10,17}$/;
    return nidPattern.test(nid);
}

// Validate password strength
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

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('নিরাপদ ভোট সিস্টেম লোড হয়েছে');
});