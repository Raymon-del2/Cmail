# 👤 Using Cmail User Profiles - Complete Example

## Just Like "Sign in with Google" on Windsurf!

---

## 🎯 What Developers Get

When users sign in with Cmail, developers receive:

```json
{
  "sub": "user_id_12345",
  "email": "john@cmail.vercel.app",
  "email_verified": true,
  "name": "John Doe",
  "given_name": "John",
  "family_name": "Doe",
  "picture": "https://ui-avatars.com/api/?name=John+Doe",
  "locale": "en-US",
  "zoneinfo": "UTC",
  "updated_at": "2024-11-04T00:00:00.000Z"
}
```

---

## 📋 Profile Data Explained

| Field | Description | Example |
|-------|-------------|---------|
| `sub` | Unique user ID | `"user_id_12345"` |
| `email` | User's email | `"john@cmail.vercel.app"` |
| `email_verified` | Email verified? | `true` |
| `name` | Full name | `"John Doe"` |
| `given_name` | First name | `"John"` |
| `family_name` | Last name | `"Doe"` |
| `picture` | Profile picture URL | `"https://..."` |
| `locale` | User locale | `"en-US"` |
| `zoneinfo` | Timezone | `"UTC"` |
| `updated_at` | Last update | `"2024-11-04..."` |

---

## 💻 Complete Working Example

### HTML + JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <title>My App with Cmail Login</title>
  <style>
    .user-profile {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: #f3f4f6;
      border-radius: 8px;
    }
    .user-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }
    .user-info h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }
    .user-info p {
      margin: 0;
      font-size: 14px;
      color: #666;
    }
    .cmail-btn {
      padding: 12px 24px;
      background: #8b5cf6;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
    }
  </style>
</head>
<body>
  <!-- Before Login -->
  <div id="login-section">
    <button class="cmail-btn" onclick="signInWithCmail()">
      Sign in with Cmail
    </button>
  </div>

  <!-- After Login -->
  <div id="profile-section" style="display: none;">
    <div class="user-profile">
      <img id="user-avatar" class="user-avatar" src="" alt="Profile">
      <div class="user-info">
        <h3 id="user-name"></h3>
        <p id="user-email"></p>
      </div>
    </div>
    <button onclick="logout()">Sign Out</button>
  </div>

  <script>
    // Sign in with Cmail
    function signInWithCmail() {
      const authUrl = 'https://cmail.vercel.app/oauth/authorize?' +
        'client_id=cmail_public_api&' +
        'redirect_uri=' + encodeURIComponent(window.location.origin + '/callback.html') + '&' +
        'response_type=code&' +
        'scope=email profile';
      
      window.location.href = authUrl;
    }

    // Check if user is logged in
    window.onload = function() {
      const user = JSON.parse(localStorage.getItem('cmail_user') || 'null');
      if (user) {
        showProfile(user);
      }
    };

    // Display user profile
    function showProfile(user) {
      document.getElementById('login-section').style.display = 'none';
      document.getElementById('profile-section').style.display = 'block';
      
      document.getElementById('user-avatar').src = user.picture;
      document.getElementById('user-name').textContent = user.name;
      document.getElementById('user-email').textContent = user.email;
    }

    // Logout
    function logout() {
      localStorage.removeItem('cmail_user');
      localStorage.removeItem('cmail_token');
      location.reload();
    }
  </script>
</body>
</html>
```

### Callback Page (callback.html)

```html
<!DOCTYPE html>
<html>
<head>
  <title>Authenticating...</title>
</head>
<body>
  <p>Signing you in...</p>
  
  <script>
    // Get authorization code from URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // Exchange code for token
      fetch('https://cmail.vercel.app/api/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code: code,
          client_id: 'cmail_public_api',
          redirect_uri: window.location.origin + '/callback.html'
        })
      })
      .then(res => res.json())
      .then(data => {
        // Save access token
        localStorage.setItem('cmail_token', data.access_token);
        
        // Get user profile
        return fetch('https://cmail.vercel.app/api/oauth/userinfo', {
          headers: { 'Authorization': 'Bearer ' + data.access_token }
        });
      })
      .then(res => res.json())
      .then(user => {
        // Save user profile
        localStorage.setItem('cmail_user', JSON.stringify(user));
        
        // Redirect to main page
        window.location.href = '/';
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Authentication failed');
      });
    }
  </script>
