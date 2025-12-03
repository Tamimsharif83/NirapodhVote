// Common JavaScript functions for all pages

// Show alert message
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    alertContainer.innerHTML = '';
    alertContainer.appendChild(alertDiv);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        alertDiv.style.opacity = '0';
        setTimeout(() => alertDiv.remove(), 300);
    }, 5000);
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
}

// Open chatbot (placeholder)
function openChatBot() {
    showAlert('AI চ্যাটবট শীঘ্রই চালু হবে। এখনই সাহায্যের জন্য প্রশাসকের সাথে যোগাযোগ করুন।', 'info');
}

// Logout function
function logout() {
    if (confirm('আপনি কি লগআউট করতে চান?')) {
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
function setButtonLoading(buttonId, loading = true) {
    const btn = document.getElementById(buttonId);
    if (!btn) return;
    
    const btnText = btn.querySelector('#btnText');
    const btnLoader = btn.querySelector('#btnLoader');
    
    if (loading) {
        btn.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (btnLoader) btnLoader.classList.remove('hidden');
    } else {
        btn.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (btnLoader) btnLoader.classList.add('hidden');
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
