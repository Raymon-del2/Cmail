import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, XCircle, Loader } from 'lucide-react'
import axios from 'axios'
import CmailLogo from '../components/CmailLogo'

const VerifyEmail = () => {
  const { token } = useParams()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`/api/auth/verify-email/${token}`)
        setStatus('success')
        setMessage(response.data.message)
      } catch (err) {
        setStatus('error')
        setMessage(err.response?.data?.message || 'Failed to verify email')
      }
    }

    verifyEmail()
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CmailLogo size="lg" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Email Verification</h2>
        </div>

        <div className="card text-center">
          {status === 'loading' && (
            <>
              <Loader className="h-12 w-12 text-cmail-blue mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Verifying your email...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Email verified!</h3>
              <p className="text-sm text-gray-600 mb-6">{message}</p>
              <Link to="/signin" className="btn-primary inline-block">
                Go to Sign In
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Verification failed</h3>
              <p className="text-sm text-gray-600 mb-6">{message}</p>
              <Link to="/signin" className="btn-secondary inline-block">
                Back to Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
