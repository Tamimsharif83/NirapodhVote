# Firebase OTP Setup Instructions

## Current Status: BACKEND OTP MODE (Working)

Your app is currently using **backend-generated OTP** which works perfectly for testing without any costs or limits.

---

## 🎯 How It Works Now (Backend Mode)

1. **User registers** → NID + Phone validation
2. **OTP page loads** → Backend automatically generates and logs OTP
3. **OTP displayed** → Check:
   - Browser alert popup (shows OTP for 8 seconds)
   - Browser console (F12) - look for `🔑 OTP Code:`
   - Backend server terminal - look for `📱 OTP Generated for testing:`
4. **User enters OTP** → Backend verifies and completes registration

**✅ No SMS costs, no daily limits, works immediately!**

---

## 🔥 To Enable Firebase Phone OTP (Optional - Requires Billing)

### Prerequisites:
1. **Upgrade to Firebase Blaze Plan** (Pay-as-you-go)
   - Go to: https://console.firebase.google.com
   - Select your project: `voting-856d3`
   - Click on "Upgrade to Blaze plan" in bottom left
   - Add billing information
   - **Cost**: ~$0.01-0.02 per SMS (very cheap)

2. **Enable Phone Authentication**
   - In Firebase Console → Authentication
   - Sign-in method → Phone → Enable
   - Add test phone numbers if needed

### Enable in Code:
1. Open `.env` file
2. Change: `USE_FIREBASE_OTP=false` → `USE_FIREBASE_OTP=true`
3. Restart server
4. Test registration flow

### Firebase Mode Features:
- ✅ Real SMS delivery to user's phone
- ✅ Professional production-ready
- ⚠️ Costs ~$0.01 per SMS
- ⚠️ Must maintain billing account

---

## 🐛 Troubleshooting

### Error: "auth/billing-not-enabled"
**Solution**: You need to upgrade to Firebase Blaze plan (see above)

### OTP Not Showing in Browser
**Solution**: 
1. Press F12 to open console
2. Look for: `🔑 OTP Code: 123456`
3. Check backend terminal for: `📱 OTP Generated for testing:`

### Backend OTP Not Working
**Check**:
1. Server is running: `node server.js`
2. MongoDB is connected
3. Check terminal logs for errors

---

## 📝 Current Configuration

**File: `.env`**
```env
USE_FIREBASE_OTP=false          # Backend mode (default)
DEV_MODE=true                    # Shows OTP in response
OTP_EXPIRY_MINUTES=2            # OTP valid for 2 minutes
```

---

## 🚀 Recommendation

**For Development/Testing**: 
- Keep `USE_FIREBASE_OTP=false` (current setting)
- Free, unlimited, instant OTP in console

**For Production**: 
- Set `USE_FIREBASE_OTP=true`
- Upgrade Firebase to Blaze plan
- Real SMS to users' phones
- Cost: ~$0.01 per SMS

---

## 💡 Testing Flow

1. Start server: `node server.js`
2. Open browser: `http://localhost:3000`
3. Go to Register page
4. Fill NID and Phone
5. Click "পরবর্তী"
6. **OTP automatically sent** - look at:
   - Browser popup alert (top of page)
   - Browser console (F12)
   - Backend terminal
7. Enter the OTP shown
8. Complete registration

**Done! No Firebase billing needed for testing.**
