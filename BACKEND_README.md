# NirapodhVote - Secure Voting System

A secure online voting system with real-time chat functionality, built with Express.js, MongoDB, and Socket.IO.

## Features

- 🗳️ **Secure Voting System**: One vote per citizen with NID verification
- 👤 **User Authentication**: JWT-based authentication for citizens and admins
- 📊 **Real-time Statistics**: Live voting results and analytics
- 💬 **Global Chat**: Real-time chat functionality using Socket.IO
- 🔐 **Admin Dashboard**: Comprehensive admin panel for monitoring
- 📱 **Responsive Design**: Works on all devices

## Technology Stack

### Backend
- **Express.js 5**: Web framework
- **MongoDB**: Database with Mongoose ODM
- **Socket.IO**: Real-time bidirectional communication
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing

### Frontend
- **HTML5, CSS3, JavaScript**: Core web technologies
- **Font Awesome**: Icons
- **Socket.IO Client**: Real-time chat

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB instance)
- npm or yarn

### Setup Instructions

1. **Clone or navigate to the project directory**
   ```bash
   cd /home/tamim/Documents/NirapodhVote
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - The `.env` file is already configured with MongoDB connection
   - Update `JWT_SECRET` in `.env` for production:
     ```
     JWT_SECRET=your-super-secret-key-here
     ```

4. **Create Initial Admin Account**
   After starting the server, create the first admin account by visiting:
   ```
   http://localhost:3000/api/admin/create-initial-admin
   ```
   
   Default admin credentials:
   - Username: `admin`
   - Password: `admin123`
   
   ⚠️ **IMPORTANT**: Change these credentials in production!

5. **Start the server**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Main Website: `http://localhost:3000`
   - Citizen Login: `http://localhost:3000/login.html`
   - Admin Login: `http://localhost:3000/admin-login.html`
   - Register: `http://localhost:3000/register.html`

## Project Structure

```
NirapodhVote/
├── server/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Admin.js             # Admin model
│   │   └── Vote.js              # Vote model
│   └── routes/
│       ├── auth.js              # Authentication routes
│       ├── vote.js              # Voting routes
│       └── admin.js             # Admin routes
├── assets/
│   ├── css/                     # Stylesheets
│   ├── js/
│   │   ├── api-config.js        # API configuration
│   │   ├── login-backend.js     # Login with backend
│   │   ├── signup-backend.js    # Signup with backend
│   │   ├── admin-login-backend.js # Admin login
│   │   └── citizen_chat.js      # Chat functionality
│   └── images/                  # Images
├── *.html                       # HTML pages
├── server.js                    # Main server file
├── package.json                 # Dependencies
└── .env                         # Environment variables
```

## API Endpoints

### Authentication (Public)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info (requires auth)

### Voting (Protected)
- `POST /api/vote/cast` - Cast a vote
- `GET /api/vote/status` - Check vote status
- `GET /api/vote/statistics` - Get vote statistics (public)

### Admin (Protected)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/statistics` - Get admin dashboard statistics
- `GET /api/admin/users` - Get all registered users
- `GET /api/admin/votes` - Get all votes
- `POST /api/admin/create-initial-admin` - Create first admin (one-time use)

## Updating HTML Files to Use Backend

To connect your HTML files to the backend, add these script tags **before** the existing JavaScript files:

### For login.html:
```html
<script src="assets/js/api-config.js"></script>
<script src="assets/js/login-backend.js"></script>
```

### For signup.html:
```html
<script src="assets/js/api-config.js"></script>
<script src="assets/js/signup-backend.js"></script>
```

### For register.html:
```html
<script src="assets/js/api-config.js"></script>
<script src="assets/js/register-backend.js"></script>
```

### For admin-login.html:
```html
<script src="assets/js/api-config.js"></script>
<script src="assets/js/admin-login-backend.js"></script>
```

## Database Schema

### User Collection
- `nid`: National ID (unique)
- `password`: Hashed password
- `name`: Full name
- `dob`: Date of birth
- `fatherName`: Father's name
- `motherName`: Mother's name
- `permanentAddress`: Permanent address
- `presentAddress`: Present address
- `hasVoted`: Boolean flag
- `votedAt`: Timestamp of vote
- `votedCandidate`: Candidate ID

### Vote Collection
- `candidate`: Candidate ID
- `userId`: Reference to User
- `nid`: Voter's NID
- `timestamp`: Vote timestamp
- `ipAddress`: Voter's IP

### Admin Collection
- `username`: Admin username
- `password`: Hashed password
- `role`: Admin role (admin/superadmin)

## Security Features

- 🔐 Password hashing with bcrypt
- 🎫 JWT-based authentication
- 🛡️ Input sanitization for chat messages
- ✅ One vote per user enforcement
- 🔒 Protected API routes
- 🚫 CORS configuration

## Development

### Running Tests
```bash
npm test
```

### Debugging
Set `NODE_ENV=development` in `.env` for detailed logs.

### Database Management
Access your MongoDB Atlas dashboard to view/manage data:
https://cloud.mongodb.com/

## Production Deployment

### Before Deploying:

1. **Update Environment Variables**
   - Change `JWT_SECRET` to a strong random string
   - Set `NODE_ENV=production`
   - Update CORS settings in `server.js`

2. **Change Admin Password**
   - Login to admin dashboard
   - Create a new admin account
   - Delete the default admin account

3. **Configure MongoDB**
   - Ensure IP whitelist is configured
   - Use connection string with SSL

4. **Security Checklist**
   - [ ] Strong JWT secret
   - [ ] Changed default admin credentials
   - [ ] HTTPS enabled
   - [ ] CORS properly configured
   - [ ] Rate limiting implemented
   - [ ] Input validation on all endpoints

## Troubleshooting

### Cannot connect to MongoDB
- Check if MongoDB connection string is correct in `.env`
- Verify IP address is whitelisted in MongoDB Atlas
- Check network connectivity

### Port already in use
- Change `PORT` in `.env` file
- Or stop the process using port 3000:
  ```bash
  lsof -ti:3000 | xargs kill -9
  ```

### Admin login not working
- Ensure you created the initial admin account
- Check browser console for errors
- Verify API endpoint is accessible

## Support

For issues and questions, please check:
1. Console logs in browser (F12)
2. Server logs in terminal
3. MongoDB Atlas logs

## License

ISC License

## Author

Tamim Sharif

---

**⚠️ Important Notes:**
- Always use HTTPS in production
- Regularly backup your MongoDB database
- Keep dependencies updated
- Monitor server logs for suspicious activity
- Implement rate limiting for production use
