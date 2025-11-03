# ⚡ Quick Backend Setup (5 Minutes)

## What You Need (All FREE):
1. ✅ Gmail account
2. ✅ 5 minutes of your time

---

## Option 1: Use Local MongoDB (Fastest - No Sign-ups)

If you have MongoDB installed locally:

1. **Edit your `.env` file** (it's already created)
2. **Keep this line as-is:**
   ```
   MONGODB_URI=mongodb://localhost:27017/cmail
   ```
3. **Add your Gmail:**
   - Go to https://myaccount.google.com/apppasswords
   - Generate app password
   - Add to `.env`:
     ```
     EMAIL_USER=youremail@gmail.com
     EMAIL_PASSWORD=your-app-password
     ```
4. **Start MongoDB:**
   ```powershell
   # Windows: MongoDB should auto-start
   # Or manually: mongod
   ```
5. **Restart the app:**
   ```powershell
   npm run dev
   ```

✅ **Done! Skip to "Test It" section below**

---

## Option 2: Use MongoDB Atlas (Free Cloud - Recommended)

### Step 1: Create MongoDB Atlas Account (2 minutes)
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google (fastest)
3. Choose **FREE M0** tier
4. Click through the setup wizard

### Step 2: Get Connection String (1 minute)
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. It looks like: `mongodb+srv://user:pass@cluster.mongodb.net/`

### Step 3: Update .env File (1 minute)
Open `.env` and replace the MongoDB line:
```env
MONGODB_URI=mongodb+srv://your-user:your-password@cluster0.xxxxx.mongodb.net/cmail?retryWrites=true&w=majority
```

### Step 4: Gmail Setup (1 minute)
1. Go to: https://myaccount.google.com/apppasswords
2. Generate password for "Mail"
3. Copy the 16-character password
4. Add to `.env`:
```env
EMAIL_USER=youremail@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```

### Step 5: Restart (10 seconds)
```powershell
# Press Ctrl+C to stop
npm run dev
```

---

## Test It! 🎉

### 1. Check Terminal Output
You should see:
```
✅ MongoDB connected successfully
🚀 C-mail server running on port 5000
```

### 2. Test API
Open browser: http://localhost:5000/api/health

Should show:
```json
{"status":"ok","message":"C-mail API is running"}
```

### 3. Create Account
1. Go to: http://localhost:5173
2. Click "Create a new account"
3. Fill in details with YOUR REAL EMAIL
4. Click "Create account"
5. Check your email inbox
6. Click verification link
7. Sign in!

---

## Troubleshooting

### "MongoDB connection error"
- **Local MongoDB**: Make sure MongoDB is running
- **Atlas**: Check your connection string has correct password

### "Email not sending"
- Make sure you're using **App Password**, not regular password
- Check Gmail 2FA is enabled
- Look in spam folder

### "Port 5000 already in use"
- Change PORT in `.env` to 3000 or 8000

---

## Your .env File Should Look Like:

```env
PORT=5000
NODE_ENV=development

# Option 1: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/cmail

# OR Option 2: MongoDB Atlas
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/cmail?retryWrites=true

JWT_SECRET=cmail_2024_jwt_secret_a8f3k2m9p4x7q1w5e6r8t0y2u3i5o7p9
JWT_EXPIRE=7d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM=C-mail <noreply@cmail.com>

CLIENT_URL=http://localhost:5173
MAGIC_LINK_EXPIRE=15m
```

---

## That's It! 🚀

Your backend is now fully functional with:
- ✅ User registration
- ✅ Email verification
- ✅ Password authentication
- ✅ Magic link sign-in
- ✅ Password reset
- ✅ JWT tokens

**All using 100% FREE services!**

Need detailed help? See `BACKEND_SETUP.md`
