import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import CmailLogo from '../components/CmailLogo'
import Loader from '../components/Loader'

const SignIn = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const domain = '@cmail.vercel.app'
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const fullEmail = formData.username + domain

    try {
      console.log('Attempting sign in...')
      const response = await axios.post('/api/auth/signin', {
        email: fullEmail,
        password: formData.password
      })
      console.log('Sign in response:', response.data)
      login(response.data.token, response.data.user)
      
      // Check for return URL (for OAuth flow)
      const returnUrl = searchParams.get('return')
      if (returnUrl) {
        console.log('Redirecting to return URL:', returnUrl)
        navigate(decodeURIComponent(returnUrl))
      } else {
        console.log('Navigating to inbox...')
        navigate('/inbox')
      }
    } catch (err) {
      console.error('Sign in error:', err)
      setError(err.response?.data?.message || 'Failed to sign in')
      setLoading(false)
    }
  }

  const handleMagicLink = async () => {
    if (!formData.username) {
      setError('Please enter your username')
      return
    }

    setError('')
    setLoading(true)

    try {
      const fullEmail = formData.username + domain
      await axios.post('/api/auth/magic-link', { email: fullEmail })
      setMagicLinkSent(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send magic link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <CmailLogo size="lg" />
          </div>
          <h2 className="text-3xl font-normal text-dark-text mb-2">Sign in</h2>
          <p className="text-base text-dark-text-secondary">
            to continue to C-mail
          </p>
        </div>

        {magicLinkSent ? (
          <div className="card">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-cmail-purple/20 mb-4">
                <Mail className="h-6 w-6 text-cmail-purple" />
              </div>
              <h3 className="text-lg font-medium text-dark-text mb-2">Check your email</h3>
              <p className="text-sm text-dark-text-secondary mb-4">
                We've sent a magic link to <strong className="text-dark-text">{formData.username + domain}</strong>
              </p>
              <p className="text-xs text-dark-text-secondary">
                Click the link in the email to sign in. The link will expire in 15 minutes.
              </p>
              <button
                onClick={() => setMagicLinkSent(false)}
                className="mt-4 text-sm link-purple"
              >
                Back to sign in
              </button>
            </div>
          </div>
        ) : (
          <form className="card space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm text-dark-text-secondary mb-2">Enter your username</label>
              <div className="flex items-center gap-0">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="input-field rounded-r-none border-r-0 flex-1"
                  placeholder="username"
                />
                <div className="px-4 py-3 bg-dark-card border border-dark-border border-l-0 rounded-r-lg text-dark-text-secondary">
                  {domain}
                </div>
              </div>
            </div>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                className="input-field pr-12"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-text-secondary hover:text-dark-text transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <Link to="/forgot-password" className="text-sm link-purple font-medium">
                Forgot password?
              </Link>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Link to="/signup" className="text-sm link-purple font-medium">
                Create account
              </Link>
              
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-8 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size="sm" />
                    <span>Signing in...</span>
                  </>
                ) : 'Next'}
              </button>
            </div>

            <div className="relative pt-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-dark-card text-dark-text-secondary">Or sign in with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleMagicLink}
              disabled={loading}
              className="w-full btn-secondary flex items-center justify-center"
            >
              <Mail className="h-5 w-5 mr-2" />
              Magic Link
            </button>
          </form>
        )}

        <p className="text-center text-xs text-dark-text-secondary mt-8">
          By signing in, you agree to our{' '}
          <Link to="/terms" className="link-purple">Terms of Service</Link> and{' '}
          <Link to="/privacy" className="link-purple">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}

export default SignIn
