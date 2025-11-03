import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import CmailLogo from '../components/CmailLogo'
import Loader from '../components/Loader'

const SignUp = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: ''
  })
  const domain = '@cmail.vercel.app'
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Prevent @ symbol in username field
    if (name === 'username' && value.includes('@')) {
      setError('Username cannot contain @ symbol')
      return
    }
    
    setFormData({ ...formData, [name]: value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      const fullEmail = formData.username + domain
      const response = await axios.post('/api/auth/signup', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: fullEmail,
        password: formData.password
      })
      
      setSuccess(true)
      login(response.data.token, response.data.user)
      
      setTimeout(() => {
        navigate('/inbox')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full">
          <div className="card text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Account created!</h3>
            <p className="text-sm text-gray-600 mb-4">
              We've sent a verification email to <strong>{formData.email}</strong>
            </p>
            <p className="text-xs text-gray-500">Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <CmailLogo size="lg" />
          </div>
          <h2 className="text-3xl font-normal text-dark-text mb-2">Create your account</h2>
          <p className="text-base text-dark-text-secondary">
            to continue to C-mail
          </p>
        </div>

        <form className="card space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <input id="firstName" name="firstName" type="text" required value={formData.firstName} onChange={handleChange} className="input-field" placeholder="First name" />
            </div>
            <div>
              <input id="lastName" name="lastName" type="text" required value={formData.lastName} onChange={handleChange} className="input-field" placeholder="Last name" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-dark-text-secondary mb-2">Choose your email address</label>
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

          <div>
            <div className="relative">
              <input 
                id="password" 
                name="password" 
                type={showPassword ? 'text' : 'password'}
                required 
                value={formData.password} 
                onChange={handleChange} 
                className="input-field pr-12" 
                placeholder="Password" 
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
            <p className="mt-1 text-xs text-dark-text-secondary">Use 8 or more characters with a mix of letters, numbers & symbols</p>
          </div>

          <div className="relative">
            <input 
              id="confirmPassword" 
              name="confirmPassword" 
              type={showConfirmPassword ? 'text' : 'password'}
              required 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              className="input-field pr-12" 
              placeholder="Confirm password" 
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-text-secondary hover:text-dark-text transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Link to="/signin" className="text-sm link-purple font-medium">
              Sign in instead
            </Link>
            
            <button type="submit" disabled={loading} className="btn-primary px-8 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader size="sm" />
                  <span>Creating...</span>
                </>
              ) : 'Next'}
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-dark-text-secondary mt-8">
          By creating an account, you agree to our{' '}
          <Link to="/terms" className="link-purple">Terms of Service</Link> and{' '}
          <Link to="/privacy" className="link-purple">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