</body>
</html>
```

---

## ⚛️ React Example

```jsx
import { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('cmail_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = () => {
    const authUrl = 'https://cmail.vercel.app/oauth/authorize?' +
      'client_id=cmail_public_api&' +
      'redirect_uri=' + encodeURIComponent(window.location.origin + '/callback') + '&' +
      'response_type=code&' +
      'scope=email profile';
    
    window.location.href = authUrl;
  };

  const handleLogout = () => {
    localStorage.removeItem('cmail_user');
    localStorage.removeItem('cmail_token');
    setUser(null);
  };

  if (!user) {
    return (
      <div className="login-page">
        <h1>Welcome to My App</h1>
        <button onClick={handleLogin} className="cmail-btn">
          <img src="/cmail-icon.svg" alt="Cmail" />
          Sign in with Cmail
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="user-header">
        <div className="user-profile">
          <img src={user.picture} alt={user.name} className="avatar" />
          <div className="user-info">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            {user.email_verified && <span className="verified">✓ Verified</span>}
          </div>
        </div>
        <button onClick={handleLogout}>Sign Out</button>
      </header>
      
      <main>
        <h1>Welcome, {user.given_name}!</h1>
        <p>You're signed in with Cmail</p>
      </main>
    </div>
  );
}

// Callback Component
function AuthCallback() {
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    
    if (code) {
      // Exchange code for token
      fetch('https://cmail.vercel.app/api/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code,
          client_id: 'cmail_public_api',
          redirect_uri: window.location.origin + '/callback'
        })
      })
      .then(res => res.json())
      .then(data => {
        localStorage.setItem('cmail_token', data.access_token);
        
        // Get user profile
        return fetch('https://cmail.vercel.app/api/oauth/userinfo', {
          headers: { 'Authorization': 'Bearer ' + data.access_token }
        });
      })
      .then(res => res.json())
      .then(user => {
        localStorage.setItem('cmail_user', JSON.stringify(user));
        window.location.href = '/';
      });
    }
  }, []);

  return <div>Authenticating...</div>;
}

export default App;
```

---

## 🎨 Display User Profile

### Show Avatar
```javascript
<img src={user.picture} alt={user.name} />
```

### Show Name
```javascript
<h3>{user.name}</h3>
// or
<h3>{user.given_name} {user.family_name}</h3>
```

### Show Email
```javascript
<p>{user.email}</p>
{user.email_verified && <span>✓ Verified</span>}
```

### Personalized Greeting
```javascript
<h1>Welcome back, {user.given_name}!</h1>
```

---

## 🔐 What You Can Do With Profile Data

### 1. Create User Account
```javascript
// Save to your database
const newUser = {
  cmailId: user.sub,
  email: user.email,
  firstName: user.given_name,
  lastName: user.family_name,
  avatar: user.picture,
  emailVerified: user.email_verified
};

await db.users.create(newUser);
```

### 2. Display User Info
```javascript
// Show in your UI
<div className="user-card">
  <img src={user.picture} />
  <h3>{user.name}</h3>
  <p>{user.email}</p>
</div>
```

### 3. Personalize Experience
```javascript
// Use first name
<h1>Hi {user.given_name}!</h1>

// Send emails
sendEmail(user.email, 'Welcome!');

// Track user
analytics.identify(user.sub, {
  name: user.name,
  email: user.email
});
```

---

## ✨ Just Like Google Sign-In!

Your OAuth API works exactly like Google's:

| Feature | Google | Cmail |
|---------|--------|-------|
| User ID | ✅ `sub` | ✅ `sub` |
| Email | ✅ `email` | ✅ `email` |
| Name | ✅ `name` | ✅ `name` |
| First Name | ✅ `given_name` | ✅ `given_name` |
| Last Name | ✅ `family_name` | ✅ `family_name` |
| Picture | ✅ `picture` | ✅ `picture` |
| Verified | ✅ `email_verified` | ✅ `email_verified` |

---

## 🎉 Summary

**Developers get full user profile:**
- ✅ Unique ID
- ✅ Email address
- ✅ Full name
- ✅ First & last name
- ✅ Profile picture
- ✅ Verification status
- ✅ Locale & timezone

**Just like Google, GitHub, Facebook!**

---

**Your OAuth API is complete and production-ready!** 💜🔐👤
