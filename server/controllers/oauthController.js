const crypto = require('crypto');
const DeveloperApp = require('../models/DeveloperApp');
const OAuthToken = require('../models/OAuthToken');
const User = require('../models/User');

// Register a new developer app
exports.registerApp = async (req, res) => {
  try {
    const { name, description, website, redirectUris, scopes } = req.body;

    // Validate redirect URIs
    if (!redirectUris || redirectUris.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one redirect URI is required'
      });
    }

    const app = await DeveloperApp.create({
      name,
      description,
      website,
      redirectUris,
      scopes: scopes || ['email', 'profile'],
      developer: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'App registered successfully',
      app: {
        id: app._id,
        name: app.name,
        clientId: app.clientId,
        clientSecret: app.clientSecret,
        redirectUris: app.redirectUris,
        scopes: app.scopes
      }
    });
  } catch (error) {
    console.error('Register app error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering app'
    });
  }
};

// Get developer's apps
exports.getMyApps = async (req, res) => {
  try {
    const apps = await DeveloperApp.find({ developer: req.user.id })
      .select('-clientSecret')
      .sort('-createdAt');

    res.json({
      success: true,
      apps
    });
  } catch (error) {
    console.error('Get apps error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching apps'
    });
  }
};

// OAuth authorization endpoint
exports.authorize = async (req, res) => {
  try {
    const { client_id, redirect_uri, scope, state, response_type } = req.query;

    // Validate parameters
    if (!client_id || !redirect_uri || response_type !== 'code') {
      return res.status(400).json({
        success: false,
        message: 'Invalid OAuth parameters'
      });
    }

    // Handle public API (no registration needed)
    if (client_id === 'cmail_public_api') {
      return res.json({
        success: true,
        app: {
          name: 'Public Application',
          description: 'Open source Cmail authentication',
          website: redirect_uri,
          logo: '',
          scopes: scope ? scope.split(' ') : ['email', 'profile']
        },
        authParams: {
          client_id,
          redirect_uri,
          scope: scope || 'email profile',
          state
        }
      });
    }

    // Find the app
    const app = await DeveloperApp.findOne({ clientId: client_id, isActive: true });
    if (!app) {
      return res.status(404).json({
        success: false,
        message: 'App not found'
      });
    }

    // Validate redirect URI
    if (!app.redirectUris.includes(redirect_uri)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid redirect URI'
      });
    }

    // Return app info for consent screen
    res.json({
      success: true,
      app: {
        name: app.name,
        description: app.description,
        website: app.website,
        logo: app.logo,
        scopes: scope ? scope.split(' ') : app.scopes
      },
      authParams: {
        client_id,
        redirect_uri,
        scope: scope || app.scopes.join(' '),
        state
      }
    });
  } catch (error) {
    console.error('Authorize error:', error);
    res.status(500).json({
      success: false,
      message: 'Authorization error'
    });
  }
};

// User grants authorization
exports.grant = async (req, res) => {
  try {
    const { client_id, redirect_uri, scope, state } = req.body;
    const userId = req.user.id;

    // Handle public API (no validation needed)
    let appId = 'public';
    let scopes = scope ? scope.split(' ') : ['email', 'profile'];

    if (client_id !== 'cmail_public_api') {
      // Find the app
      const app = await DeveloperApp.findOne({ clientId: client_id, isActive: true });
      if (!app) {
        return res.status(404).json({
          success: false,
          message: 'App not found'
        });
      }

      // Validate redirect URI
      if (!app.redirectUris.includes(redirect_uri)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid redirect URI'
        });
      }

      appId = app._id;
      scopes = scope ? scope.split(' ') : app.scopes;

      // Increment usage count
      app.usageCount += 1;
      await app.save();
    }

    // Generate authorization code
    const authCode = crypto.randomBytes(32).toString('hex');
    
    // Store authorization code temporarily (expires in 10 minutes)
    const codeData = {
      code: authCode,
      userId,
      appId,
      scopes,
      redirectUri: redirect_uri,
      expiresAt: Date.now() + 10 * 60 * 1000
    };

    // Store in memory or Redis (for now, we'll use a simple in-memory store)
    global.authCodes = global.authCodes || {};
    global.authCodes[authCode] = codeData;

    // Redirect with authorization code
    const redirectUrl = new URL(redirect_uri);
    redirectUrl.searchParams.append('code', authCode);
    if (state) redirectUrl.searchParams.append('state', state);

    res.json({
      success: true,
      redirectUrl: redirectUrl.toString()
    });
  } catch (error) {
    console.error('Grant error:', error);
    res.status(500).json({
      success: false,
      message: 'Error granting authorization'
    });
  }
};

