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
const verificationRoutes = require('./routes/verificationRoutes');

// Initialize databases (lazy initialization for serverless)
let isInitialized = false;
let mongoConnectionPromise = null;

async function connectMongo() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!mongoConnectionPromise) {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not set');
    }
    
    mongoConnectionPromise = mongoose
      .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 10000
      })
      .catch((err) => {
        mongoConnectionPromise = null;
        throw err;
      });
  }

  return mongoConnectionPromise;
}

async function initializeDatabases() {
  if (isInitialized) return;

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not set');
    }

    await connectMongo();
    initTursoDB();
    isInitialized = true;
  } catch (err) {
    console.error('Database initialization error:', err);
    throw err;
  }
}

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

// Initialize databases on first API request
app.use(async (req, res, next) => {
  if (req.path.startsWith('/api')) {
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
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/labels', labelRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/phone-verification', phoneVerificationRoutes);
app.use('/api/oauth', oauthRoutes);
app.use('/api/verification', verificationRoutes);

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
