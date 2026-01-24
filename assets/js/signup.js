// Signup page JavaScript - Backend Integration

document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const passwordInput = document.getElementById('password');
    
    // Display NID from session
    const nid = sessionStorage.getItem('registeringNid');
    const userNidElement = document.getElementById('userNid');
    if (userNidElement && nid) {
        userNidElement.textContent = nid;
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

async function handleSignup(e) {
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
    
    const nid = sessionStorage.getItem('registeringNid');
    const dob = sessionStorage.getItem('registeringDob');
    
    // Get citizen data from sessionStorage (stored from precheck)
    const citizenData = JSON.parse(sessionStorage.getItem('citizenData') || '{}');
    
    if (!nid || !dob || !citizenData.name) {
        showAlert('সেশন শেষ হয়েছে। অনুগ্রহ করে নতুন করে নিবন্ধন করুন।', 'error');
        setTimeout(() => {
            window.location.href = 'register.html';
        }, 2000);
        return;
    }
    
    setButtonLoading('submitBtn', true);
    
    try {
        const response = await apiCall(API_ENDPOINTS.AUTH.REGISTER, {
            method: 'POST',
            body: JSON.stringify({
                nid,
                password,
                dob,
                name: citizenData.name,
                fatherName: citizenData.fatherName,
                motherName: citizenData.motherName,
                mobile: citizenData.mobile,
                permanentAddress: citizenData.presentAddress, // Using same address
                presentAddress: citizenData.presentAddress
            })
        });

        if (response.success) {
            setButtonLoading('submitBtn', false);
            showAlert('অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!', 'success');
            
            // Clear session data
            sessionStorage.removeItem('registeringNid');
            sessionStorage.removeItem('registeringDob');
            sessionStorage.removeItem('citizenData');
            
            // Redirect to login page
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    } catch (error) {
        setButtonLoading('submitBtn', false);
        showAlert(error.message || 'অ্যাকাউন্ট তৈরি করতে ব্যর্থ', 'error');
    }
}

function checkPasswordStrength(password) {
    let strength = 'weak';
    if (password.length >= 8) {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*]/.test(password);
        
        if (hasUpperCase && hasLowerCase && hasNumbers) {
            strength = 'medium';
        }
        if (hasUpperCase && hasLowerCase && hasNumbers && hasSpecial) {
            strength = 'strong';
        }
    }
    return strength;
}

function setButtonLoading(btnId, loading) {
    const btn = document.getElementById(btnId);
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');
    
    if (loading) {
        if (btn) btn.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (btnLoader) {
            btnLoader.classList.remove('hidden');
            btnLoader.style.display = 'inline-block';
        }
    } else {
        if (btn) btn.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (btnLoader) {
            btnLoader.classList.add('hidden');
            btnLoader.style.display = 'none';
        }
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