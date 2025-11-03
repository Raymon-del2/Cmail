# 🚀 C-mail Quick Start

## Installation (3 commands)

```bash
# 1. Install dependencies
npm install && cd client && npm install && cd ..

# 2. Create .env file (copy and edit with your credentials)
cp .env.example .env

# 3. Start the app
npm run dev
```

## What You Need

- ✅ Node.js installed
- ✅ MongoDB running (local or Atlas)
- ✅ Gmail account with app password

## URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Features You Get

| Feature | Description |
|---------|-------------|
| 🔐 Email/Password | Traditional sign-in with secure password hashing |
| ✨ Magic Link | Passwordless sign-in via email |
| 📧 Email Verification | Verify user email addresses |
| 🔑 Password Reset | Secure password recovery |
| 🛡️ JWT Auth | Token-based authentication |
| 🎨 Modern UI | Google-inspired design |

## File Structure

```
Cmail ver 2/
├── server/           ← Backend (Express + MongoDB)
├── client/           ← Frontend (React + Vite)
├── .env             ← Your credentials (create this!)
└── package.json     ← Root dependencies
```

## Common Commands

```bash
# Start everything
npm run dev

# Start backend only
npm run server

# Start frontend only
npm run client

# Build for production
cd client && npm run build
```

## Need Help?

- 📖 Full docs: `README.md`
- 🔧 Setup guide: `SETUP_GUIDE.md`
- ⚠️ Tailwind warnings? Install "Tailwind CSS IntelliSense" extension

## Copy-Paste .env Template

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/cmail
JWT_SECRET=change_this_to_random_string
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=C-mail <noreply@cmail.com>
CLIENT_URL=http://localhost:5173
MAGIC_LINK_EXPIRE=15m
```

---

**That's it! You're ready to go! 🎉**
