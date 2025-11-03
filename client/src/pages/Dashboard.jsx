import { useNavigate } from 'react-router-dom'
import { LogOut, User, Mail, Shield, Calendar } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import CmailLogo from '../components/CmailLogo'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/signin')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <CmailLogo size="sm" />
              <span className="ml-3 text-xl font-bold text-gray-900">C-mail</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cmail-blue hover:bg-blue-600"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome to C-mail!</h1>
            <p className="mt-2 text-gray-600">Your account is successfully set up.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="h-6 w-6 text-cmail-blue" />
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Profile Information</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="text-base font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="text-base font-medium text-gray-900">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="h-6 w-6 text-cmail-green" />
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Account Status</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Email Verification</span>
                  {user?.isVerified ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Authentication Method</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {user?.authMethod || 'Password'}
                  </span>
                </div>
              </div>
            </div>

            <div className="card md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Mail className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Getting Started</h3>
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-600">
                  Your C-mail authentication system is now active! This system provides:
                </p>
                <ul className="mt-2 space-y-2 text-gray-600">
                  <li>✅ Secure password-based authentication with bcrypt hashing</li>
                  <li>✅ Magic link sign-in for passwordless authentication</li>
                  <li>✅ Email verification system</li>
                  <li>✅ Password reset functionality</li>
                  <li>✅ JWT token-based session management</li>
                  <li>✅ Protected routes and user profile management</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
