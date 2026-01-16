// Twilio Service for OTP
require('dotenv').config();
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

/**
 * Send OTP via SMS using Twilio
 * @param {string} phoneNumber - Recipient phone number in E.164 format
 * @param {string} otp - OTP code to send
 * @returns {Promise} - Twilio message response
 */
async function sendOTP(phoneNumber, otp) {
  try {
    const message = await client.messages.create({
      body: `নিরাপদ ভোট - আপনার OTP কোড: ${otp}\n\nএই কোডটি ${process.env.OTP_EXPIRY_MINUTES || 2} মিনিটের জন্য বৈধ। কাউকে শেয়ার করবেন না।`,
      from: twilioPhoneNumber,
      to: phoneNumber
    });
    
    console.log('OTP sent successfully:', message.sid);
    return { success: true, messageSid: message.sid };
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
}

module.exports = {
  sendOTP
};
