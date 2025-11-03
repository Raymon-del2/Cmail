import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Shield, AlertCircle, CheckCircle } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import CmailLogo from '../components/CmailLogo'

const OAuthAuthorize = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [app, setApp] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [granting, setGranting] = useState(false)

  const clientId = searchParams.get('client_id')
  const redirectUri = searchParams.get('redirect_uri')
  const scope = searchParams.get('scope')
  const state = searchParams.get('state')
  const responseType = searchParams.get('response_type')

  useEffect(() => {
    if (!user) {
      // Redirect to sign in with return URL
      const returnUrl = `/oauth/authorize?${searchParams.toString()}`
      navigate(`/signin?return=${encodeURIComponent(returnUrl)}`)
      return
    }

    fetchAppInfo()
  }, [user])

  const fetchAppInfo = async () => {
    try {
      const response = await axios.get('/api/oauth/authorize', {
        params: {
          client_id: clientId,
          redirect_uri: redirectUri,
          scope,
          state,
          response_type: responseType
        }
      })
      setApp(response.data.app)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid authorization request')
    } finally {
      setLoading(false)
    }
  }

  const handleGrant = async () => {
    setGranting(true)
    setError('')

    try {
      const response = await axios.post('/api/oauth/authorize/grant', {
        client_id: clientId,
        redirect_uri: redirectUri,
        scope,
        state
      })

      // Redirect to app with authorization code
      window.location.href = response.data.redirectUrl
    } catch (err) {
      setError(err.response?.data?.message || 'Authorization failed')
      setGranting(false)
    }
  }

  const handleDeny = () => {
    // Redirect back with error
    const url = new URL(redirectUri)
    url.searchParams.append('error', 'access_denied')
    url.searchParams.append('error_description', 'User denied authorization')
    if (state) url.searchParams.append('state', state)
    window.location.href = url.toString()
  }

  const scopeDescriptions = {
    email: 'View your email address',
    profile: 'View your profile information (name, picture)',
    read_emails: 'Read your emails',
    send_emails: 'Send emails on your behalf',
    manage_emails: 'Manage your emails (read, send, delete, organize)'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cmail-purple"></div>
      </div>
    )
  }

  if (error && !app) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
        <div className="card max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-dark-text mb-2">Authorization Error</h2>
          <p className="text-dark-text-secondary mb-6">{error}</p>
          <button
            onClick={() => navigate('/inbox')}
            className="btn-primary"
          >
            Go to Inbox
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <CmailLogo size="lg" className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-dark-text">Authorize Application</h1>
        </div>

        {/* App Info Card */}
        <div className="card mb-6">
          <div className="text-center mb-6">
            {app.logo ? (
              <img src={app.logo} alt={app.name} className="w-16 h-16 mx-auto rounded-lg mb-3" />
            ) : (
              <div className="w-16 h-16 mx-auto rounded-lg bg-cmail-purple/20 flex items-center justify-center mb-3">
                <Shield className="w-8 h-8 text-cmail-purple" />
              </div>
            )}
            <h2 className="text-xl font-semibold text-dark-text">{app.name}</h2>
            <p className="text-dark-text-secondary text-sm mt-1">{app.description}</p>
            <a
              href={app.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cmail-purple text-sm hover:underline mt-2 inline-block"
            >
              {app.website}
            </a>
          </div>

          <div className="border-t border-dark-border pt-6">
            <p className="text-dark-text mb-4">
              <strong>{app.name}</strong> wants to access your Cmail account:
            </p>

            <div className="space-y-3">
              {app.scopes.map((scope) => (
                <div key={scope} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-dark-text font-medium">{scopeDescriptions[scope]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="card mb-6">
          <p className="text-dark-text-secondary text-sm mb-3">Signing in as:</p>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-cmail-purple flex items-center justify-center text-white font-semibold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <p className="text-dark-text font-medium">{user?.firstName} {user?.lastName}</p>
              <p className="text-dark-text-secondary text-sm">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleGrant}
            disabled={granting}
            className="w-full btn-primary flex items-center justify-center"
          >
            {granting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Authorizing...
              </>
            ) : (
              'Authorize'
            )}
          </button>
          <button
            onClick={handleDeny}
            disabled={granting}
            className="w-full btn-secondary"
          >
            Cancel
          </button>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-dark-card/50 rounded-lg border border-dark-border">
          <div className="flex items-start space-x-2">
            <Shield className="w-5 h-5 text-cmail-purple flex-shrink-0 mt-0.5" />
            <div className="text-sm text-dark-text-secondary">
              <p className="font-medium text-dark-text mb-1">Security Notice</p>
              <p>
                By authorizing, you allow this app to access your Cmail account with the permissions listed above. 
                You can revoke access anytime from your account settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OAuthAuthorize
