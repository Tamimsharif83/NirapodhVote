// Register page JavaScript - Backend Connected Version with OTP

console.log('🔍 register-backend.js loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 DOM loaded, setting up form handler');
    const registerForm = document.getElementById('registerForm');
    
    if (!registerForm) {
        console.error('❌ registerForm not found!');
        return;
    }
    
    console.log('✅ Form found, attaching submit handler');
    
    registerForm.addEventListener('submit', function(e) {
        console.log('🎯 FORM SUBMIT EVENT TRIGGERED!');
        handleRegister(e);
    });
    
    // Also add click handler to button as backup
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            console.log('🎯 BUTTON CLICK EVENT TRIGGERED!');
        });
    }
    
    console.log('✅ Setup complete');
});

/**
 * Handle the initial registration - Send OTP
 */
async function handleRegister(e) {
    e.preventDefault();
    
    console.log('=== Register Form Submitted ===');
    
    // Get form values
    const nid = document.getElementById('nid').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const dob = document.getElementById('dob').value;
    
    console.log('Form Values:', { nid, phoneNumber, dob });
    
    // Validation
    if (!nid || !phoneNumber || !dob) {
        console.log('Validation failed: Missing fields');
        showAlert('সকল তথ্য প্রদান করুন', 'error');
        return;
    }
    
    if (nid.length < 10) {
        console.log('Validation failed: Invalid NID length');
        showAlert('বৈধ NID নম্বর প্রদান করুন', 'error');
        return;
    }
    
    console.log('Validation passed, setting button loading...');
    setButtonLoading('submitBtn', true);
    
    try {
        console.log('Calling API with:', { nid, phoneNumber });
        
        // Send OTP request
        const response = await apiRequest('SEND_OTP', 'POST', {
            nid,
            phoneNumber
        });
        
        console.log('API Response:', response);
        
        if (response.success) {
            // Store data in session for OTP verification page
            sessionStorage.setItem('otp_nid', nid);
            sessionStorage.setItem('otp_phone', response.data.phoneNumber);
            sessionStorage.setItem('otp_dob', dob);
            sessionStorage.setItem('otp_expires', response.data.expiresIn);
            
            console.log('Success! Showing alert and redirecting...');
            showAlert(response.message, 'success');
            
            // Redirect to OTP verification page after 1 second
            setTimeout(() => {
                window.location.href = 'verify-otp.html';
            }, 1000);
        } else {
            console.log('API returned error:', response.message);
            showAlert(response.message || 'OTP পাঠাতে ব্যর্থ হয়েছে', 'error');
        }
    } catch (error) {
        console.error('Send OTP error:', error);
        showAlert('সার্ভার ত্রুটি। আবার চেষ্টা করুন', 'error');
    } finally {
        console.log('Removing button loading state...');
        setButtonLoading('submitBtn', false);
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


// Set button loading state
function setButtonLoading(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    const btnText = button?.querySelector('#btnText');
    const btnLoader = button?.querySelector('#btnLoader');
    
    if (!button) return;
    
    if (isLoading) {
        button.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (btnLoader) btnLoader.style.display = 'inline-block';
    } else {
        button.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (btnLoader) btnLoader.style.display = 'none';
    }
}



// Validate Form
function validateRegisterForm() {
    const errors = [];
    const nid = document.getElementById('nid').value.trim();
    const dob = document.getElementById('dob').value;

    if (!nid) {
        errors.push('NID নম্বর প্রয়োজন');
    } else if (nid.length < 10 || nid.length > 17) {
        errors.push('NID নম্বর ১০ বা ১৭ সংখ্যার হতে হবে');
    } else if (!/^\d+$/.test(nid)) {
        errors.push('NID শুধুমাত্র সংখ্যা হতে হবে');
    }

    if (!dob) {
        errors.push('জন্ম তারিখ প্রয়োজন');
    }

    return errors;
}


function simulateAutoFetch() {
    showAutoFetchLoadingState();
    
    // Simulate fetching data from backend
    setTimeout(() => {
        showAutoFetchSuccessState();
        showAlert('আপনার তথ্য সফলভাবে সংগ্রহ করা হয়েছে', 'success', '✓ সফল');
    }, 1500);
}

// Validate NID
function validateNID(nid) {
    if (!nid) return false;
    if (nid.length < 10 || nid.length > 17) return false;
    return /^\d+$/.test(nid);
}
