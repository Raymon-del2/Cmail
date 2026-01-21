const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');

// Generate JWT token
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set');
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Sign up
exports.signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password, firstName, lastName } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      authMethod: 'password',
      verificationToken,
      verificationTokenExpire
    });

    // Send verification email (optional - skip if email service not configured)
    try {
      const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
      await sendEmail({
        to: email,
        subject: 'Verify your C-mail account',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to C-mail, ${firstName}!</h2>
            <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
            <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4285f4; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">Verify Email</a>
            <p>Or copy and paste this link into your browser:</p>
            <p>${verificationUrl}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create this account, please ignore this email.</p>
          </div>
        `
      });
    } catch (emailError) {
      console.log('Email sending failed (non-critical):', emailError.message);
      // Continue with signup even if email fails
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Please check your email to verify your account.',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating account'
    });
  }
};

// Sign in
exports.signin = async (req, res) => {
  try {
    console.log('Signin request received:', { email: req.body.email });
    console.log('MongoDB connection state:', mongoose.connection.readyState);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user and include password
    console.log('Finding user with email:', email);
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('User not found');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log('User found, comparing password');
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log('Password invalid');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login (without triggering password hash middleware)
    await User.findByIdAndUpdate(user._id, { lastLogin: Date.now() }, { timestamps: false });

    // Generate token
    console.log('Generating token');
    const token = generateToken(user._id);

    console.log('Signin successful');
    res.json({
      success: true,
      message: 'Signed in successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        phone: user.phone,
        birthday: user.birthday,
        address: user.address,
        isVerified: user.isVerified,
        authMethod: user.authMethod
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error signing in',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Request magic link
exports.requestMagicLink = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email } = req.body;

    // Find or create user
    let user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email. Please sign up first.'
      });
    }

    // Generate magic link token
    const magicLinkToken = crypto.randomBytes(32).toString('hex');
    const magicLinkTokenExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    user.magicLinkToken = magicLinkToken;
    user.magicLinkTokenExpire = magicLinkTokenExpire;
    await user.save();

    // Send magic link email
    const magicLinkUrl = `${process.env.CLIENT_URL}/verify-magic-link/${magicLinkToken}`;
    await sendEmail({
      to: email,
      subject: 'Your C-mail sign-in link',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Sign in to C-mail</h2>
          <p>Click the button below to sign in to your account:</p>
          <a href="${magicLinkUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4285f4; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">Sign In</a>
          <p>Or copy and paste this link into your browser:</p>
          <p>${magicLinkUrl}</p>
          <p>This link will expire in 15 minutes.</p>
          <p>If you didn't request this link, please ignore this email.</p>
        </div>
      `
    });

    res.json({
      success: true,
      message: 'Magic link sent to your email'
    });
  } catch (error) {
    console.error('Magic link error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending magic link'
    });
  }
};

// Verify magic link
exports.verifyMagicLink = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      magicLinkToken: token,
      magicLinkTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired magic link'
      });
    }

    // Clear magic link token
    user.magicLinkToken = undefined;
    user.magicLinkTokenExpire = undefined;
    user.isVerified = true;
    user.lastLogin = Date.now();
    await user.save();

    // Generate JWT token
    const jwtToken = generateToken(user._id);

    res.json({
      success: true,
      message: 'Signed in successfully',
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: user.isVerified,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Verify magic link error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying magic link'
    });
  }
};

// Verify email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying email'
    });
  }
};

// Resend verification email
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified'
      });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    user.verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    // Send verification email
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    await sendEmail({
      to: email,
      subject: 'Verify your C-mail account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verify your email</h2>
          <p>Click the button below to verify your email address:</p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4285f4; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
        </div>
      `
    });

    res.json({
      success: true,
      message: 'Verification email sent'
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending verification email'
    });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // Send reset email (optional - won't fail if email service unavailable)
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const emailResult = await sendEmail({
      to: email,
      subject: 'Reset your C-mail password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reset your password</h2>
          <p>Click the button below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4285f4; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `
    });

    // Check if email was actually sent or just skipped
    const message = emailResult.skipped || emailResult.error 
      ? 'Password reset token generated. Email service unavailable - please contact support.'
      : 'Password reset email sent';

    res.json({
      success: true,
      message,
      resetToken: emailResult.skipped || emailResult.error ? resetToken : undefined // Include token if email failed
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending reset email'
    });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password'
    });
  }
};

// Sign out
exports.signout = async (req, res) => {
  res.json({
    success: true,
    message: 'Signed out successfully'
  });
};

// Refresh token
exports.refreshToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const newToken = generateToken(user._id);

    res.json({
      success: true,
      token: newToken
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};
