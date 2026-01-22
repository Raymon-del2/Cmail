const express = require('express');
const router = express.Router();
const {
  sendVerificationCode,
  verifyCode,
  resendCode
} = require('../controllers/verificationController');

// Send verification code to user's email
router.post('/send-code', sendVerificationCode);

// Verify the code and return access token
router.post('/verify-code', verifyCode);

// Resend verification code
router.post('/resend-code', resendCode);

module.exports = router;
