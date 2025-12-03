// Login page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

function handleLogin(e) {
    e.preventDefault();
    
    const nid = document.getElementById('nid').value;
    const password = document.getElementById('password').value;
    
    // Validate NID
    if (!validateNID(nid)) {
        showAlert('অনুগ্রহ করে সঠিক NID নম্বর প্রদান করুন', 'error');
        return;
    }
    
    // Validate password
    if (!password) {
        showAlert('অনুগ্রহ করে পাসওয়ার্ড প্রদান করুন', 'error');
        return;
    }
    
    setButtonLoading('submitBtn', true);
    
    // Simulate API call
    setTimeout(() => {
        setButtonLoading('submitBtn', false);
        showAlert('লগইন সফল হয়েছে!', 'success');
        
        // Redirect to citizen dashboard (not created yet)
        setTimeout(() => {
            showAlert('নাগরিক ড্যাশবোর্ড শীঘ্রই আসছে...', 'info');
            // window.location.href = 'citizen-dashboard.html';
        }, 1500);
    }, 2000);
}

function forgotPassword() {
    showAlert('পাসওয়ার্ড রিসেট লিংক আপনার মোবাইলে পাঠানো হবে', 'info');
    return false;
}
