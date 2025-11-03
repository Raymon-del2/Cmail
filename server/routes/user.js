const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const userController = require('../controllers/userController');

// Get current user profile
router.get('/me', protect, userController.getProfile);

// Update user profile
router.put('/me', protect, userController.updateProfile);
router.patch('/profile', protect, userController.updateProfile);

// Update password
router.put('/password', protect, userController.updatePassword);

// Export user data
router.get('/export-data', protect, userController.exportData);

// Enable 2FA
router.post('/enable-2fa', protect, userController.enable2FA);

// Delete account
router.delete('/me', protect, userController.deleteAccount);
router.delete('/account', protect, userController.deleteAccount);

module.exports = router;
