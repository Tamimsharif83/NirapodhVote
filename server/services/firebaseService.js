// Firebase Service for Phone Authentication
require('dotenv').config();

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Export Firebase configuration for client-side use
function getFirebaseConfig() {
  console.log('🔥 Firebase config requested');
  return firebaseConfig;
}

/**
 * Validate Firebase configuration
 * @returns {boolean} - True if all required config is present
 */
function validateFirebaseConfig() {
  const required = ['apiKey', 'authDomain', 'projectId'];
  const missing = required.filter(key => !firebaseConfig[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing Firebase config:', missing);
    return false;
  }
  
  console.log('✅ Firebase configuration validated');
  return true;
}

module.exports = {
  getFirebaseConfig,
  validateFirebaseConfig,
  firebaseConfig
};
