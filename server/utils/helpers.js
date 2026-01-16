// Utility functions for phone normalization and OTP

/**
 * Normalize Bangladesh phone number to E.164 format (+8801XXXXXXXXX)
 * @param {string} phone - Input phone number
 * @returns {string|null} - Normalized phone number or null if invalid
 */
function normalizeBDPhone(phone) {
  if (!phone) return null;
  
  // Remove all spaces and hyphens
  phone = phone.replace(/\s|-/g, '');

  // Handle different formats
  if (phone.startsWith('01') && phone.length === 11) {
    return '+88' + phone;
  }
  if (phone.startsWith('8801') && phone.length === 13) {
    return '+' + phone;
  }
  if (phone.startsWith('+8801') && phone.length === 14) {
    return phone;
  }
  
  return null;
}

/**
 * Generate a random 6-digit OTP
 * @returns {string} - 6-digit OTP
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Calculate OTP expiry time
 * @param {number} minutes - Number of minutes until expiry
 * @returns {Date} - Expiry date
 */
function getOTPExpiry(minutes = 2) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

module.exports = {
  normalizeBDPhone,
  generateOTP,
  getOTPExpiry
};
