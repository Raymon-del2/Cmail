# 🧪 Testing Cmail OAuth on CodePen

## ⚠️ Why You Saw Your Inbox

When you clicked "Sign in with Cmail" on CodePen, you were redirected to YOUR Cmail inbox because:

1. The `redirect_uri` wasn't set correctly
2. CodePen's URL structure is complex
3. The callback wasn't handled properly

---

## ✅ How to Test Properly

### Option 1: Test on Localhost (Recommended)

```bash
# Create a simple HTML file
# Save as index.html
```

```html
<!DOCTYPE html>
<html>
<head>
  <title>Test Cmail Login</title>
</head>
<body>
  <h1>Test Cmail OAuth</h1>
  
  <button onclick="signIn()">Sign in with Cmail</button>
  
  <div id="result" style="display:none;">
    <h2>Success!</h2>
    <p>Name: <span id="name"></span></p>
    <p>Email: <span id="email"></span></p>
  </div>

  <script>
    function signIn() {
      // Use localhost as redirect
      const redirectUri = 'http://localhost:8000/callback.html';
      
      const authUrl = 'https://cmail.vercel.app/oauth/authorize?' +
        'client_id=cmail_public_api&' +
        'redirect_uri=' + encodeURIComponent(redirectUri) + '&' +
        'response_type=code&' +
        'scope=email profile';
      
      window.location.href = authUrl;
    }
  </script>
</body>
</html>
```

**callback.html:**
```html
<!DOCTYPE html>
<html>
<head>
  <title>Callback</title>
</head>
<body>
  <p>Processing...</p>
  
  <script>
    const code = new URLSearchParams(window.location.search).get('code');
    
    if (code) {
      fetch('https://cmail.vercel.app/api/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code: code,
          client_id: 'cmail_public_api',
          redirect_uri: 'http://localhost:8000/callback.html'
        })
      })
      .then(res => res.json())
      .then(data => {
        return fetch('https://cmail.vercel.app/api/oauth/userinfo', {
          headers: { 'Authorization': 'Bearer ' + data.access_token }
        });
      })
      .then(res => res.json())
      .then(user => {
        // Redirect back with user data
        window.opener.postMessage({ user }, '*');
        window.close();
      });
    }
  </script>
</body>
</html>
```

**Run:**
```bash
# Start a simple server
python -m http.server 8000
# or
npx serve
```

Then open: `http://localhost:8000`

---

### Option 2: Use a Real Domain

Deploy your test page to:
- Vercel
- Netlify
- GitHub Pages
- Any hosting service

Then use that URL as your `redirect_uri`.

---

### Option 3: CodePen (Advanced)

CodePen makes OAuth tricky because:
- URLs change with each edit
- Can't easily handle callbacks
- CORS issues

**If you must use CodePen:**

1. **Get your CodePen URL:**
   ```
   https://codepen.io/your-username/pen/abc123
   ```

2. **Use it as redirect_uri:**
   ```javascript
   const redirectUri = 'https://codepen.io/your-username/pen/abc123';
   ```

3. **Handle the callback in the same pen:**
   ```javascript
   // Check for code in URL
   const urlParams = new URLSearchParams(window.location.search);
   const code = urlParams.get('code');
   
   if (code) {
     // Exchange for token
     // ... (same as above)
   }
   ```

**⚠️ This is NOT recommended for testing!**

---

## 🎯 Why Localhost is Better

| Method | Pros | Cons |
|--------|------|------|
| **Localhost** | ✅ Easy<br>✅ Fast<br>✅ No CORS issues | ❌ Need local server |
| **Real Domain** | ✅ Production-like<br>✅ Shareable | ❌ Need deployment |
| **CodePen** | ✅ Quick to start | ❌ Complex URLs<br>❌ CORS issues<br>❌ Hard to debug |

---

## 📋 Complete Localhost Example

### 1. Create Files

**index.html:**
```html
<!DOCTYPE html>
<html>
<head>
  <title>Cmail OAuth Test</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 50px auto;
      padding: 20px;
    }
    button {
      padding: 12px 24px;
      background: #8b5cf6;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
    }
    .profile {
      margin-top: 20px;
      padding: 20px;
      background: #f3f4f6;
      border-radius: 8px;
    }
    img {
      width: 64px;
      height: 64px;
      border-radius: 50%;
    }
  </style>
</head>
<body>
  <h1>Test Cmail OAuth</h1>
  
  <div id="login">
    <button onclick="signIn()">Sign in with Cmail</button>
  </div>
  
  <div id="profile" style="display:none;" class="profile">
    <img id="avatar" src="" alt="Avatar">
    <h2 id="name"></h2>
    <p id="email"></p>
    <button onclick="signOut()">Sign Out</button>
  </div>

  <script>
    // Check if already logged in
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user) showProfile(user);

    function signIn() {
      const redirectUri = window.location.origin + '/callback.html';
      
      const authUrl = 'https://cmail.vercel.app/oauth/authorize?' +
        'client_id=cmail_public_api&' +
        'redirect_uri=' + encodeURIComponent(redirectUri) + '&' +
        'response_type=code&' +
        'scope=email profile';
      
      window.location.href = authUrl;
    }

    function showProfile(user) {
      document.getElementById('login').style.display = 'none';
      document.getElementById('profile').style.display = 'block';
      document.getElementById('avatar').src = user.picture;
      document.getElementById('name').textContent = user.name;
      document.getElementById('email').textContent = user.email;
    }

    function signOut() {
      localStorage.removeItem('user');
      location.reload();
    }
  </script>
</body>
</html>
```

**callback.html:**
```html
<!DOCTYPE html>
<html>
<head>
  <title>Authenticating...</title>
</head>
<body>
  <p>Signing you in...</p>
  
  <script>
    const code = new URLSearchParams(window.location.search).get('code');
    
    if (code) {
      const redirectUri = window.location.origin + '/callback.html';
      
      fetch('https://cmail.vercel.app/api/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code: code,
          client_id: 'cmail_public_api',
          redirect_uri: redirectUri
        })
      })
      .then(res => res.json())
      .then(data => {
        return fetch('https://cmail.vercel.app/api/oauth/userinfo', {
          headers: { 'Authorization': 'Bearer ' + data.access_token }
        });
      })
      .then(res => res.json())
      .then(user => {
        localStorage.setItem('user', JSON.stringify(user));
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

### 2. Run Server

```bash
# Option 1: Python
python -m http.server 8000

# Option 2: Node.js
npx serve

# Option 3: PHP
php -S localhost:8000
```

### 3. Test

1. Open `http://localhost:8000`
2. Click "Sign in with Cmail"
3. Authorize
4. You'll be redirected back
5. See your profile!

---

## 🎉 Success!

Now you'll see:
- ✅ Your profile picture
- ✅ Your name
- ✅ Your email
- ✅ NOT your inbox!

---

## 💡 Pro Tips

1. **Always use the correct redirect_uri**
2. **Test on localhost first**
3. **Deploy to a real domain for production**
4. **Don't test OAuth on CodePen** (it's complicated)

---

## 🐛 Troubleshooting

### "Redirected to inbox"
**Problem:** redirect_uri not set correctly
**Solution:** Use localhost or real domain

### "Invalid redirect_uri"
**Problem:** redirect_uri doesn't match
**Solution:** Make sure it's exactly the same in both places

### "CORS error"
**Problem:** CodePen CORS restrictions
**Solution:** Use localhost instead

---

**Test properly and it will work perfectly!** 💜🔐✨
