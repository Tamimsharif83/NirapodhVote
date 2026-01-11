// Signup page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const passwordInput = document.getElementById('password');
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', updatePasswordStrength);
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

// Update user password
function updateUserPassword(nid, password) {
    const users = getRegisteredUsers();
    if (users.hasOwnProperty(nid)) {
        users[nid].password = password;
        users[nid].passwordSetAt = new Date().toISOString();
        localStorage.setItem('nirapodh_users', JSON.stringify(users));
        return true;
    }
    return false;
}

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

function handleSignup(e) {
    e.preventDefault();
    
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;
    
    // Validate password
    if (password.length < 8) {
        showAlert('পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে', 'error');
        return;
    }
    
    // Check password match
    if (password !== confirmPassword) {
        showAlert('পাসওয়ার্ড মিলছে না', 'error');
        return;
    }
    
    // Check terms
    if (!terms) {
        showAlert('অনুগ্রহ করে নিয়ম ও শর্তাবলী সম্মত হন', 'error');
        return;
    }
    
    setButtonLoading('submitBtn', true);
    
    // Simulate API call
    setTimeout(() => {
        // Get the NID from sessionStorage (set during registration/login process)
        const nid = sessionStorage.getItem('registeringNid');
        
        if (nid) {
            // Update user password in registered users
            const updated = updateUserPassword(nid, password);
            
            if (updated) {
                setButtonLoading('submitBtn', false);
                showAlert('অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!', 'success');
                
                // Clear the session data
                sessionStorage.removeItem('registeringNid');
                
                // Redirect to login page
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                setButtonLoading('submitBtn', false);
                showAlert('অ্যাকাউন্ট আপডেট করতে ব্যর্থ। পুনরায় চেষ্টা করুন।', 'error');
            }
        } else {
            setButtonLoading('submitBtn', false);
            showAlert('সেশন শেষ হয়েছে। অনুগ্রহ করে নতুন করে নিবন্ধন করুন।', 'error');
            setTimeout(() => {
                window.location.href = 'register.html';
            }, 2000);
        }
    }, 2000);
}
