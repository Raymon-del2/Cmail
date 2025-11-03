const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const phoneVerificationController = require('../controllers/phoneVerificationController');

// All routes require authentication
router.use(protect);

// Send OTP
router.post('/send-otp', phoneVerificationController.sendOTP);

// Verify OTP
router.post('/verify-otp', phoneVerificationController.verifyOTP);

// Resend OTP
router.post('/resend-otp', phoneVerificationController.resendOTP);

module.exports = router;
