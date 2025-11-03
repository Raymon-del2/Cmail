# 🔐 Cmail OAuth Integration Guide

## Add "Sign in with Cmail" to Your App

Integrate Cmail authentication into your application, just like "Sign in with Google"!

---

## 🚀 Quick Start

### Step 1: Register Your App

1. Go to https://your-cmail-app.vercel.app/developer
2. Click "Create App"
3. Fill in your app details:
   - **App Name**: Your application name
   - **Description**: What your app does
   - **Website**: Your app's URL
   - **Redirect URIs**: Where to send users after authorization
   - **Scopes**: What permissions you need

4. Save your **Client ID** and **Client Secret** securely!

---

## 🔑 OAuth 2.0 Flow

### Authorization Code Flow (Recommended)

```
User clicks "Sign in with Cmail"
    ↓
Redirect to Cmail authorization page
    ↓
User grants permission
    ↓
Redirect back with authorization code
    ↓
Exchange code for access token
    ↓
Use token to access user data
```

---

## 📝 Implementation

### 1. Add "Sign in with Cmail" Button

```html
<button onclick="signInWithCmail()">
  <img src="cmail-logo.svg" alt="Cmail" />
  Sign in with Cmail
</button>
```

```javascript
function signInWithCmail() {
  const clientId = 'YOUR_CLIENT_ID';
  const redirectUri = 'https://yourapp.com/auth/callback';
  const scope = 'email profile';
  const state = generateRandomState(); // CSRF protection
  
  const authUrl = `https://your-cmail-app.vercel.app/oauth/authorize?` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `response_type=code&` +
    `scope=${encodeURIComponent(scope)}&` +
    `state=${state}`;
  
  // Save state for verification
  sessionStorage.setItem('oauth_state', state);
  
  // Redirect to Cmail
  window.location.href = authUrl;
}

function generateRandomState() {
  return Math.random().toString(36).substring(2, 15);
}
```

### 2. Handle Callback

```javascript
// On your callback page (e.g., /auth/callback)
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');
const state = urlParams.get('state');
const error = urlParams.get('error');

// Verify state (CSRF protection)
const savedState = sessionStorage.getItem('oauth_state');
if (state !== savedState) {
  console.error('Invalid state parameter');
  return;
}

if (error) {
  console.error('Authorization error:', error);
  return;
}

// Exchange code for token
exchangeCodeForToken(code);
```

### 3. Exchange Code for Access Token

```javascript
async function exchangeCodeForToken(code) {
  const response = await fetch('https://your-cmail-app.vercel.app/api/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code: code,
      client_id: 'YOUR_CLIENT_ID',
      client_secret: 'YOUR_CLIENT_SECRET',
      redirect_uri: 'https://yourapp.com/auth/callback'
    })
  });

  const data = await response.json();
  
  // Save tokens
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  
  // Get user info
  getUserInfo(data.access_token);
}
```

### 4. Get User Information

```javascript
async function getUserInfo(accessToken) {
  const response = await fetch('https://your-cmail-app.vercel.app/api/oauth/userinfo', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  const user = await response.json();
  console.log('User:', user);
  
  // Example response:
  // {
  //   "sub": "user_id",
  //   "email": "user@cmail.vercel.app",
  //   "email_verified": true,
  //   "name": "John Doe",
  //   "given_name": "John",
  //   "family_name": "Doe",
  //   "picture": "https://..."
  // }
}
```

### 5. Refresh Access Token

```javascript
async function refreshAccessToken(refreshToken) {
  const response = await fetch('https://your-cmail-app.vercel.app/api/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: 'YOUR_CLIENT_ID',
      client_secret: 'YOUR_CLIENT_SECRET'
    })
  });

  const data = await response.json();
  localStorage.setItem('access_token', data.access_token);
  return data.access_token;
}
```

---

## 🔐 API Endpoints

### Authorization Endpoint
```
GET https://your-cmail-app.vercel.app/oauth/authorize
```

**Parameters:**
- `client_id` (required): Your app's client ID
- `redirect_uri` (required): Where to redirect after authorization
- `response_type` (required): Must be "code"
- `scope` (optional): Space-separated scopes (default: "email profile")
- `state` (recommended): Random string for CSRF protection

### Token Endpoint
```
POST https://your-cmail-app.vercel.app/api/oauth/token
```

**Body (Authorization Code):**
```json
{
  "grant_type": "authorization_code",
  "code": "authorization_code",
  "client_id": "your_client_id",
  "client_secret": "your_client_secret",
  "redirect_uri": "your_redirect_uri"
}
```

**Body (Refresh Token):**
```json
{
  "grant_type": "refresh_token",
  "refresh_token": "refresh_token",
  "client_id": "your_client_id",
  "client_secret": "your_client_secret"
}
```

**Response:**
```json
{
  "access_token": "cmail_access_...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "cmail_refresh_...",
  "scope": "email profile"
}
```

### UserInfo Endpoint
```
GET https://your-cmail-app.vercel.app/api/oauth/userinfo
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "sub": "user_id",
  "email": "user@cmail.vercel.app",
  "email_verified": true,
  "name": "John Doe",
  "given_name": "John",
  "family_name": "Doe",
  "picture": "https://..."
}
```

### Revoke Endpoint
```
POST https://your-cmail-app.vercel.app/api/oauth/revoke
```

**Body:**
```json
{
  "token": "access_or_refresh_token",
  "token_type_hint": "access_token" // or "refresh_token"
}
```

---

## 🎯 Available Scopes

| Scope | Description |
|-------|-------------|
| `email` | Access user's email address |
| `profile` | Access user's profile (name, picture) |
| `read_emails` | Read user's emails |
| `send_emails` | Send emails on behalf of user |
| `manage_emails` | Full email management access |

---

## 🔒 Security Best Practices

### 1. Keep Client Secret Secure
- ❌ Never expose in client-side code
- ✅ Store on your backend server
- ✅ Use environment variables

### 2. Validate State Parameter
```javascript
// Generate random state
const state = crypto.randomBytes(16).toString('hex');
sessionStorage.setItem('oauth_state', state);

