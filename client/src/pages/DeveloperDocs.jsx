import { useState } from 'react'
import { Copy, Code, Book, Zap, Shield, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const DeveloperDocs = () => {
  const navigate = useNavigate()
  const [copiedCode, setCopiedCode] = useState('')

  // Public API credentials (no registration needed!)
  const publicClientId = 'cmail_public_api'
  // Use production URL or fallback to current origin
  const apiBaseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://cmail.vercel.app' 
    : window.location.origin

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(''), 2000)
  }

  const codeExamples = {
    javascript: `// Add "Sign in with Cmail" button
function signInWithCmail() {
  const authUrl = '${apiBaseUrl}/oauth/authorize?' +
    'client_id=cmail_public_api&' +
    'redirect_uri=' + encodeURIComponent(window.location.origin + '/callback') + '&' +
    'response_type=code&' +
    'scope=email profile';
  
  window.location.href = authUrl;
}

// Handle callback
async function handleCallback() {
  const code = new URLSearchParams(window.location.search).get('code');
  
  // Exchange code for token
  const response = await fetch('${apiBaseUrl}/api/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code: code,
      client_id: 'cmail_public_api',
      redirect_uri: window.location.origin + '/callback'
    })
  });
  
  const { access_token } = await response.json();
  
  // Get user info
  const userResponse = await fetch('${apiBaseUrl}/api/oauth/userinfo', {
    headers: { 'Authorization': 'Bearer ' + access_token }
  });
  
  const user = await userResponse.json();
  console.log('User:', user);
  // Returns: { sub, email, email_verified, name, given_name, family_name, picture }
  
  // Now you can use the user data:
  // - Display user's name: user.name
  // - Show profile picture: user.picture
  // - Get email: user.email
  // - Check if verified: user.email_verified
}`,
    
    react: `import { useEffect } from 'react';

function CmailLogin() {
  const handleLogin = () => {
    const authUrl = '${apiBaseUrl}/oauth/authorize?' +
      'client_id=cmail_public_api&' +
      'redirect_uri=' + encodeURIComponent(window.location.origin + '/callback') + '&' +
      'response_type=code&' +
      'scope=email profile';
    
    window.location.href = authUrl;
  };

  return (
    <button onClick={handleLogin} className="cmail-btn">
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
      </svg>
      Sign in with Cmail
    </button>
  );
}

function AuthCallback() {
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      fetch('${apiBaseUrl}/api/oauth/token', {
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
        localStorage.setItem('access_token', data.access_token);
        window.location.href = '/dashboard';
      });
    }
  }, []);

  return <div>Authenticating...</div>;
}`,

    html: `<!DOCTYPE html>
<html>
<head>
  <title>Cmail Login</title>
  <style>
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
      cursor: pointer;
      transition: background 0.2s;
    }
    .cmail-btn:hover {
      background: #7c3aed;
    }
  </style>
</head>
<body>
  <button class="cmail-btn" onclick="signInWithCmail()">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
    Sign in with Cmail
  </button>

  <script>
    function signInWithCmail() {
      window.location.href = '${apiBaseUrl}/oauth/authorize?' +
        'client_id=cmail_public_api&' +
        'redirect_uri=' + encodeURIComponent(window.location.origin + '/callback') + '&' +
        'response_type=code&' +
        'scope=email profile';
    }
  </script>
</body>
</html>`
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <div className="bg-dark-card border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-dark-text flex items-center space-x-3">
                <Code className="w-8 h-8 text-cmail-purple" />
                <span>Cmail Developer API</span>
              </h1>
              <p className="text-dark-text-secondary mt-2 text-lg">
                Open source authentication - No registration required!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card">
            <Zap className="w-12 h-12 text-cmail-purple mb-4" />
            <h3 className="text-xl font-semibold text-dark-text mb-2">No Registration</h3>
            <p className="text-dark-text-secondary">
              Start integrating immediately. No API keys, no sign-up required.
            </p>
          </div>
          <div className="card">
            <Shield className="w-12 h-12 text-cmail-purple mb-4" />
            <h3 className="text-xl font-semibold text-dark-text mb-2">Secure OAuth 2.0</h3>
            <p className="text-dark-text-secondary">
              Industry-standard OAuth 2.0 authorization flow for maximum security.
            </p>
          </div>
          <div className="card">
            <Book className="w-12 h-12 text-cmail-purple mb-4" />
            <h3 className="text-xl font-semibold text-dark-text mb-2">Simple Integration</h3>
            <p className="text-dark-text-secondary">
              Copy-paste code examples. Works with any framework or vanilla JS.
            </p>
          </div>
        </div>

        {/* Important Notice */}
        <div className="card mb-8 bg-yellow-900/20 border-yellow-500/50">
          <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Important: Testing on CodePen/JSFiddle</span>
          </h3>
          <div className="text-dark-text-secondary space-y-2">
            <p>⚠️ <strong>If you're testing on CodePen, JSFiddle, or similar:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>You MUST set <code className="text-yellow-400">redirect_uri</code> to your CodePen URL</li>
              <li>Example: <code className="text-yellow-400">https://codepen.io/your-username/pen/abc123</code></li>
              <li>Create a separate HTML file for the callback (see example below)</li>
              <li>Without proper redirect_uri, you'll be sent to Cmail inbox</li>
            </ul>
            <p className="mt-3 text-sm">
              💡 <strong>Best practice:</strong> Test on localhost first, then deploy to a real domain.
            </p>
          </div>
        </div>

        {/* Quick Start */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-dark-text mb-4 flex items-center space-x-2">
            <Zap className="w-6 h-6 text-cmail-purple" />
            <span>Quick Start</span>
          </h2>
          
          <div className="space-y-6">
            {/* Step 1 */}
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-cmail-purple flex items-center justify-center text-white font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold text-dark-text">Add the Login Button</h3>
              </div>
              <div className="ml-11">
                <div className="bg-dark-bg rounded-lg p-4 relative">
                  <button
                    onClick={() => copyToClipboard(codeExamples.html, 'html')}
                    className="absolute top-2 right-2 p-2 hover:bg-dark-card rounded-lg transition-colors"
                  >
                    {copiedCode === 'html' ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5 text-dark-text-secondary" />
                    )}
                  </button>
                  <pre className="text-sm text-dark-text overflow-x-auto">
                    <code>{codeExamples.html}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-cmail-purple flex items-center justify-center text-white font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold text-dark-text">Handle the Callback</h3>
              </div>
              <div className="ml-11">
                <div className="bg-dark-bg rounded-lg p-4 relative">
                  <button
                    onClick={() => copyToClipboard(codeExamples.javascript, 'js')}
                    className="absolute top-2 right-2 p-2 hover:bg-dark-card rounded-lg transition-colors"
                  >
                    {copiedCode === 'js' ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5 text-dark-text-secondary" />
                    )}
                  </button>
                  <pre className="text-sm text-dark-text overflow-x-auto">
                    <code>{codeExamples.javascript}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-cmail-purple flex items-center justify-center text-white font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold text-dark-text">You're Done! 🎉</h3>
              </div>
              <div className="ml-11">
                <p className="text-dark-text-secondary">
                  That's it! Your app now has "Sign in with Cmail" authentication.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* React Example */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-dark-text mb-4">React Example</h2>
          <div className="bg-dark-bg rounded-lg p-4 relative">
            <button
              onClick={() => copyToClipboard(codeExamples.react, 'react')}
              className="absolute top-2 right-2 p-2 hover:bg-dark-card rounded-lg transition-colors"
            >
              {copiedCode === 'react' ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <Copy className="w-5 h-5 text-dark-text-secondary" />
              )}
            </button>
            <pre className="text-sm text-dark-text overflow-x-auto">
              <code>{codeExamples.react}</code>
            </pre>
          </div>
        </div>

        {/* API Reference */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-dark-text mb-4">API Reference</h2>
          
          <div className="space-y-6">
            {/* Authorization Endpoint */}
            <div>
              <h3 className="text-lg font-semibold text-dark-text mb-2">Authorization Endpoint</h3>
              <div className="bg-dark-bg rounded-lg p-4">
                <code className="text-cmail-purple">GET {apiBaseUrl}/oauth/authorize</code>
                <div className="mt-4 space-y-2">
                  <p className="text-dark-text-secondary text-sm"><strong>Parameters:</strong></p>
                  <ul className="list-disc list-inside text-dark-text-secondary text-sm space-y-1 ml-4">
                    <li><code>client_id</code>: <code className="text-cmail-purple">cmail_public_api</code></li>
                    <li><code>redirect_uri</code>: Your callback URL</li>
                    <li><code>response_type</code>: <code className="text-cmail-purple">code</code></li>
                    <li><code>scope</code>: <code className="text-cmail-purple">email profile</code> (optional)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Token Endpoint */}
            <div>
              <h3 className="text-lg font-semibold text-dark-text mb-2">Token Endpoint</h3>
              <div className="bg-dark-bg rounded-lg p-4">
                <code className="text-cmail-purple">POST {apiBaseUrl}/api/oauth/token</code>
                <div className="mt-4">
                  <p className="text-dark-text-secondary text-sm mb-2"><strong>Body:</strong></p>
                  <pre className="text-sm text-dark-text">
{`{
  "grant_type": "authorization_code",
  "code": "authorization_code",
  "client_id": "cmail_public_api",
  "redirect_uri": "your_callback_url"
}`}
                  </pre>
                </div>
              </div>
            </div>

            {/* UserInfo Endpoint */}
            <div>
              <h3 className="text-lg font-semibold text-dark-text mb-2">UserInfo Endpoint</h3>
              <div className="bg-dark-bg rounded-lg p-4">
                <code className="text-cmail-purple">GET {apiBaseUrl}/api/oauth/userinfo</code>
                <div className="mt-4">
                  <p className="text-dark-text-secondary text-sm mb-2"><strong>Headers:</strong></p>
                  <code className="text-sm text-dark-text">Authorization: Bearer {'{access_token}'}</code>
                  <p className="text-dark-text-secondary text-sm mt-4 mb-2"><strong>Response (Full User Profile):</strong></p>
                  <pre className="text-sm text-dark-text">
{`{
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
}`}
                  </pre>
                  <div className="mt-4 p-3 bg-cmail-purple/10 rounded-lg">
                    <p className="text-sm text-dark-text mb-2"><strong>✨ What You Get:</strong></p>
                    <ul className="text-sm text-dark-text-secondary space-y-1 list-disc list-inside">
                      <li><code className="text-cmail-purple">sub</code> - Unique user ID</li>
                      <li><code className="text-cmail-purple">email</code> - User's email address</li>
                      <li><code className="text-cmail-purple">name</code> - Full name (John Doe)</li>
                      <li><code className="text-cmail-purple">given_name</code> - First name</li>
                      <li><code className="text-cmail-purple">family_name</code> - Last name</li>
                      <li><code className="text-cmail-purple">picture</code> - Profile picture URL</li>
                      <li><code className="text-cmail-purple">email_verified</code> - Email verification status</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Public Credentials */}
        <div className="card bg-cmail-purple/10 border-cmail-purple/30">
          <h2 className="text-2xl font-bold text-dark-text mb-4">Public Credentials</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-dark-text-secondary mb-2">Client ID (Public)</label>
              <div className="flex items-center space-x-2">
                <code className="flex-1 px-4 py-2 bg-dark-bg rounded-lg text-dark-text font-mono text-sm">
                  {publicClientId}
                </code>
                <button
                  onClick={() => copyToClipboard(publicClientId, 'clientId')}
                  className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
                >
                  {copiedCode === 'clientId' ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-dark-text-secondary" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-dark-text-secondary mb-2">API Base URL</label>
              <div className="flex items-center space-x-2">
                <code className="flex-1 px-4 py-2 bg-dark-bg rounded-lg text-dark-text font-mono text-sm">
                  {apiBaseUrl}
                </code>
                <button
                  onClick={() => copyToClipboard(apiBaseUrl, 'baseUrl')}
                  className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
                >
                  {copiedCode === 'baseUrl' ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-dark-text-secondary" />
                  )}
                </button>
              </div>
            </div>
            <p className="text-sm text-dark-text-secondary mt-4">
              ✨ <strong>No client secret needed!</strong> This is a public API - just use the client ID above.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeveloperDocs
