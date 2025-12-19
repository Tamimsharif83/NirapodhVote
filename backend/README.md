# নিরাপদ ভোট - Backend API

MongoDB সহ Node.js ব্যাকএন্ড সার্ভার

## 🚀 সেটআপ পদ্ধতি

### ১. MongoDB ইনস্টল করুন

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y mongodb

# MongoDB চালু করুন
sudo systemctl start mongodb
sudo systemctl enable mongodb

# স্ট্যাটাস চেক করুন
sudo systemctl status mongodb
```

### ২. Dependencies ইনস্টল করুন

```bash
cd backend
npm install
```

### ৩. Environment Variables কনফিগার করুন

`.env` ফাইল ইতিমধ্যে তৈরি হয়েছে। প্রয়োজনে পরিবর্তন করুন:

```env
MONGODB_URI=mongodb://localhost:27017/nirapod_vote
PORT=5000
JWT_SECRET=your_secure_secret_key
```

### ৪. সার্ভার চালু করুন

```bash
# Development mode (auto-restart)
npm run dev

# Production mode
npm start
```

সার্ভার চালু হবে: `http://localhost:5000`

## 📊 Database Models

### Created Models:
- **Citizen** - নাগরিক তথ্য (NID, পাসওয়ার্ড, ভোট রেকর্ড)
- **Admin** - প্রশাসক তথ্য
- **Ballot** - ব্যালট ও নির্বাচন তথ্য
- **Vote** - ভোট রেকর্ড (anonymous)
- **Notice** - নোটিশ ব্যবস্থাপনা
- **Complaint** - অভিযোগ ব্যবস্থাপনা

## 🔌 API Endpoints (Coming Soon)

### Authentication
- `POST /api/auth/register` - নাগরিক নিবন্ধন
- `POST /api/auth/login` - লগইন
- `POST /api/auth/admin/login` - প্রশাসক লগইন

### Ballot Management
- `GET /api/ballot` - সকল ব্যালট দেখুন
- `POST /api/ballot` - নতুন ব্যালট তৈরি (Admin)
- `GET /api/ballot/:id` - নির্দিষ্ট ব্যালট

### Voting
- `POST /api/vote` - ভোট দিন
- `GET /api/vote/results/:ballotId` - ফলাফল দেখুন

## 🧪 Testing

```bash
# Test MongoDB connection
curl http://localhost:5000/health

# Test root endpoint
curl http://localhost:5000
```

## 📁 Project Structure

```
backend/
├── models/
│   ├── Citizen.js
│   ├── Admin.js
│   ├── Ballot.js
│   ├── Vote.js
│   ├── Notice.js
│   └── Complaint.js
├── routes/          # (Create next)
├── controllers/     # (Create next)
├── middleware/      # (Create next)
├── .env
├── .gitignore
├── server.js
└── package.json
```

## 🔐 Security Features

- Password hashing with bcrypt
- JWT authentication
- Anonymous voting
- Encrypted vote storage
- CORS protection

## 📝 Next Steps

1. Create API routes
2. Implement authentication middleware
3. Add input validation
4. Connect frontend to backend
5. Implement file upload for photos
6. Add OTP verification
7. Create admin panel APIs

## 🐛 Troubleshooting

### MongoDB connection failed?
```bash
# Check if MongoDB is running
sudo systemctl status mongodb

# Start MongoDB
sudo systemctl start mongodb
```

### Port already in use?
```bash
# Change PORT in .env file
PORT=3001
```

## 📞 সাহায্য

সমস্যা হলে: support@nirapod-vote.gov.bd