// Verify on callback
if (receivedState !== sessionStorage.getItem('oauth_state')) {
  throw new Error('Invalid state');
}
```

### 3. Use HTTPS
- Always use HTTPS for redirect URIs
- Never use HTTP in production

### 4. Validate Redirect URI
- Register all redirect URIs in advance
- Cmail will reject unregistered URIs

### 5. Token Storage
- Store tokens securely
- Use httpOnly cookies for web apps
- Use secure storage for mobile apps

---

## 📱 Platform-Specific Examples

### React Example

```jsx
import { useState, useEffect } from 'react';

function CmailLogin() {
  const handleLogin = () => {
    const params = new URLSearchParams({
      client_id: process.env.REACT_APP_CMAIL_CLIENT_ID,
      redirect_uri: `${window.location.origin}/auth/callback`,
      response_type: 'code',
      scope: 'email profile',
      state: Math.random().toString(36).substring(7)
    });
    
    window.location.href = `https://your-cmail-app.vercel.app/oauth/authorize?${params}`;
  };

  return (
    <button onClick={handleLogin} className="cmail-login-btn">
      <img src="/cmail-icon.svg" alt="Cmail" />
      Sign in with Cmail
    </button>
  );
}

// Callback component
function AuthCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    
    if (code) {
      // Exchange code for token on your backend
      fetch('/api/auth/cmail', {
        method: 'POST',
        body: JSON.stringify({ code }),
        headers: { 'Content-Type': 'application/json' }
      })
      .then(res => res.json())
      .then(data => {
        // Save user data and redirect
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/dashboard';
      });
    }
  }, []);

  return <div>Authenticating...</div>;
}
```

### Node.js/Express Backend

```javascript
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/auth/cmail', async (req, res) => {
  const { code } = req.body;

  try {
    // Exchange code for token
    const tokenResponse = await axios.post(
      'https://your-cmail-app.vercel.app/api/oauth/token',
      {
        grant_type: 'authorization_code',
        code,
        client_id: process.env.CMAIL_CLIENT_ID,
        client_secret: process.env.CMAIL_CLIENT_SECRET,
        redirect_uri: process.env.CMAIL_REDIRECT_URI
      }
    );

    const { access_token } = tokenResponse.data;

    // Get user info
    const userResponse = await axios.get(
      'https://your-cmail-app.vercel.app/api/oauth/userinfo',
      {
        headers: { Authorization: `Bearer ${access_token}` }
      }
    );

    const user = userResponse.data;

    // Create session or JWT for your app
    req.session.user = user;

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
});

module.exports = router;
```

---

## 🎨 UI Components

### Sign in Button (HTML/CSS)

```html
<button class="cmail-btn">
  <svg class="cmail-icon" viewBox="0 0 24 24">
    <!-- Cmail logo SVG -->
  </svg>
  Sign in with Cmail
</button>
```

```css
.cmail-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: #8b5cf6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.cmail-btn:hover {
  background: #7c3aed;
}

.cmail-icon {
  width: 24px;
  height: 24px;
  fill: white;
}
```

---

## 🧪 Testing

### Test in Development

1. Register app with redirect URI: `http://localhost:3000/auth/callback`
2. Test authorization flow
3. Verify token exchange
4. Check user info retrieval

### Test Scopes

Request different scopes to test permissions:
```
scope=email
scope=email profile
scope=email profile read_emails
```

---

## 📚 Additional Resources

- **Developer Dashboard**: `/developer`
- **API Documentation**: Coming soon
- **Support**: Contact Cmail support

---

## ❓ FAQ

**Q: Can I use this in production?**
A: Yes! Just register your production redirect URIs.

**Q: How long do tokens last?**
A: Access tokens: 1 hour, Refresh tokens: 30 days

**Q: Can I revoke access?**
A: Yes, users can revoke access from their Cmail settings.

**Q: Is this free?**
A: Yes, OAuth integration is free for all developers!

---

## 🎉 You're Ready!

Start integrating Cmail authentication into your app today!

**Happy coding!** 💜🔐
