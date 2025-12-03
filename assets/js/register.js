// Register page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        
        // Auto-fetch demo on NID and DOB input
        const nidInput = document.getElementById('nid');
        const dobInput = document.getElementById('dob');
        
        if (nidInput && dobInput) {
            dobInput.addEventListener('change', function() {
                if (validateNID(nidInput.value) && dobInput.value) {
                    simulateAutoFetch();
                }
            });
        }
    }
});

function handleRegister(e) {
    e.preventDefault();
    
    const nid = document.getElementById('nid').value;
    const dob = document.getElementById('dob').value;
    
    // Validate NID
    if (!validateNID(nid)) {
        showAlert('অনুগ্রহ করে সঠিক NID নম্বর প্রদান করুন', 'error');
        return;
    }
    
    // Validate DOB
    if (!dob) {
        showAlert('অনুগ্রহ করে জন্ম তারিখ প্রদান করুন', 'error');
        return;
    }
    
    setButtonLoading('submitBtn', true);
    
    // Simulate API call
    setTimeout(() => {
        setButtonLoading('submitBtn', false);
        showAlert('OTP আপনার মোবাইলে পাঠানো হয়েছে!', 'success');
        
        // Redirect to signup page after 2 seconds
        setTimeout(() => {
            window.location.href = 'signup.html';
        }, 2000);
    }, 2000);
}

function simulateAutoFetch() {
    const autoFetchInfo = document.getElementById('autoFetchInfo');
    
    if (autoFetchInfo) {
        // Simulate fetching data
        setTimeout(() => {
            autoFetchInfo.style.display = 'block';
            showAlert('আপনার তথ্য স্বয়ংক্রিয়ভাবে আনা হয়েছে', 'success');
        }, 1000);
    }
}
