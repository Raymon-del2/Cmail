const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  registerApp,
  getMyApps,
  authorize,
  grant,
  token,
  userinfo,
  revoke
} = require('../controllers/oauthController');

// Developer app management (requires authentication)
router.post('/apps/register', protect, registerApp);
router.get('/apps', protect, getMyApps);

// OAuth 2.0 endpoints (authorize does not require auth - user will be prompted to sign in)
router.get('/authorize', authorize);
router.post('/authorize/grant', protect, grant);
router.post('/token', token);
router.get('/userinfo', userinfo);
router.post('/revoke', revoke);

module.exports = router;
