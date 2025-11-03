# 🚀 C-mail Backend Setup Guide (100% Free)

## Step 1: Create MongoDB Atlas Account (Free Forever)

### 1.1 Sign Up
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google or email (it's free)
3. Choose the **FREE M0 tier** (512MB storage)

### 1.2 Create a Cluster
1. Click "Build a Database"
2. Choose **M0 FREE** tier
3. Select a cloud provider (AWS recommended)
4. Choose a region close to you
5. Name your cluster (e.g., "cmail-cluster")
6. Click "Create"

### 1.3 Create Database User
1. Go to "Database Access" in left menu
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `cmailadmin` (or your choice)
5. Password: Click "Autogenerate Secure Password" and **SAVE IT**
6. User Privileges: "Read and write to any database"
7. Click "Add User"

### 1.4 Allow Network Access
1. Go to "Network Access" in left menu
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Or add your current IP address
5. Click "Confirm"

### 1.5 Get Connection String
1. Go to "Database" in left menu
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like):
   ```
   mongodb+srv://cmailadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add `/cmail` before the `?` to specify database name:
   ```
   mongodb+srv://cmailadmin:yourpassword@cluster0.xxxxx.mongodb.net/cmail?retryWrites=true&w=majority
   ```

---

## Step 2: Set Up Gmail SMTP (Free)

### 2.1 Enable 2-Factor Authentication
1. Go to https://myaccount.google.com/security
2. Enable "2-Step Verification"
3. Follow the setup wizard

### 2.2 Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select app: "Mail"
3. Select device: "Windows Computer" (or your device)
4. Click "Generate"
5. **COPY THE 16-CHARACTER PASSWORD** (e.g., `abcd efgh ijkl mnop`)
6. Remove spaces: `abcdefghijklmnop`

---

## Step 3: Create .env File

Run this command in PowerShell:

```powershell
Copy-Item .env.example .env
```

Then open `.env` and fill in your details:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection (paste your Atlas connection string)
MONGODB_URI=mongodb+srv://cmailadmin:yourpassword@cluster0.xxxxx.mongodb.net/cmail?retryWrites=true&w=majority

# JWT Secret (I've generated a secure one for you)
JWT_SECRET=cmail_jwt_secret_2024_secure_random_key_change_in_production
JWT_EXPIRE=7d

# Email Configuration (your Gmail details)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM=C-mail <noreply@cmail.com>

# Frontend URL
CLIENT_URL=http://localhost:5173

# Magic Link Configuration
MAGIC_LINK_EXPIRE=15m
```

---

## Step 4: Test the Backend

### 4.1 Restart the Server
```powershell
# Stop current server (Ctrl+C)
# Then restart
npm run dev
```

### 4.2 Check MongoDB Connection
Look for this in the terminal:
```
✅ MongoDB connected successfully
🚀 C-mail server running on port 5000
```

### 4.3 Test API Health
Open browser and go to:
```
http://localhost:5000/api/health
```

You should see:
```json
{"status":"ok","message":"C-mail API is running"}
```

---

## Step 5: Test Full Authentication Flow

### 5.1 Create an Account
1. Go to http://localhost:5173
2. Click "Create a new account"
3. Fill in your details
4. Use a real email address (you'll receive verification email)
5. Click "Create account"

### 5.2 Check Email
1. Check your inbox for verification email
2. Click the verification link
3. You should see "Email verified successfully"

### 5.3 Sign In
1. Go back to sign-in page
2. Enter your email and password
3. You should be redirected to the dashboard

### 5.4 Test Magic Link (Optional)
1. Sign out
2. On sign-in page, click "Sign in with Magic Link"
3. Enter your email
4. Check your email for the magic link
5. Click the link - you'll be signed in automatically

---

## Troubleshooting

### MongoDB Connection Error
**Error:** `MongoServerError: bad auth`
- Check username and password in connection string
- Make sure you replaced `<password>` with actual password
- Verify user has correct permissions

**Error:** `MongooseServerSelectionError`
- Check network access settings in Atlas
- Make sure your IP is whitelisted
- Try "Allow Access from Anywhere"

### Email Not Sending
**Error:** `Invalid login`
- Make sure you're using App Password, not regular password
- Verify 2FA is enabled on Gmail
- Check for typos in EMAIL_USER and EMAIL_PASSWORD

**Emails go to spam:**
- This is normal for development
- Check spam/junk folder
- In production, use a proper email service

### Port Already in Use
**Error:** `EADDRINUSE: address already in use`
```powershell
# Find and kill the process
netstat -ano | findstr :5000
taskkill /PID <process_id> /F
```

---

## Cost Breakdown (All FREE! 🎉)

| Service | Free Tier | Monthly Cost |
|---------|-----------|--------------|
| MongoDB Atlas | 512MB storage | $0 |
| Gmail SMTP | 500 emails/day | $0 |
| Development | Unlimited | $0 |
| **TOTAL** | | **$0/month** |

---

## Next Steps

Once everything works:
- ✅ Your backend is fully functional
- ✅ You can create accounts
- ✅ Email verification works
- ✅ Password reset works
- ✅ Magic link authentication works

For production deployment, see `README.md` for hosting options (also free tiers available on Vercel, Render, etc.)

---

**Need help? Check the terminal output for specific error messages!**
