# 🚀 Cmail Deployment Guide

## Prerequisites
- Node.js 18+ installed
- MongoDB database (MongoDB Atlas recommended)
- Vercel account (for deployment)

## Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Email Service (Optional - for email verification)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Client URL
CLIENT_URL=http://localhost:5173

# Server
PORT=5000
NODE_ENV=development
```

## Local Development

1. **Install Dependencies**
```bash
npm install
```

2. **Start Development Server**
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend on http://localhost:5173

## Production Build

1. **Build Client**
```bash
cd client
npm run build
```

2. **Start Production Server**
```bash
npm start
```

## Vercel Deployment

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Set Environment Variables**
```bash
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add CLIENT_URL
```

### Option 2: Deploy via GitHub

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin your-repo-url
git push -u origin main
```

2. **Import to Vercel**
- Go to https://vercel.com
- Click "New Project"
- Import your GitHub repository
- Add environment variables in Vercel dashboard
- Deploy!

## Important Notes

### ⚠️ Can You Edit Code After Vercel Deployment?

**YES!** You can edit and add new code after deploying to Vercel:

**Method 1: Edit Locally & Redeploy**
1. Edit code on your local machine
2. Test changes locally
3. Push to GitHub (or run `vercel` command)
4. Vercel automatically redeploys

**Method 2: Edit on GitHub**
1. Edit files directly on GitHub
2. Commit changes
3. Vercel auto-deploys (if connected to GitHub)

**Method 3: Vercel CLI**
```bash
# Make changes locally
# Then redeploy
vercel --prod
```

### 🔄 Automatic Deployments
- **Production**: Deploys from `main` branch
- **Preview**: Deploys from other branches
- Every push triggers a new deployment
- You can rollback to previous deployments anytime

### 📝 Post-Deployment Checklist

- [ ] Set all environment variables in Vercel
- [ ] Test all features in production
- [ ] Set up MongoDB Atlas (if not done)
- [ ] Configure custom domain (optional)
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Set up monitoring/analytics

## MongoDB Atlas Setup

1. Create account at https://mongodb.com/cloud/atlas
2. Create a new cluster (free tier available)
3. Create database user
4. Whitelist IP: `0.0.0.0/0` (allow all)
5. Get connection string
6. Add to Vercel environment variables

## Troubleshooting

### Build Fails
- Check Node.js version (18+)
- Clear node_modules and reinstall
- Check for missing dependencies

### Database Connection Issues
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

### Environment Variables Not Working
- Redeploy after adding env vars
- Check variable names match exactly
- No quotes needed in Vercel dashboard

## Support

For issues or questions:
- Check logs: `vercel logs`
- Vercel Dashboard: https://vercel.com/dashboard
- MongoDB Atlas: https://cloud.mongodb.com

---

**Built with 💜 by Cmail Team**
