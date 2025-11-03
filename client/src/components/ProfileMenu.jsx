import { useState, useEffect } from 'react'
import { User, LogOut, Plus, ChevronDown, ChevronUp, Camera } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const ProfileMenu = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const [showMoreAccounts, setShowMoreAccounts] = useState(false)
  const [storageUsed, setStorageUsed] = useState(0)
  const storageLimit = 15 * 1024 * 1024 * 1024 // 15 GB in bytes

  const handleLogout = () => {
    logout()
    navigate('/login')
    setShowMenu(false)
  }

  useEffect(() => {
    if (user) {
      fetchStorageUsage()
    }
  }, [user])

  const fetchStorageUsage = async () => {
    try {
      // Fetch total file storage
      const filesResponse = await axios.get('/api/files/storage')
      const fileStorage = filesResponse.data.totalSize || 0

      // Fetch email storage (approximate)
      const emailsResponse = await axios.get('/api/emails/storage')
      const emailStorage = emailsResponse.data.totalSize || 0

      setStorageUsed(fileStorage + emailStorage)
    } catch (error) {
      console.error('Error fetching storage:', error)
      // Fallback to approximate calculation
      setStorageUsed(0.15 * 1024 * 1024 * 1024) // 150 MB default
    }
  }

  const getInitials = () => {
    if (!user) return 'U'
    const firstInitial = user.firstName?.[0] || ''
    const lastInitial = user.lastName?.[0] || ''
    return (firstInitial + lastInitial).toUpperCase() || 'U'
  }

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 GB'
    const gb = bytes / (1024 * 1024 * 1024)
    return gb.toFixed(2) + ' GB'
  }

  const getStoragePercentage = () => {
    return Math.min((storageUsed / storageLimit) * 100, 100)
  }

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="w-10 h-10 rounded-full hover:shadow-lg transition-all overflow-hidden"
      >
        {user?.profilePicture ? (
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cmail-purple to-purple-600 text-white font-medium flex items-center justify-center">
            {getInitials()}
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          ></div>

          {/* Menu */}
          <div className="absolute right-0 top-12 w-[400px] bg-dark-card border border-dark-border rounded-2xl shadow-2xl z-50 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-dark-border flex items-center justify-between">
              <span className="text-dark-text font-medium">{user?.email}</span>
              <button
                onClick={() => setShowMenu(false)}
                className="p-1 hover:bg-dark-bg rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-dark-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Profile Section */}
            <div className="px-6 py-8 text-center">
              {/* Profile Picture */}
              <div className="relative inline-block mb-4">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cmail-purple to-purple-600 text-white text-3xl font-bold flex items-center justify-center">
                    {getInitials()}
                  </div>
                )}
                <button 
                  onClick={() => {
                    navigate('/account')
                    setShowMenu(false)
                  }}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-dark-bg border-2 border-dark-card rounded-full flex items-center justify-center hover:bg-dark-border transition-colors"
                >
                  <Camera className="w-4 h-4 text-dark-text-secondary" />
                </button>
              </div>

              {/* Greeting */}
              <h2 className="text-2xl text-dark-text font-normal mb-6">
                Hi, {user?.firstName || 'User'}!
              </h2>

              {/* Manage Account Button */}
              <button
                onClick={() => {
                  navigate('/account')
                  setShowMenu(false)
                }}
                className="px-8 py-3 border border-dark-border text-dark-text rounded-full hover:bg-dark-bg transition-colors font-medium"
              >
                Manage your Cmail Account
              </button>
            </div>

            {/* More Accounts Section */}
            <div className="border-t border-dark-border">
              <button
                onClick={() => setShowMoreAccounts(!showMoreAccounts)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-dark-bg transition-colors"
              >
                <span className="text-dark-text font-medium">
                  {showMoreAccounts ? 'Hide more accounts' : 'Show more accounts'}
                </span>
                {showMoreAccounts ? (
                  <ChevronUp className="w-5 h-5 text-dark-text-secondary" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-dark-text-secondary" />
                )}
              </button>

              {showMoreAccounts && (
                <div className="px-6 pb-4">
                  {/* Additional accounts would go here */}
                  <div className="text-sm text-dark-text-secondary text-center py-4">
                    No other accounts
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="border-t border-dark-border">
              <button
                onClick={() => {
                  navigate('/login')
                  setShowMenu(false)
                }}
                className="w-full px-6 py-4 flex items-center gap-4 hover:bg-dark-bg transition-colors text-dark-text"
              >
                <Plus className="w-5 h-5" />
                <span>Add another account</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full px-6 py-4 flex items-center gap-4 hover:bg-dark-bg transition-colors text-dark-text border-t border-dark-border"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign out of all accounts</span>
              </button>
            </div>

            {/* Storage Info */}
            <div className="border-t border-dark-border px-6 py-4 bg-dark-bg/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                    <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                    <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-dark-text">
                    {formatBytes(storageUsed)} of {formatBytes(storageLimit)} used
                  </div>
                  <div className="w-full bg-dark-border rounded-full h-1.5 mt-1">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all" 
                      style={{ width: `${getStoragePercentage()}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 text-center border-t border-dark-border">
              <div className="flex items-center justify-center gap-4 text-xs text-dark-text-secondary">
                <button className="hover:text-dark-text transition-colors">Privacy Policy</button>
                <span>•</span>
                <button className="hover:text-dark-text transition-colors">Terms of Service</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ProfileMenu
