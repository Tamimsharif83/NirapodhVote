// Admin login page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const adminLoginForm = document.getElementById('adminLoginForm');
    
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }
});

function handleAdminLogin(e) {
    e.preventDefault();
    
    const adminId = document.getElementById('adminId').value;
    const password = document.getElementById('password').value;
    
    // Validate admin ID
    if (!adminId) {
        showAlert('অনুগ্রহ করে প্রশাসক আইডি প্রদান করুন', 'error');
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
        
        // Demo credentials check
        if (adminId === 'ADMIN-2025-001' && password === 'admin123') {
            showAlert('প্রশাসক লগইন সফল হয়েছে!', 'success');
            
            setTimeout(() => {
                window.location.href = 'admin-dashboard.html';
            }, 1500);
        } else {
            showAlert('ভুল প্রশাসক আইডি অথবা পাসওয়ার্ড', 'error');
        }
    }, 2000);
}

function contactSupport() {
    showAlert('সহায়তার জন্য যোগাযোগ করুন: support@nirapod-vote.gov.bd', 'info');
    return false;
}
