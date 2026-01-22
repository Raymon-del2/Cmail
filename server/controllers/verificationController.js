const User = require('../models/User');
const { sendEmail } = require('../utils/email');

// Store verification codes temporarily (in production, use Redis or database)
const verificationCodes = new Map();

// Generate 4-digit verification code
const generateCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Send verification code to user's email
exports.sendVerificationCode = async (req, res) => {
  try {
    const { email, client_id, redirect_uri } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate 4-digit code
    const code = generateCode();

    // Store code with expiration (10 minutes)
    const codeData = {
      code,
      email,
      userId: user._id,
      clientId: client_id || 'unknown',
      redirectUri: redirect_uri || '/',
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      createdAt: Date.now()
    };

    verificationCodes.set(email, codeData);

    // Send email with verification code
    await sendEmail({
      to: email,
      subject: 'Your CMail Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8b5cf6;">Verify Your CMail Account</h2>
          <p>Enter this 4-digit code in the application:</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #8b5cf6;">${code}</span>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p style="color: #6b7280; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `
    });

    console.log(`📧 Verification code sent to ${email}: ${code}`);

    res.json({
      success: true,
      message: 'Verification code sent successfully',
      // In development, return code for testing (remove in production)
      devCode: process.env.NODE_ENV === 'development' ? code : undefined
    });
  } catch (error) {
    console.error('Send verification code error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send verification code'
    });
  }
};

// Verify the code and return access token
exports.verifyCode = async (req, res) => {
  try {
    const { email, code, client_id, client_secret } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Email and verification code are required'
      });
    }

    // Get stored code
    const codeData = verificationCodes.get(email);

    if (!codeData) {
      return res.status(400).json({
        success: false,
        message: 'Verification code not found or expired'
      });
    }

    // Check if code is expired
    if (Date.now() > codeData.expiresAt) {
      verificationCodes.delete(email);
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired'
      });
    }

    // Check if code matches
    if (codeData.code !== code) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    // Get user
    const user = await User.findById(codeData.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Handle public API (no client secret needed)
    let appId = 'public';

    if (client_id && client_id !== 'cmail_public_api') {
      // Verify client credentials for registered apps
      const DeveloperApp = require('../models/DeveloperApp');
      const app = await DeveloperApp.findOne({
        clientId: client_id,
        clientSecret: client_secret,
        isActive: true
      });

      if (!app) {
        return res.status(401).json({
          success: false,
          message: 'Invalid client credentials'
        });
      }

      appId = app._id;
    }

    // Generate access token
    const crypto = require('crypto');
    const accessToken = 'cmail_access_' + crypto.randomBytes(32).toString('hex');
    const refreshToken = 'cmail_refresh_' + crypto.randomBytes(32).toString('hex');

    // Save tokens to database
    const OAuthToken = require('../models/OAuthToken');
    await OAuthToken.create({
      accessToken,
      refreshToken,
      user: user._id,
      app: appId,
      scopes: ['email', 'profile'],
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      refreshExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });

    // Clear verification code
    verificationCodes.delete(email);

    res.json({
      success: true,
      message: 'Verification successful',
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 3600,
      refresh_token: refreshToken,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Verify code error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify code'
    });
  }
};

// Resend verification code
exports.resendCode = async (req, res) => {
  try {
    const { email, client_id, redirect_uri } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete old code if exists
    verificationCodes.delete(email);

    // Generate new code
    const code = generateCode();

    // Store code with expiration
    const codeData = {
      code,
      email,
      userId: user._id,
      clientId: client_id || 'unknown',
      redirectUri: redirect_uri || '/',
      expiresAt: Date.now() + 10 * 60 * 1000,
      createdAt: Date.now()
    };

    verificationCodes.set(email, codeData);

    // Send email
    await sendEmail({
      to: email,
      subject: 'Your CMail Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8b5cf6;">Verify Your CMail Account</h2>
          <p>Enter this 4-digit code in the application:</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #8b5cf6;">${code}</span>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p style="color: #6b7280; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `
    });

    console.log(`📧 Resent verification code to ${email}: ${code}`);

    res.json({
      success: true,
      message: 'Verification code resent successfully',
      devCode: process.env.NODE_ENV === 'development' ? code : undefined
    });
  } catch (error) {
    console.error('Resend code error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification code'
    });
  }
};

// Clean up expired codes periodically
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of verificationCodes.entries()) {
    if (now > data.expiresAt) {
      verificationCodes.delete(email);
    }
  }
}, 60000); // Clean up every minute
