import { useState } from 'react'
import { Copy, Code, CheckCircle } from 'lucide-react'

const DeveloperDocs = () => {
  const [copiedCode, setCopiedCode] = useState('')

  const publicClientId = 'cmail_public_api'
  const apiBaseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://c-mail.vercel.app' 
    : 'http://c-mail.vercel.app'

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

  const tokenBodyExample = `{
  "grant_type": "authorization_code",
  "code": "authorization_code",
  "client_id": "cmail_public_api",
  "redirect_uri": "your_callback_url"
}`

  const userInfoResponseExample = `{
  "sub": "user_id_12345",
  "email": "john@cmail.vercel.app",
  "email_verified": true,
  "name": "John Doe",
  "given_name": "John",
  "family_name": "Doe",
  "picture": "https://ui-avatars.com/api/?name=John+Doe"
}`

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="bg-dark-card border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-dark-text flex items-center space-x-3">
            <Code className="w-8 h-8 text-cmail-purple" />
            <span>Cmail Developer API</span>
          </h1>
          <p className="text-dark-text-secondary mt-2">
            OAuth 2.0 authentication - No registration required
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Start */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-dark-text mb-4">Quick Start</h2>
          
          <div className="space-y-6">
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

            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-cmail-purple flex items-center justify-center text-white font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold text-dark-text">React Example</h3>
              </div>
              <div className="ml-11">
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
            </div>
          </div>
        </div>

        {/* API Reference */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-dark-text mb-4">API Reference</h2>
          
          <div className="space-y-6">
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
                    <li><code>scope</code>: <code className="text-cmail-purple">email profile</code></li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-dark-text mb-2">Token Endpoint</h3>
              <div className="bg-dark-bg rounded-lg p-4">
                <code className="text-cmail-purple">POST {apiBaseUrl}/api/oauth/token</code>
                <div className="mt-4">
                  <p className="text-dark-text-secondary text-sm mb-2"><strong>Body:</strong></p>
                  <pre className="text-sm text-dark-text">{tokenBodyExample}</pre>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-dark-text mb-2">UserInfo Endpoint</h3>
              <div className="bg-dark-bg rounded-lg p-4">
                <code className="text-cmail-purple">GET {apiBaseUrl}/api/oauth/userinfo</code>
                <div className="mt-4">
                  <p className="text-dark-text-secondary text-sm mb-2"><strong>Headers:</strong></p>
                  <code className="text-sm text-dark-text">Authorization: Bearer {'{access_token}'}</code>
                  <p className="text-dark-text-secondary text-sm mt-4 mb-2"><strong>Response:</strong></p>
                  <pre className="text-sm text-dark-text">{userInfoResponseExample}</pre>
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
              <label className="block text-sm text-dark-text-secondary mb-2">Client ID</label>
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeveloperDocs
