# Debugging Guide - OTP Not Working

## Steps to Debug

### 1. Open Browser Console
- Press `F12` or `Ctrl+Shift+I` (Linux/Windows) / `Cmd+Option+I` (Mac)
- Go to the **Console** tab

### 2. Test the Registration Form
1. Open: http://localhost:3000/register.html
2. Fill in the form:
   - NID: `8724522829`
   - Phone: `01788504010`
   - Date of Birth: `2004-12-29`
3. Click "যাচাই করুন ও OTP পাঠান"

### 3. Check Console Output
You should see detailed logs like:
```
=== Register Form Submitted ===
Form Values: {nid: "8724522829", phoneNumber: "01788504010", dob: "2004-12-29"}
Validation passed, setting button loading...
Calling API with: {nid: "8724522829", phoneNumber: "01788504010"}
=== API Request ===
Endpoint: SEND_OTP
URL: http://localhost:3000/api/auth/send-otp
Method: POST
Data: {nid: "8724522829", phoneNumber: "01788504010"}
```

### 4. Check Network Tab
- Go to **Network** tab in browser DevTools
- Look for a request to `/api/auth/send-otp`
- Check:
  - Status code (should be 200)
  - Response data
  - Request payload

### 5. Check Server Logs
The running server terminal should show:
- Incoming POST request to `/api/auth/send-otp`
- MongoDB query results
- Twilio API call
- Any errors

## Common Issues & Solutions

### Issue 1: No Console Logs at All
**Problem:** JavaScript not loading
**Solution:** 
- Check if `register-backend.js` is loaded (Network tab)
- Verify the script tag in register.html

### Issue 2: "SEND_OTP is not defined"
**Problem:** API endpoint not configured
**Solution:** 
- Check `api-config.js` has SEND_OTP endpoint
- Make sure file is loaded before register-backend.js

### Issue 3: CORS Error
**Problem:** Cross-origin request blocked
**Solution:**
- Server should allow CORS (already configured)
- Check if server is running on port 3000

### Issue 4: 404 Not Found
**Problem:** Endpoint doesn't exist
**Solution:**
- Verify `/api/auth/send-otp` route exists in server
- Check server.js has auth routes mounted

### Issue 5: 400 Bad Request
**Problem:** Validation failed on server
**Solutions:**
- NID not found in preregisteredcitizens
- Phone number doesn't match
- Missing required fields

### Issue 6: 500 Server Error
**Problem:** Server-side error
**Check server terminal for:**
- Database connection errors
- Twilio API errors
- Missing environment variables

## Quick Test Page

I've created a simple test page: http://localhost:3000/test-otp.html

This page will:
- Test the API directly
- Show detailed response
- Help isolate the issue

## Check These Files

1. **Server running?**
   ```bash
   # Check if server is running
   curl http://localhost:3000/
   ```

2. **MongoDB connected?**
   - Server terminal should show: "✅ MongoDB Connected"

3. **Twilio configured?**
   - Check .env file has:
     - TWILIO_ACCOUNT_SID
     - TWILIO_AUTH_TOKEN
     - TWILIO_PHONE_NUMBER

4. **Pre-registered citizen exists?**
   - Check MongoDB has the NID in preregisteredcitizens collection

## What to Share for Help

If still not working, share:
1. **Browser Console Output** (all logs)
2. **Network Tab** (request/response for send-otp)
3. **Server Terminal Output** (when you click submit)
4. Any error messages

## Expected Flow

✅ Click submit → Loading button  
✅ Form validation passes  
✅ API request sent  
✅ Server receives request  
✅ Check NID in database  
✅ Normalize phone number  
✅ Generate OTP  
✅ Save to database  
✅ Send SMS via Twilio  
✅ Return success response  
✅ Show success message  
✅ Redirect to verify-otp.html  
✅ Receive SMS on phone  

## Test Direct API Call

Open browser console on any page and run:
```javascript
fetch('http://localhost:3000/api/auth/send-otp', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    nid: '8724522829',
    phoneNumber: '01788504010'
  })
})
.then(r => r.json())
.then(data => console.log('Success:', data))
.catch(err => console.error('Error:', err));
```

This will test if the backend is working at all.
