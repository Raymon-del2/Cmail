import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Loader } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import CmailLogo from '../components/CmailLogo'

const VerifyMagicLink = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const { login } = useAuth()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verifyMagicLink = async () => {
      try {
        const response = await axios.get(`/api/auth/verify-magic-link/${token}`)
        setStatus('success')
        setMessage(response.data.message)
        login(response.data.token, response.data.user)
        setTimeout(() => navigate('/inbox'), 1500)
      } catch (err) {
        setStatus('error')
        setMessage(err.response?.data?.message || 'Failed to verify magic link')
      }
    }

    verifyMagicLink()
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CmailLogo size="lg" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Magic Link Sign In</h2>
        </div>

        <div className="card text-center">
          {status === 'loading' && (
            <>
              <Loader className="h-12 w-12 text-cmail-blue mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Signing you in...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Success!</h3>
              <p className="text-sm text-gray-600">{message}</p>
              <p className="text-xs text-gray-500 mt-2">Redirecting to dashboard...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Sign in failed</h3>
              <p className="text-sm text-gray-600 mb-6">{message}</p>
              <button onClick={() => navigate('/signin')} className="btn-primary">
                Back to Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default VerifyMagicLink
