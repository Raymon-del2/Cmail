# C-mail Authentication System

A complete authentication system that clones Google's sign-in experience using open-source, free technologies.

## Features

✅ **Email/Password Authentication** - Secure password-based sign-in with bcrypt hashing  
✅ **Magic Link Sign-In** - Passwordless authentication via email  
✅ **Email Verification** - Verify user email addresses  
✅ **Password Reset** - Secure password recovery flow  
✅ **JWT Tokens** - Stateless session management  
✅ **Protected Routes** - Client-side route protection  
✅ **Modern UI** - Google-inspired design with TailwindCSS  
✅ **Responsive Design** - Works on all devices  

## Tech Stack

### Backend
- **Node.js** + **Express** - Server framework
- **MongoDB** - Database (free tier available on MongoDB Atlas)
- **Mongoose** - ODM for MongoDB
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **Nodemailer** - Email sending

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **React Router** - Client-side routing
- **TailwindCSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas account)
- Gmail account (for sending emails) or other SMTP service

### Step 1: Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/cmail
# Or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/cmail

# JWT Secret (generate a secure random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=C-mail <noreply@cmail.com>

# Frontend URL
CLIENT_URL=http://localhost:5173

# Magic Link Configuration
MAGIC_LINK_EXPIRE=15m
```

### Step 3: Set Up Email (Gmail Example)

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to Security → 2-Step Verification → App passwords
   - Select "Mail" and your device
   - Copy the generated password
4. Use this password in `EMAIL_PASSWORD` in your `.env` file

### Step 4: Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**Or use MongoDB Atlas:**
- Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster
- Get your connection string
- Add it to `MONGODB_URI` in `.env`

### Step 5: Run the Application

```bash
# Development mode (runs both server and client)
npm run dev

# Or run separately:
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Sign in with email/password
- `POST /api/auth/magic-link` - Request magic link
- `GET /api/auth/verify-magic-link/:token` - Verify magic link
- `GET /api/auth/verify-email/:token` - Verify email address
- `POST /api/auth/resend-verification` - Resend verification email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password
- `POST /api/auth/signout` - Sign out
- `POST /api/auth/refresh` - Refresh JWT token

### User
- `GET /api/user/me` - Get current user profile
- `PUT /api/user/me` - Update user profile
- `PUT /api/user/password` - Update password
- `DELETE /api/user/me` - Delete account

## Project Structure

```
cmail-auth/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context (Auth)
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/                # Express backend
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   └── index.js          # Server entry point
├── .env.example          # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Usage Examples

### Sign Up
```javascript
POST /api/auth/signup
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Sign In
```javascript
POST /api/auth/signin
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Magic Link
```javascript
POST /api/auth/magic-link
{
  "email": "john@example.com"
}
```

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **HTTP-Only Cookies**: Optional cookie storage
- **CORS Protection**: Configured CORS policy
- **Input Validation**: express-validator for request validation
- **Rate Limiting**: Recommended for production
- **Email Verification**: Prevents fake accounts
- **Password Reset**: Secure token-based reset flow

## Production Deployment

### Environment Variables
- Set `NODE_ENV=production`
- Use strong `JWT_SECRET`
- Configure production MongoDB URI
- Set up production email service

### Recommended Additions
- Add rate limiting (express-rate-limit)
- Enable HTTPS
- Add helmet.js for security headers
- Implement refresh token rotation
- Add logging (winston, morgan)
- Set up monitoring (PM2, New Relic)

### Build Frontend
```bash
cd client
npm run build
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string format
- Verify network access (MongoDB Atlas)

### Email Not Sending
- Verify SMTP credentials
- Check Gmail app password
- Ensure 2FA is enabled for Gmail
- Check firewall/network settings

### Port Already in Use
```bash
# Change PORT in .env file
PORT=3000
```

## License
Attribution Required !
This application requires attribution to Coded Waves.

Please add the following to your footer:

<a href="https://rayfolio.vercel.app">By Coded Waves</a>
Contact the creator for a creator license.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on GitHub.
