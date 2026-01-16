// Service for sending SMS via panel.smsbangladesh.com
const axios = require('axios');

/**
 * Send OTP via SMS Bangladesh
 * @param {string} phoneNumber - Recipient phone number (e.g., "017XXXXXXXX" or "+88017XXXXXXXX")
 * @param {string} message - Message content
 * @returns {Promise<Object>} - API response
 */
const sendSMS = async (phoneNumber, message) => {
  try {
    // Check if SMS service is configured
    const user = process.env.SMS_USER;
    const password = process.env.SMS_PASSWORD;
    const senderId = process.env.SMS_SENDER_ID;
    const apiUrl = process.env.SMS_OTP_URL || 'http://panel.smsbangladesh.com/otp';

    if (!user || !password || user === 'your_username_here') {
      console.warn('⚠️ SMS Configuration missing. OTP will be logged to console only.');
      return { success: false, message: 'SMS Gateway not configured' };
    }

    // Format phone number: Remove +88 if present, ensure it starts with 01
    // API expects: 88017XXXXXXXX (without +) or sometimes just 017... 
    // Documentation says: "Eg: 8801316686977 (Do not use "+" before the country code)"
    let formattedPhone = phoneNumber.replace(/[^0-9]/g, ''); // Remove non-digits
    
    // If starts with 8801... keep it. 
    // If starts with 01... add 88.
    if (formattedPhone.startsWith('01') && formattedPhone.length === 11) {
        formattedPhone = '88' + formattedPhone;
    } else if (formattedPhone.startsWith('8801') && formattedPhone.length === 13) {
        // Already in 8801... format
    } else {
        console.warn('⚠️ Invalid phone format for SMS:', phoneNumber);
        // Attempt to send anyway if it looks plausible, or fail?
        // Let's rely on validation before this, but ensure we don't send '+'
    }

    // Construct request
    // URL format: http://panel.smsbangladesh.com/otp?user=x&password=x&to=x&text=x  (for non-masking)
    /*
        If SMS_SENDER_ID is set (Masking): add 'from' parameter
        If SMS_SENDER_ID is empty (Non-Masking): do not add 'from' parameter
    */
    const params = {
        user: user,
        password: password,
        to: formattedPhone,
        text: message
    };
    
    // Only add 'from' if senderId is configured and not empty
    if (senderId && senderId.trim() !== '') {
        params.from = senderId;
    }

    console.log(`📤 Sending SMS to ${formattedPhone} via ${apiUrl} (Masking: ${params.from ? 'Yes' : 'No'})...`);

    const response = await axios.get(apiUrl, { params });

    /* 
    Sample Response:
    {
        "success": 1,
        "message": "SMS send successfully.",
        "response_code": 100,
        "campaign_cost": 0.50,
        "status": "Delivered"
    }
    */

    if (response.data && response.data.success === 1) {
      console.log('✅ SMS Sent successfully:', response.data);
      return { success: true, response: response.data };
    } else {
      console.error('❌ SMS API Error:', response.data);
      throw new Error(response.data.message || 'Unknown SMS API error');
    }

  } catch (error) {
    console.error('❌ Send SMS Failed:', error.message);
    throw error;
  }
};

module.exports = { sendSMS };
