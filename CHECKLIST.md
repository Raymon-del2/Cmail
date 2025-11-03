# ✅ C-mail Setup Checklist

Use this checklist to ensure everything is configured correctly.

## Prerequisites

- [ ] Node.js installed (v16+)
  - Check: `node --version`
- [ ] npm installed
  - Check: `npm --version`
- [ ] MongoDB installed OR MongoDB Atlas account created
- [ ] Gmail account with 2FA enabled

## Installation Steps

- [ ] Run `npm install` in root directory
- [ ] Run `cd client && npm install` for frontend
- [ ] Create `.env` file from `.env.example`

## Configuration

### .env File Setup
- [ ] `PORT` set (default: 5000)
- [ ] `MONGODB_URI` configured
  - Local: `mongodb://localhost:27017/cmail`
  - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/cmail`
- [ ] `JWT_SECRET` set to random string
- [ ] `EMAIL_HOST` configured (smtp.gmail.com)
- [ ] `EMAIL_PORT` set (587)
- [ ] `EMAIL_USER` set to your Gmail
- [ ] `EMAIL_PASSWORD` set to Gmail app password
- [ ] `CLIENT_URL` set (http://localhost:5173)

### Gmail App Password Setup
- [ ] Go to Google Account → Security
- [ ] Enable 2-Factor Authentication
- [ ] Navigate to App Passwords
- [ ] Generate password for "Mail"
- [ ] Copy password to `.env` file

### MongoDB Setup
Choose one:

**Option A: Local MongoDB**
- [ ] MongoDB installed
- [ ] MongoDB service running
  - Windows: Check Services
  - Mac/Linux: `sudo systemctl status mongod`

**Option B: MongoDB Atlas**
- [ ] Account created at mongodb.com
- [ ] Free cluster created
- [ ] Database user created
- [ ] Network access configured (allow your IP or 0.0.0.0/0)
- [ ] Connection string copied to `.env`

## Testing

- [ ] Start the application: `npm run dev`
- [ ] Backend running on http://localhost:5000
  - Test: Visit http://localhost:5000/api/health
  - Should see: `{"status":"ok","message":"C-mail API is running"}`
- [ ] Frontend running on http://localhost:5173
  - Should see C-mail sign-in page
- [ ] MongoDB connected
  - Check terminal for: "✅ MongoDB connected successfully"

## Functionality Tests

- [ ] Sign Up
  - [ ] Create new account
  - [ ] Receive verification email
  - [ ] Click verification link
  - [ ] Account verified
- [ ] Sign In
  - [ ] Sign in with email/password
  - [ ] Redirected to dashboard
  - [ ] User info displayed
- [ ] Magic Link
  - [ ] Request magic link
  - [ ] Receive email
  - [ ] Click link
  - [ ] Signed in automatically
- [ ] Password Reset
  - [ ] Request password reset
  - [ ] Receive reset email
  - [ ] Click reset link
  - [ ] Set new password
  - [ ] Sign in with new password
- [ ] Dashboard
  - [ ] Profile information displayed
  - [ ] Sign out works

## Troubleshooting

### MongoDB Connection Failed
- [ ] Check if MongoDB is running
- [ ] Verify connection string in `.env`
- [ ] Check firewall settings
- [ ] For Atlas: Verify IP whitelist

### Email Not Sending
- [ ] Verify Gmail credentials in `.env`
- [ ] Check app password (not regular password)
- [ ] Ensure 2FA is enabled
- [ ] Check spam folder
- [ ] Try different email provider if Gmail fails

### Port Already in Use
- [ ] Change `PORT` in `.env`
- [ ] Kill process using port: `netstat -ano | findstr :5000`
- [ ] Restart application

### Frontend Not Loading
- [ ] Check if Vite dev server started
- [ ] Verify port 5173 is available
- [ ] Clear browser cache
- [ ] Check browser console for errors

### Tailwind CSS Warnings
- [ ] Install "Tailwind CSS IntelliSense" VS Code extension
- [ ] Reload VS Code window
- [ ] Warnings are cosmetic and won't affect functionality

## IDE Setup (Optional)

- [ ] Install recommended VS Code extensions:
  - [ ] Tailwind CSS IntelliSense
  - [ ] ESLint
  - [ ] Prettier
- [ ] Reload VS Code to apply settings

## Production Deployment (Future)

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Configure production MongoDB
- [ ] Set up production email service
- [ ] Build frontend: `cd client && npm run build`
- [ ] Add rate limiting
- [ ] Enable HTTPS
- [ ] Add security headers (helmet.js)

## Notes

- Tailwind warnings in `index.css` are normal and harmless
- First-time setup may take 5-10 minutes
- Keep `.env` file private (never commit to git)
- Default JWT tokens expire in 7 days

---

**All checked? You're ready to use C-mail! 🎉**

Need help? Check:
- `QUICK_START.md` for quick reference
- `SETUP_GUIDE.md` for detailed setup
- `README.md` for full documentation
