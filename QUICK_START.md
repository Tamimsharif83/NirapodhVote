# 🚀 Quick Start Guide - NirapodhVote Backend

## ✅ What's Been Set Up

Your project is now fully connected to MongoDB with a complete backend!

### Created Files:
1. **Backend Server**: `server.js` (main server file)
2. **Database Config**: `server/config/db.js`
3. **Models**: 
   - `server/models/User.js` (Citizen users)
   - `server/models/Admin.js` (Admin users)
   - `server/models/Vote.js` (Votes)
4. **API Routes**:
   - `server/routes/auth.js` (Login/Register)
   - `server/routes/vote.js` (Voting)
   - `server/routes/admin.js` (Admin panel)
5. **Frontend Integration**:
   - `assets/js/api-config.js` (API configuration)
   - `assets/js/login-backend.js` (Login with backend)
   - `assets/js/signup-backend.js` (Signup with backend)
   - `assets/js/register-backend.js` (Register with backend)
   - `assets/js/admin-login-backend.js` (Admin login)

## 🎯 Next Steps

### 1. Server is Already Running! ✅
The backend server is running at: **http://localhost:3000**

### 2. Admin Account Created ✅
```
Username: admin
Password: admin123
```

### 3. Update Your HTML Files

You need to include the backend JavaScript files in your HTML pages:

#### For `login.html` - Add before `</body>`:
```html
<script src="assets/js/api-config.js"></script>
<script src="assets/js/login-backend.js"></script>
<!-- You can comment out or remove the old login.js -->
<!-- <script src="assets/js/login.js"></script> -->
```

#### For `signup.html` - Add before `</body>`:
```html
<script src="assets/js/api-config.js"></script>
<script src="assets/js/signup-backend.js"></script>
<!-- <script src="assets/js/signup.js"></script> -->
```

#### For `register.html` - Add before `</body>`:
```html
<script src="assets/js/api-config.js"></script>
<script src="assets/js/register-backend.js"></script>
<!-- <script src="assets/js/register.js"></script> -->
```

#### For `admin-login.html` - Add before `</body>`:
```html
<script src="assets/js/api-config.js"></script>
<script src="assets/js/admin-login-backend.js"></script>
<!-- <script src="assets/js/admin-login.js"></script> -->
```

## 🧪 Testing Your Setup

### 1. Test Health Check
```bash
curl http://localhost:3000/api/health
```
Expected: `{"success":true,"message":"NirapodhVote Backend is running"}`

### 2. Test Admin Login
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```
Expected: Success response with token

### 3. Open Your Application
```bash
# Open in browser:
http://localhost:3000/index.html
http://localhost:3000/login.html
http://localhost:3000/admin-login.html
```

## 📊 API Endpoints Summary

### Public Endpoints:
- `GET /api/health` - Health check
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/vote/statistics` - Get vote statistics
- `POST /api/admin/login` - Admin login

### Protected Endpoints (Require Token):
- `GET /api/auth/me` - Get current user
- `POST /api/vote/cast` - Cast a vote
- `GET /api/vote/status` - Check vote status
- `GET /api/admin/statistics` - Admin dashboard stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/votes` - Get all votes

## 🔧 Common Commands

### Start Server:
```bash
npm start
```

### Start with Auto-reload (Development):
```bash
npm run dev
```

### Stop Server:
```bash
pkill -f "node server.js"
# or
Ctrl+C in the terminal
```

### View Server Logs:
Server logs appear in the terminal where you ran `npm start`

## 🔐 Important Security Notes

1. **Change Admin Password**: 
   - Login to admin panel
   - Change default password immediately!

2. **Update JWT Secret**:
   - Edit `.env` file
   - Change `JWT_SECRET` to a strong random string

3. **For Production**:
   - Set `NODE_ENV=production` in `.env`
   - Update CORS settings in `server.js`
   - Use HTTPS
   - Add rate limiting

## 🐛 Troubleshooting

### Server won't start:
```bash
# Check if port 3000 is in use
lsof -ti:3000
# Kill process if needed
lsof -ti:3000 | xargs kill -9
```

### MongoDB connection error:
- Check `.env` file for correct MongoDB URI
- Verify IP whitelist in MongoDB Atlas
- Check internet connection

### Frontend not connecting:
- Ensure server is running
- Check browser console for errors (F12)
- Verify API_CONFIG.BASE_URL in `api-config.js`

## 📱 What Works Now

✅ User Registration (with MongoDB)
✅ User Login (with JWT auth)
✅ Admin Login
✅ Password Hashing (bcrypt)
✅ Vote Casting
✅ Real-time Chat (Socket.IO)
✅ Admin Dashboard API
✅ Vote Statistics

## 🎨 What You Need to Update

The backend is ready! You just need to:

1. ✏️ Update HTML files to use new backend JavaScript files
2. 🎨 Optionally update citizen-dashboard.js to fetch data from API
3. 🎨 Optionally update admin.js to fetch data from API

## 📖 Full Documentation

See `BACKEND_README.md` for complete documentation including:
- Database schema
- Security features
- Deployment guide
- API reference

## 🎉 You're All Set!

Your backend is running and connected to MongoDB. Just update your HTML files to use the new backend JavaScript files and you're good to go!

**Current Status:**
- ✅ MongoDB Connected
- ✅ Server Running (Port 3000)
- ✅ Admin Created
- ✅ All APIs Working
- ⏳ Update HTML files (next step)

---

Need help? Check the terminal logs or the BACKEND_README.md file!
