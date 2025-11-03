# C-mail Quick Setup Guide

## Step 1: Install Dependencies

Open your terminal in the project root and run:

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

## Step 2: Set Up Environment Variables

Create a `.env` file in the root directory and add:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/cmail
JWT_SECRET=your_random_secret_key_here
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=C-mail <noreply@cmail.com>
CLIENT_URL=http://localhost:5173
MAGIC_LINK_EXPIRE=15m
```

### Get Gmail App Password:
1. Go to Google Account → Security
2. Enable 2-Factor Authentication
3. Go to App Passwords
4. Generate password for "Mail"
5. Copy and paste into `EMAIL_PASSWORD`

## Step 3: Install MongoDB

### Option A: Local MongoDB
Download and install from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

### Option B: MongoDB Atlas (Free Cloud)
1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string
4. Replace `MONGODB_URI` in `.env`

## Step 4: Start the Application

```bash
# Start both frontend and backend
npm run dev
```

Or run separately:
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
npm run client
```

## Step 5: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## Fix IDE Warnings (Optional)

The Tailwind CSS warnings in `index.css` are harmless. To remove them:

1. Install the **Tailwind CSS IntelliSense** extension in VS Code
2. Reload VS Code

The `.vscode/settings.json` file I created will automatically configure this.

## Testing the Application

1. Go to http://localhost:5173
2. Click "Create a new account"
3. Fill in your details
4. Check your email for verification link
5. Sign in and explore!

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running: `mongod`
- Check your connection string in `.env`

### Email Not Sending
- Verify Gmail app password is correct
- Make sure 2FA is enabled on Gmail
- Check spam folder

### Port Already in Use
- Change `PORT` in `.env` to another number (e.g., 3000)

## Next Steps

- Customize the UI colors in `client/tailwind.config.js`
- Add more features to the dashboard
- Deploy to production (Vercel, Netlify, Heroku)

Need help? Check the full README.md for detailed documentation!
