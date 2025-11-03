# 📧 Brevo Email Setup (100% FREE)

## Why Brevo?
- ✅ **300 emails/day FREE forever**
- ✅ No credit card required
- ✅ Professional email delivery
- ✅ Better than Gmail for apps
- ✅ 99% delivery rate

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Brevo Account

1. **Go to:** https://app.brevo.com/account/register
2. **Enter your email** and create password
3. **Click "Sign up"**
4. **Check your email** and verify your account
5. **Complete the welcome wizard** (select "Transactional emails")

---

### Step 2: Get API Key

1. **After login, go to:** https://app.brevo.com/settings/keys/api
2. **Click "Create a new API key"**
3. **Name it:** `cmail-app`
4. **Copy the API key** (looks like: `xkeysib-abc123...`)
   - ⚠️ **Save it now!** You can't see it again
5. **Paste it in Notepad** temporarily

---

### Step 3: Update Your .env File

Open your `.env` file and add these lines:

```env
# Brevo Email Configuration
BREVO_API_KEY=xkeysib-your-actual-api-key-here
BREVO_USER=your-email@example.com
EMAIL_FROM=C-mail <noreply@cmail.com>
```

**Replace:**
- `xkeysib-your-actual-api-key-here` → Your actual Brevo API key
- `your-email@example.com` → Your email address

---

### Step 4: Remove Old Gmail Config (Optional)

You can comment out or remove the old Gmail settings:

```env
# Old Gmail config (not needed anymore)
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASSWORD=your-gmail-app-password
```

---

### Step 5: Restart Your Server

```powershell
# Press Ctrl+C to stop
npm run dev
```

---

### Step 6: Test It! 🎉

1. **Go to:** http://localhost:5173
2. **Click "Create a new account"**
3. **Use YOUR REAL EMAIL** (so you can receive the verification email)
4. **Fill in the form** and click "Create account"
5. **Check your inbox** - you should receive a verification email!
6. **Click the verification link**
7. **Sign in** - Success! 🎉

---

## ✅ Your Complete .env File Should Look Like:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb+srv://cmailadmin:Amblessed1%40%23@cmail-cluster.gw7e2qs.mongodb.net/cmail?appName=cmail-cluster

JWT_SECRET=cmail_2024_jwt_secret_a8f3k2m9p4x7q1w5e6r8t0y2u3i5o7p9
JWT_EXPIRE=7d

# Brevo Email (FREE)
BREVO_API_KEY=xkeysib-your-actual-api-key-here
BREVO_USER=your-email@example.com
EMAIL_FROM=C-mail <noreply@cmail.com>

CLIENT_URL=http://localhost:5173

MAGIC_LINK_EXPIRE=15m
```

---

## 🎯 What You Get (FREE):

- ✅ 300 emails per day
- ✅ Professional email delivery
- ✅ Email verification works
- ✅ Password reset works
- ✅ Magic link works
- ✅ No credit card needed
- ✅ Forever free

---

## 📊 Email Limits:

| Plan | Emails/Day | Cost |
|------|-----------|------|
| Free | 300 | $0 |
| Lite | 10,000 | $25/month |
| Premium | 20,000 | $65/month |

**For development and small apps, FREE is perfect!**

---

## 🆘 Troubleshooting:

### "Invalid API key"
- Make sure you copied the entire key
- Check for extra spaces
- Generate a new key if needed

### "Email not sending"
- Check terminal for error messages
- Verify API key is correct
- Make sure BREVO_USER is set

### "Email goes to spam"
- This is normal for development
- Check spam/junk folder
- In production, verify your domain with Brevo

---

## 🚀 Next Steps:

Once emails are working:
1. ✅ Test all features (signup, login, password reset, magic link)
2. ✅ Deploy to production (Vercel + Render)
3. ✅ Add custom domain (optional)
4. ✅ Build more features!

---

**Need help? Check the terminal output for error messages!**
