const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Sign up with email/password
router.post('/signup',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty()
  ],
  authController.signup
);

// Sign in with email/password
router.post('/signin',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  authController.signin
);

// Request magic link
router.post('/magic-link',
  [body('email').isEmail().normalizeEmail()],
  authController.requestMagicLink
);

// Verify magic link
router.get('/verify-magic-link/:token', authController.verifyMagicLink);

// Verify email
router.get('/verify-email/:token', authController.verifyEmail);

// Resend verification email
router.post('/resend-verification',
  [body('email').isEmail().normalizeEmail()],
  authController.resendVerification
);

// Request password reset
router.post('/forgot-password',
  [body('email').isEmail().normalizeEmail()],
  authController.forgotPassword
);

// Reset password
router.post('/reset-password/:token',
  [body('password').isLength({ min: 8 })],
  authController.resetPassword
);

// Sign out
router.post('/signout', protect, authController.signout);

// Refresh token
router.post('/refresh', authController.refreshToken);

module.exports = router;
