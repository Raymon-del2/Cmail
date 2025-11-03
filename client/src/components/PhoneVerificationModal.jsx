import { useState, useEffect } from 'react'
import { X, Phone, Check } from 'lucide-react'
import axios from 'axios'

const PhoneVerificationModal = ({ isOpen, onClose, phone, onVerified }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (isOpen && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isOpen, timeLeft])

  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', '', '', ''])
      setError('')
      setSuccess(false)
      setTimeLeft(300)
      setCanResend(false)
    }
  }, [isOpen])

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError('')

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }

    // Auto-submit when all fields are filled
    if (index === 5 && value) {
      const fullOtp = newOtp.join('')
      if (fullOtp.length === 6) {
        handleVerify(fullOtp)
      }
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handleVerify = async (code = null) => {
    const otpCode = code || otp.join('')
    
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await axios.post('/api/phone-verification/verify-otp', {
        phone,
        otp: otpCode
      })

      if (response.data.success) {
        setSuccess(true)
        setTimeout(() => {
          onVerified(response.data.user)
          onClose()
        }, 1500)
      }
    } catch (error) {
      console.error('Verification error:', error)
      setError(error.response?.data?.message || 'Invalid verification code')
      setOtp(['', '', '', '', '', ''])
      document.getElementById('otp-0')?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await axios.post('/api/phone-verification/resend-otp', {
        phone
      })

      if (response.data.success) {
        setTimeLeft(300)
        setCanResend(false)
        setOtp(['', '', '', '', '', ''])
        
        // Show dev OTP in console for testing
        if (response.data.devOTP) {
          console.log('🔐 Verification code:', response.data.devOTP)
        }
        
        alert('Verification code resent successfully')
      }
    } catch (error) {
      console.error('Resend error:', error)
      setError(error.response?.data?.message || 'Failed to resend code')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-dark-card rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-dark-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
          <div className="flex items-center gap-3">
            <Phone className="w-6 h-6 text-cmail-purple" />
            <h2 className="text-xl font-medium text-dark-text">Verify Phone Number</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-bg rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-dark-text-secondary" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-medium text-dark-text mb-2">Verified!</h3>
              <p className="text-dark-text-secondary">Your phone number has been verified successfully</p>
            </div>
          ) : (
            <>
              <p className="text-dark-text-secondary mb-6 text-center">
                Enter the 6-digit code sent to<br />
                <span className="font-medium text-dark-text">{phone}</span>
              </p>

              {/* OTP Input */}
              <div className="flex gap-2 justify-center mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold bg-dark-bg border-2 border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-cmail-purple transition-colors"
                    disabled={loading || success}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
                  {error}
                </div>
              )}

              {/* Timer */}
              <div className="text-center mb-4">
                {timeLeft > 0 ? (
                  <p className="text-sm text-dark-text-secondary">
                    Code expires in <span className="font-medium text-cmail-purple">{formatTime(timeLeft)}</span>
                  </p>
                ) : (
                  <p className="text-sm text-red-500">Code expired</p>
                )}
              </div>

              {/* Resend */}
              <div className="text-center">
                {canResend ? (
                  <button
                    onClick={handleResend}
                    disabled={loading}
                    className="text-sm text-cmail-purple hover:underline disabled:opacity-50"
                  >
                    Resend code
                  </button>
                ) : (
                  <p className="text-sm text-dark-text-secondary">
                    Didn't receive the code?{' '}
                    <span className="text-dark-text-secondary/50">Wait {formatTime(timeLeft)}</span>
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!success && (
          <div className="flex gap-3 px-6 py-4 border-t border-dark-border">
            <button
              onClick={onClose}
              className="flex-1 border border-dark-border text-dark-text px-6 py-3 rounded-full font-medium hover:bg-dark-bg transition-all"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={() => handleVerify()}
              disabled={loading || otp.join('').length !== 6}
              className="flex-1 bg-cmail-purple text-white px-6 py-3 rounded-full font-medium hover:bg-cmail-purple-dark transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PhoneVerificationModal
