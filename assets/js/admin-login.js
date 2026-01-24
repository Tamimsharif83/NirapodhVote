// Admin login page JavaScript - Backend Integration

document.addEventListener('DOMContentLoaded', function() {
    const adminLoginForm = document.getElementById('adminLoginForm');
    
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }
});

async function handleAdminLogin(e) {
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
    
    try {
        // Call backend API
        const response = await apiCall(API_ENDPOINTS.ADMIN.LOGIN, {
            method: 'POST',
            body: JSON.stringify({
                username: adminId,
                password: password
            })
        });

        if (response.success) {
            // Save token
            setAuthToken(response.token);
            
            // Save admin info
            localStorage.setItem('admin_user', JSON.stringify(response.admin));
            
            showAlert('প্রশাসক লগইন সফল হয়েছে!', 'success');
            
            setTimeout(() => {
                window.location.href = 'admin-dashboard.html';
            }, 1500);
        }
    } catch (error) {
        setButtonLoading('submitBtn', false);
        showAlert(error.message || 'ভুল প্রশাসক আইডি অথবা পাসওয়ার্ড', 'error');
    }
}

function contactSupport() {
    showAlert('সহায়তার জন্য যোগাযোগ করুন: support@nirapod-vote.gov.bd', 'info');
    return false;
}