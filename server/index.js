const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const initTursoDB = require('./config/initTurso');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const emailRoutes = require('./routes/emailRoutes');
const labelRoutes = require('./routes/labelRoutes');
const fileRoutes = require('./routes/fileRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const phoneVerificationRoutes = require('./routes/phoneVerification');
const oauthRoutes = require('./routes/oauthRoutes');

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' })); // Increased limit for file uploads
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Serve uploaded files
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/labels', labelRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/phone-verification', phoneVerificationRoutes);
app.use('/api/oauth', oauthRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: '💜 Cmail API Server',
    status: 'running',
    frontend: 'http://localhost:5173',
    docs: '/api/health'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'C-mail API is running' });
});

// Initialize databases (lazy initialization for serverless)
let isInitialized = false;
async function initializeDatabases() {
  if (isInitialized) return;

  try {
    // MongoDB Connection
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cmail', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(' MongoDB connected successfully');

    // Initialize Turso Database
    initTursoDB();
    console.log(' Turso initialized');

    isInitialized = true;
  } catch (err) {
    console.error(' Database initialization error:', err);
    throw err;
  }
}

// Initialize databases on first request
app.use(async (req, res, next) => {
  if (!isInitialized) {
    try {
      await initializeDatabases();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Database initialization failed'
      });
    }
  }
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Export for Vercel serverless function
module.exports = app;

// Only listen if not running in Vercel
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(` C-mail server running on port ${PORT}`);
  });
}
