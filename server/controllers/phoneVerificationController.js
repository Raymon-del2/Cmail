const User = require('../models/User');

// Store OTP codes temporarily (in production, use Redis or database)
const otpStore = new Map();

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP to phone number
exports.sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP with expiration (5 minutes)
    const otpData = {
      otp,
      phone,
      userId: req.user.id,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    };
    
    otpStore.set(phone, otpData);

    // In production, integrate with SMS service (Twilio, AWS SNS, etc.)
    // For development, we'll just log it
    console.log(`📱 OTP for ${phone}: ${otp}`);
    
    // Simulate SMS sending
    // await sendSMS(phone, `Your Cmail verification code is: ${otp}`);

    res.json({
      success: true,
      message: 'Verification code sent successfully',
      // In development, return OTP for testing (remove in production)
      devOTP: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send verification code'
    });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and verification code are required'
      });
    }

    // Get stored OTP
    const otpData = otpStore.get(phone);

    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: 'Verification code not found or expired'
      });
    }

    // Check if OTP is expired
    if (Date.now() > otpData.expiresAt) {
      otpStore.delete(phone);
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired'
      });
    }

    // Check if OTP matches
    if (otpData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    // Check if user matches
    if (otpData.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Update user's phone number
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.phone = phone;
    user.phoneVerified = true;
    await user.save();

    // Clear OTP from store
    otpStore.delete(phone);

    res.json({
      success: true,
      message: 'Phone number verified successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        phoneVerified: user.phoneVerified,
        profilePicture: user.profilePicture,
        birthday: user.birthday,
        address: user.address,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify code'
    });
  }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    // Delete old OTP if exists
    otpStore.delete(phone);

    // Generate new OTP
    const otp = generateOTP();
    
    // Store OTP with expiration
    const otpData = {
      otp,
      phone,
      userId: req.user.id,
      expiresAt: Date.now() + 5 * 60 * 1000
    };
    
    otpStore.set(phone, otpData);

    console.log(`📱 Resent OTP for ${phone}: ${otp}`);

    res.json({
      success: true,
      message: 'Verification code resent successfully',
      devOTP: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification code'
    });
  }
};

// Clean up expired OTPs periodically
setInterval(() => {
  const now = Date.now();
  for (const [phone, data] of otpStore.entries()) {
    if (now > data.expiresAt) {
      otpStore.delete(phone);
    }
  }
}, 60000); // Clean up every minute
