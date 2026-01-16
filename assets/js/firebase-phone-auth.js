// Firebase Phone Authentication Module
// This module handles Firebase phone authentication for OTP verification

class FirebasePhoneAuth {
  constructor() {
    this.app = null;
    this.auth = null;
    this.recaptchaVerifier = null;
    this.confirmationResult = null;
    this.initialized = false;
  }

  /**
   * Initialize Firebase with config from backend
   */
  async initialize() {
    if (this.initialized) {
      console.log('🔥 Firebase already initialized');
      return true;
    }

    try {
      console.log('🔥 Initializing Firebase...');
      
      // Get Firebase config from backend
      const response = await fetch('http://localhost:3000/api/auth/firebase-config');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error('Failed to get Firebase config');
      }

      console.log('✅ Firebase config received');

      // Import Firebase modules dynamically
      const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
      const { getAuth, RecaptchaVerifier, signInWithPhoneNumber } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');

      // Store Firebase modules
      this.signInWithPhoneNumber = signInWithPhoneNumber;
      this.RecaptchaVerifier = RecaptchaVerifier;

      // Initialize Firebase app
      this.app = initializeApp(data.config);
      this.auth = getAuth(this.app);
      
      console.log('✅ Firebase initialized successfully');
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('❌ Firebase initialization failed:', error);
      return false;
    }
  }

  /**
   * Setup reCAPTCHA verifier
   * @param {string} containerId - ID of the container element for reCAPTCHA
   */
  setupRecaptcha(containerId = 'recaptcha-container') {
    try {
      console.log('🔒 Setting up reCAPTCHA...');
      
      // Check if container exists
      const container = document.getElementById(containerId);
      if (!container) {
        console.error('❌ reCAPTCHA container not found:', containerId);
        return false;
      }

      // Clear any existing reCAPTCHA
      container.innerHTML = '';

      this.recaptchaVerifier = new this.RecaptchaVerifier(this.auth, containerId, {
        'size': 'normal',
        'callback': (response) => {
          console.log('✅ reCAPTCHA verified');
        },
        'expired-callback': () => {
          console.log('⚠️ reCAPTCHA expired');
        }
      });

      console.log('✅ reCAPTCHA setup complete');
      return true;
    } catch (error) {
      console.error('❌ reCAPTCHA setup failed:', error);
      return false;
    }
  }

  /**
   * Send OTP to phone number using Firebase
   * @param {string} phoneNumber - Phone number in E.164 format (e.g., +8801788504010)
   * @returns {Promise<Object>} - Success status and message
   */
  async sendOTP(phoneNumber) {
    try {
      console.log('📱 Sending OTP to:', phoneNumber);
      
      if (!this.initialized) {
        throw new Error('Firebase not initialized');
      }

      if (!this.recaptchaVerifier) {
        throw new Error('reCAPTCHA not setup');
      }

      // Ensure phone number is in E.164 format
      let formattedPhone = phoneNumber;
      if (!phoneNumber.startsWith('+')) {
        // Assume Bangladesh number if no country code
        formattedPhone = '+88' + phoneNumber.replace(/^0+/, '');
      }

      console.log('📞 Formatted phone:', formattedPhone);

      // Send verification code
      this.confirmationResult = await this.signInWithPhoneNumber(
        this.auth,
        formattedPhone,
        this.recaptchaVerifier
      );

      console.log('✅ OTP sent successfully');
      console.log('⚠️ SMS sent - Check your phone (Daily limit: 10 messages)');

      return {
        success: true,
        message: 'OTP sent successfully',
        confirmationResult: this.confirmationResult
      };
    } catch (error) {
      console.error('❌ Failed to send OTP:', error);
      
      // Handle specific Firebase errors
      let errorMessage = 'Failed to send OTP';
      
      if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number format';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later';
      } else if (error.code === 'auth/quota-exceeded') {
        errorMessage = 'Daily SMS quota exceeded (10 messages/day limit)';
      }

      return {
        success: false,
        message: errorMessage,
        error: error.message
      };
    }
  }

  /**
   * Verify OTP code
   * @param {string} code - OTP code entered by user
   * @returns {Promise<Object>} - Verification result with user credential
   */
  async verifyOTP(code) {
    try {
      console.log('🔐 Verifying OTP:', code);

      if (!this.confirmationResult) {
        throw new Error('No confirmation result available. Send OTP first');
      }

      // Confirm the verification code
      const result = await this.confirmationResult.confirm(code);
      
      console.log('✅ OTP verified successfully');
      console.log('👤 User:', result.user.phoneNumber);

      return {
        success: true,
        message: 'OTP verified successfully',
        user: result.user,
        phoneNumber: result.user.phoneNumber
      };
    } catch (error) {
      console.error('❌ OTP verification failed:', error);
      
      let errorMessage = 'Invalid OTP code';
      
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = 'Invalid OTP code';
      } else if (error.code === 'auth/code-expired') {
        errorMessage = 'OTP code has expired';
      }

      return {
        success: false,
        message: errorMessage,
        error: error.message
      };
    }
  }

  /**
   * Reset reCAPTCHA for resending OTP
   */
  resetRecaptcha() {
    console.log('🔄 Resetting reCAPTCHA...');
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
  }

  /**
   * Cleanup and sign out
   */
  async cleanup() {
    try {
      console.log('🧹 Cleaning up Firebase...');
      
      if (this.auth && this.auth.currentUser) {
        await this.auth.signOut();
      }
      
      this.resetRecaptcha();
      this.confirmationResult = null;
      
      console.log('✅ Cleanup complete');
    } catch (error) {
      console.error('❌ Cleanup error:', error);
    }
  }
}

// Create and export singleton instance
const firebasePhoneAuth = new FirebasePhoneAuth();

// Auto-initialize when module loads
(async () => {
  try {
    await firebasePhoneAuth.initialize();
  } catch (error) {
    console.error('❌ Auto-initialization failed:', error);
  }
})();

// Export for use in other modules
window.firebasePhoneAuth = firebasePhoneAuth;