// Exchange authorization code for access token
exports.token = async (req, res) => {
  try {
    const { grant_type, code, client_id, client_secret, redirect_uri, refresh_token } = req.body;

    if (grant_type === 'authorization_code') {
      // Validate authorization code
      global.authCodes = global.authCodes || {};
      const codeData = global.authCodes[code];

      if (!codeData || codeData.expiresAt < Date.now()) {
        return res.status(400).json({
          error: 'invalid_grant',
          error_description: 'Authorization code is invalid or expired'
        });
      }

      // Handle public API (no client secret needed)
      let appId = codeData.appId;
      
      if (client_id !== 'cmail_public_api') {
        // Verify client credentials for registered apps
        const app = await DeveloperApp.findOne({ 
          clientId: client_id,
          clientSecret: client_secret,
          isActive: true
        });

        if (!app || app._id.toString() !== codeData.appId.toString()) {
          return res.status(401).json({
            error: 'invalid_client',
            error_description: 'Invalid client credentials'
          });
        }
        
        appId = app._id;
      }

      // Verify redirect URI
      if (redirect_uri !== codeData.redirectUri) {
        return res.status(400).json({
          error: 'invalid_grant',
          error_description: 'Redirect URI mismatch'
        });
      }

      // Generate tokens
      const accessToken = 'cmail_access_' + crypto.randomBytes(32).toString('hex');
      const refreshToken = 'cmail_refresh_' + crypto.randomBytes(32).toString('hex');

      // Save tokens to database
      await OAuthToken.create({
        accessToken,
        refreshToken,
        user: codeData.userId,
        app: appId,
        scopes: codeData.scopes,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        refreshExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      });

      // Delete used authorization code
      delete global.authCodes[code];

      res.json({
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: refreshToken,
        scope: codeData.scopes.join(' ')
      });

    } else if (grant_type === 'refresh_token') {
      // Handle refresh token
      const tokenDoc = await OAuthToken.findOne({ 
        refreshToken: refresh_token,
        isRevoked: false
      }).populate('app');

      if (!tokenDoc || tokenDoc.refreshExpiresAt < new Date()) {
        return res.status(400).json({
          error: 'invalid_grant',
          error_description: 'Refresh token is invalid or expired'
        });
      }

      // Verify client
      if (tokenDoc.app.clientId !== client_id || tokenDoc.app.clientSecret !== client_secret) {
        return res.status(401).json({
          error: 'invalid_client',
          error_description: 'Invalid client credentials'
        });
      }

      // Generate new access token
      const newAccessToken = 'cmail_access_' + crypto.randomBytes(32).toString('hex');

      // Update token
      tokenDoc.accessToken = newAccessToken;
      tokenDoc.expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      await tokenDoc.save();

      res.json({
        access_token: newAccessToken,
        token_type: 'Bearer',
        expires_in: 3600,
        scope: tokenDoc.scopes.join(' ')
      });

    } else {
      res.status(400).json({
        error: 'unsupported_grant_type',
        error_description: 'Grant type not supported'
      });
    }
  } catch (error) {
    console.error('Token error:', error);
    res.status(500).json({
      error: 'server_error',
      error_description: 'Internal server error'
    });
  }
};

// Get user info (OAuth userinfo endpoint)
exports.userinfo = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'invalid_token',
        error_description: 'No access token provided'
      });
    }

    const accessToken = authHeader.substring(7);

    // Find token
    const tokenDoc = await OAuthToken.findOne({
      accessToken,
      isRevoked: false
    }).populate('user');

    if (!tokenDoc || tokenDoc.expiresAt < new Date()) {
      return res.status(401).json({
        error: 'invalid_token',
        error_description: 'Access token is invalid or expired'
      });
    }

    const user = tokenDoc.user;
    const scopes = tokenDoc.scopes;

    // Build response based on scopes (OpenID Connect standard)
    const userInfo = {
      sub: user._id.toString(), // Unique user ID
      updated_at: user.updatedAt || user.createdAt
    };

    if (scopes.includes('email')) {
      userInfo.email = user.email;
      userInfo.email_verified = user.isVerified || false;
    }

    if (scopes.includes('profile')) {
      userInfo.name = `${user.firstName} ${user.lastName}`;
      userInfo.given_name = user.firstName;
      userInfo.family_name = user.lastName;
      userInfo.picture = user.profilePicture || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=8b5cf6&color=fff`;
      userInfo.locale = 'en-US';
      userInfo.zoneinfo = 'UTC';
    }

    res.json(userInfo);
  } catch (error) {
    console.error('Userinfo error:', error);
    res.status(500).json({
      error: 'server_error',
      error_description: 'Internal server error'
    });
  }
};

// Revoke token
exports.revoke = async (req, res) => {
  try {
    const { token, token_type_hint } = req.body;

    const query = token_type_hint === 'refresh_token' 
      ? { refreshToken: token }
      : { $or: [{ accessToken: token }, { refreshToken: token }] };

    await OAuthToken.updateOne(query, { isRevoked: true });

    res.json({
      success: true,
      message: 'Token revoked'
    });
  } catch (error) {
    console.error('Revoke error:', error);
    res.status(500).json({
      error: 'server_error',
      error_description: 'Internal server error'
    });
  }
};
